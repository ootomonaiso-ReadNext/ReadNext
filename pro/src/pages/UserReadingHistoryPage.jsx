import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { db } from "../firebaseConfig";
import { collection, getDocs, doc, getDoc, query, orderBy } from "firebase/firestore";
import {
  Typography,
  Container,
  Box,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import Layout from "../components/Layout";

// ユーザーの読書履歴ページ
const UserReadingHistoryPage = () => {
  const { userId } = useParams(); // URLからユーザーIDを取得
  const [userName, setUserName] = useState(""); 
  const [history, setHistory] = useState([]);
  const [bookshelf, setBookshelf] = useState([]);
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserData = useCallback(async () => {
    try {
      setLoading(true);
      // ユーザー情報の取得
      const userRef = doc(db, "users", userId);
      const userSnapshot = await getDoc(userRef);
      if (userSnapshot.exists()) {
        setUserName(userSnapshot.data().displayName); // ユーザーネームを取得
      } else {
        console.error("ユーザーが見つかりませんでした");
      }

      // 読書履歴の取得
      const userBooksQuery = collection(db, "users", userId, "userBooks");
      const userBooksSnapshot = await getDocs(userBooksQuery);

      let historyData = [];
      for (const userBookDoc of userBooksSnapshot.docs) {
        const bookId = userBookDoc.id;
        const statusHistoryQuery = query(
          collection(db, "users", userId, "userBooks", bookId, "statusHistory"),
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

      // 蔵書一覧の取得
      const bookshelfData = userBooksSnapshot.docs.map((doc) => doc.data());
      setBookshelf(bookshelfData);

      // 参加しているスレッドの取得
      const threadsQuery = collection(db, "threads");
      const threadsSnapshot = await getDocs(threadsQuery);
      let userThreads = [];

      // 各スレッドのコメントを検索して、ユーザーが参加しているかをチェック
      for (const threadDoc of threadsSnapshot.docs) {
        const threadData = threadDoc.data();
        const commentsQuery = collection(db, "threads", threadDoc.id, "comments");
        const commentsSnapshot = await getDocs(commentsQuery);

        commentsSnapshot.docs.forEach((commentDoc) => {
          const commentData = commentDoc.data();
          if (commentData.userId === userId) {  // ユーザーがコメントした場合
            userThreads.push({
              threadId: threadDoc.id,
              ...threadData,
            });
          }
        });
      }

      setThreads(userThreads);  // 参加しているスレッドをセット

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
          <>
            <Box sx={{ my: 4 }}>
              <Typography variant="h5" gutterBottom>
                読書履歴
              </Typography>
              <Grid container spacing={3}>
                {history.map((entry, index) => (
                  <Grid item xs={12} key={index}>
                    <Card>
                      <CardContent>
                        <Typography variant="body1">
                          <strong>本のタイトル:</strong> {entry.bookTitle}
                        </Typography>
                        <Typography variant="body1">
                          <strong>ステータス:</strong> {entry.status}
                        </Typography>
                        <Typography variant="body1">
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
                        <Typography variant="body1">
                          <strong>本のタイトル:</strong> {book.title}
                        </Typography>
                        <Typography variant="body1">
                          <strong>ステータス:</strong> {book.status}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* 参加しているスレッド */}
            <Box sx={{ my: 4 }}>
              <Typography variant="h5" gutterBottom>
                参加しているスレッド
              </Typography>
              <Grid container spacing={3}>
                {threads.map((thread, index) => (
                  <Grid item xs={12} key={index}>
                    <Card>
                      <CardContent>
                        <Typography variant="body1">
                          <strong>スレッドタイトル:</strong> {thread.title}
                        </Typography>
                        <Button
                          component={Link}
                          to={`/books/${thread.bookId}/threads/${thread.threadId}/comments`}
                        >
                          スレッドを表示
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </>
        )}
      </Container>
    </Layout>
  );
};

export default UserReadingHistoryPage;
