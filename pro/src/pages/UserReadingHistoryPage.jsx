import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { db } from "../firebaseConfig";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
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

const UserReadingHistoryPage = () => {
  const { userId } = useParams();
  const [userName, setUserName] = useState("");
  const [history, setHistory] = useState([]);
  const [bookshelf, setBookshelf] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserData = useCallback(async () => {
    try {
      setLoading(true);

      // ユーザー情報の取得
      const userRef = doc(db, "users", userId);
      const userSnapshot = await getDoc(userRef);
      if (userSnapshot.exists()) {
        setUserName(userSnapshot.data().userName || "Unknown User");
      } else {
        setUserName("ユーザー不明");
        return;
      }

      // 蔵書一覧の取得
      const userBooksQuery = collection(db, "users", userId, "userBooks");
      const userBooksSnapshot = await getDocs(userBooksQuery);
      let bookshelfData = [];
      for (const userBookDoc of userBooksSnapshot.docs) {
        const bookData = userBookDoc.data();
        const bookId = bookData.bookId;

        // 本のタイトルを取得
        const bookDocRef = doc(db, "books", bookId);
        const bookSnapshot = await getDoc(bookDocRef);
        const bookTitle = bookSnapshot.exists()
          ? bookSnapshot.data().title
          : "タイトル不明";

        // 蔵書データにタイトルを追加
        bookshelfData.push({
          ...bookData,
          title: bookTitle,
          bookId,
        });
      }
      setBookshelf(bookshelfData);

      // 読書履歴の取得
      let historyData = [];
      for (const userBookDoc of userBooksSnapshot.docs) {
        const bookId = userBookDoc.id;

        const statusHistoryQuery = collection(
          db,
          "users",
          userId,
          "userBooks",
          bookId,
          "statusHistory"
        );
        const statusHistorySnapshot = await getDocs(statusHistoryQuery);

        const bookDocRef = doc(db, "books", bookId);
        const bookSnapshot = await getDoc(bookDocRef);
        const bookTitle = bookSnapshot.exists()
          ? bookSnapshot.data().title
          : "タイトル不明";

        statusHistorySnapshot.docs.forEach((doc) => {
          historyData.push({
            bookTitle,
            bookId,
            ...doc.data(),
            changedAt: doc.data().changedAt.toDate(),
          });
        });
      }
      historyData.sort((a, b) => b.changedAt - a.changedAt);
      setHistory(historyData);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchUserData();
    }
  }, [userId, fetchUserData]);

  return (
    <Layout>
      <Container maxWidth="lg">
        <Typography variant="h4" component="h1" gutterBottom sx={{ my: 4 }}>
          {userName ? `${userName}さんの読書履歴` : "読み込み中..."}
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" my={8}>
            <CircularProgress />
          </Box>
        ) : (
          <Box>
            {/* 読書履歴 */}
            <Box sx={{ my: 4 }}>
              <Typography variant="h5" gutterBottom>
                読書履歴
              </Typography>
              <Grid container spacing={3}>
                {history.map((entry, index) => (
                  <Grid item xs={12} key={index}>
                    <Card>
                      <CardContent>
                        <Typography
                          variant="h6"
                          component={Link}
                          to={`/books/${entry.bookId}/threads`}
                          sx={{
                            textDecoration: "none",
                            color: "inherit",
                            "&:hover": { textDecoration: "underline" },
                          }}
                        >
                          {entry.bookTitle || "タイトル不明"}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          <strong>ステータス:</strong> {entry.status || "不明"}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          <strong>変更日:</strong>{" "}
                          {entry.changedAt.toLocaleString("ja-JP")}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* 蔵書一覧 */}
            <Box sx={{ my: 4 }}>
              <Typography variant="h5" gutterBottom>
                蔵書一覧
              </Typography>
              <Grid container spacing={3}>
                {bookshelf.map((book, index) => (
                  <Grid item xs={12} key={index}>
                    <Card>
                      <CardContent>
                        <Typography
                          variant="h6"
                          component={Link}
                          to={`/books/${book.bookId}/threads`}
                          sx={{
                            textDecoration: "none",
                            color: "inherit",
                            "&:hover": { textDecoration: "underline" },
                          }}
                        >
                          {book.title || "タイトル不明"}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Box>
        )}
      </Container>
    </Layout>
  );
};

export default UserReadingHistoryPage;
