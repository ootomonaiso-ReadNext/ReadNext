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
  Button,
} from "@mui/material";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Layout from "../components/Layout";

const UserReadingHistoryPage = () => {
  const { userId } = useParams();
  const [userName, setUserName] = useState("");
  const [history, setHistory] = useState([]);
  const [bookshelf, setBookshelf] = useState([]);
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recommendationLoading, setRecommendationLoading] = useState(false);

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

  const fetchRecommendations = async () => {
    if (bookshelf.length === 0) {
      alert("蔵書がありません。");
      return;
    }

    try {
      setRecommendationLoading(true);

      const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const bookTitles = bookshelf.map((book) => book.title).join(", ");
      const prompt = `以下の本に基づいて、おすすめの本を提案してください: ${bookTitles}`;

      const result = await model.generateContent(prompt);

      // レスポンスをフォーマットしてログに出力
      console.log("Gemini APIレスポンス (フォーマット済):", JSON.stringify(result, null, 2));

      if (result.response?.candidates?.length > 0) {
        const content = result.response.candidates[0]?.content?.parts[0]?.text || "";
        const sections = content.split("\n\n").filter((section) => section.trim() !== "");

        const formattedRecommendations = sections.map((section) => {
          const [title, ...details] = section.split("\n");
          return { title: title.trim(), details: details.join("\n").trim() };
        });

        setRecommendedBooks(formattedRecommendations);
      } else {
        console.error("Unexpected response structure:", JSON.stringify(result, null, 2));
        alert("APIレスポンスの形式が不正です。");
      }
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      alert("おすすめ本の取得中にエラーが発生しました。");
    } finally {
      setRecommendationLoading(false);
    }
  };

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

            {/* おすすめ本 */}
            <Box sx={{ my: 4, textAlign: "center" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={fetchRecommendations}
                disabled={recommendationLoading}
              >
                {recommendationLoading ? "おすすめを取得中..." : "おすすめ本を取得"}
              </Button>

              {recommendedBooks.length > 0 && (
                <Box sx={{ my: 4 }}>
                  <Typography variant="h5" gutterBottom>
                    おすすめ本
                  </Typography>
                  <Grid container spacing={3}>
                    {recommendedBooks.map((rec, index) => (
                      <Grid item xs={12} key={index}>
                        <Card>
                          <CardContent>
                            <Typography variant="h6">{rec.title}</Typography>
                            <Typography variant="body2" color="textSecondary">
                              {rec.details}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
            </Box>
          </Box>
        )}
      </Container>
    </Layout>
  );
};

export default UserReadingHistoryPage;
