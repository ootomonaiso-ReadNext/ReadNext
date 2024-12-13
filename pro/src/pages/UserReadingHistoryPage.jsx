import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext"; 
import { db } from "../firebaseConfig";
import { collection, getDocs, orderBy, query, doc, getDoc } from "firebase/firestore";
import {
  Typography,
  Container,
  Box,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Avatar,
} from "@mui/material";
import Layout from "../components/Layout";

// ユーザーの読書履歴ページ
const UserReadingHistoryPage = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // 本の情報を取得する関数
  const fetchBookDetails = async (bookId) => {
    const bookDocRef = doc(db, "books", bookId);  // 本のコレクションから本の詳細を取得
    const bookDocSnap = await getDoc(bookDocRef);
    if (bookDocSnap.exists()) {
      return bookDocSnap.data();  // 本の詳細情報を返す
    }
    return null;  // 本の情報が見つからなかった場合はnullを返す
  };

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

        // 本の詳細情報を取得
        const bookDetails = await fetchBookDetails(bookId);

        statusHistorySnapshot.docs.forEach((doc) => {
          historyData.push({
            bookId,
            bookName: bookDetails ? bookDetails.title : "不明",  // 本の名前を取得
            bookThumbnail: bookDetails ? bookDetails.thumbnail : "",  // 本のサムネイルを取得
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
                    <Grid container alignItems="center">
                      <Grid item>
                        <Avatar src={entry.bookThumbnail} alt={entry.bookName} />
                      </Grid>
                      <Grid item xs>
                        <Box ml={2}>  {/* アイコンとテキストの間にスペースを追加 */}
                          <Typography variant="body1">
                            <strong>本の名前:</strong> {entry.bookName}
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
                        </Box>
                      </Grid>
                    </Grid>
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
