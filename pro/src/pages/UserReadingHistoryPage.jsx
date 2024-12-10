import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext"; 
import { db } from "../firebaseConfig";
import { collection, getDocs, doc, getDoc, orderBy, query } from "firebase/firestore";
import {
  Typography,
  Container,
  Box,
  CircularProgress,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import Layout from "../components/Layout";

// ユーザーの読書履歴ページ
const UserReadingHistoryPage = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReadingHistory = useCallback(async () => {
    try {
      setLoading(true);
      const userBooksQuery = collection(db, "users", user.uid, "userBooks");
      const userBooksSnapshot = await getDocs(userBooksQuery);

      let historyData = [];

      // 各本の`statusHistory`コレクションを取得
      for (const userBookDoc of userBooksSnapshot.docs) {
        const bookId = userBookDoc.id;
        const statusHistoryQuery = query(
          collection(db, "users", user.uid, "userBooks", bookId, "statusHistory"),
          orderBy("changedAt", "desc")
        );
        const statusHistorySnapshot = await getDocs(statusHistoryQuery);

        // 本のタイトルを取得
        const bookDocRef = doc(db, "books", bookId);
        const bookSnapshot = await getDoc(bookDocRef);
        const bookTitle = bookSnapshot.exists() ? bookSnapshot.data().title : "タイトル不明";

        statusHistorySnapshot.docs.forEach((doc) => {
          historyData.push({
            bookTitle, // 本のタイトルを追加
            ...doc.data(),
            changedAt: doc.data().changedAt.toDate(), // FirestoreのタイムスタンプをDate型に変換
          });
        });
      }

      // 時系列順にソート
      historyData.sort((a, b) => b.changedAt - a.changedAt);

      setHistory(historyData);
    } catch (error) {
      console.error("Error fetching reading history:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchReadingHistory();
    }
  }, [user, fetchReadingHistory]);

  return (
    <Layout>
      <Container maxWidth="lg">
        <Typography variant="h4" component="h1" gutterBottom sx={{ my: 4 }}>
          あなたの読書履歴
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" my={8}>
            <CircularProgress />
          </Box>
        ) : history.length === 0 ? (
          <Box textAlign="center" my={8}>
            <Typography variant="body1" color="textSecondary">
              現在、読書履歴がありません。
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {history.map((entry, index) => (
              <Grid item xs={12} key={index}>
                <Card>
                  <CardContent>
                    <Typography variant="body1">
                      <strong>本のタイトル:</strong> {entry.bookTitle} {/* タイトルを表示 */}
                    </Typography>
                    <Typography variant="body1">
                      <strong>ステータス:</strong> {entry.status}
                    </Typography>
                    <Typography variant="body1">
                      <strong>変更日:</strong>{" "}
                      {entry.changedAt.toLocaleString("ja-JP")}
                    </Typography>
                    <Typography variant="body1">
                      <strong>変更者:</strong> {entry.changedBy}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Layout>
  );
};

export default UserReadingHistoryPage;
