import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebaseConfig";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { Typography, Container, Grid, Card, CardContent, Button, Box, CircularProgress } from "@mui/material";
import { GoogleGenerativeAI } from "@google/generative-ai"; // Google Gemini API
import Layout from "../components/Layout";

const UserBookshelfPage = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recommendationLoading, setRecommendationLoading] = useState(false);

  const fetchUserBooks = useCallback(async () => {
    try {
      setLoading(true);
      const userBooksQuery = collection(db, "users", user.uid, "userBooks");
      const userBooksSnapshot = await getDocs(userBooksQuery);

      const bookPromises = userBooksSnapshot.docs.map(async (userBookDoc) => {
        const bookId = userBookDoc.id;
        const bookDocRef = doc(db, "books", bookId);
        const bookSnapshot = await getDoc(bookDocRef);

        if (bookSnapshot.exists()) {
          return {
            id: bookId,
            ...bookSnapshot.data(),
            status: userBookDoc.data().status || "未読",
          };
        }
        return null;
      });

      const booksData = (await Promise.all(bookPromises)).filter(Boolean);
      setBooks(booksData);
    } catch (error) {
      console.error("Error fetching user books:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchRecommendations = async () => {
    if (books.length === 0) {
      alert("蔵書がありません。");
      return;
    }

    try {
      setRecommendationLoading(true);

      // .env から APIキーを取得
      const apiKey = process.env.REACT_APP_GEMINI_API_KEY;

      // Gemini APIでおすすめ本を取得
      const genAI = new GoogleGenerativeAI(apiKey); // 環境変数からAPIキーを設定
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      // 蔵書タイトルをプロンプトに組み込む
      const bookTitles = books.map((book) => book.title).join(", ");
      const prompt = `以下の本に基づいて、おすすめの本を提案してください: ${bookTitles}`;

      const result = await model.generateContent(prompt);
      const recommendations = result.response.text.split("\n").map((title) => ({ title }));

      setRecommendedBooks(recommendations);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    } finally {
      setRecommendationLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserBooks();
    }
  }, [user, fetchUserBooks]);

  return (
    <Layout>
      <Container maxWidth="lg">
        <Typography variant="h4" gutterBottom sx={{ my: 4 }}>
          あなたの蔵書
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" my={8}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {books.map((book) => (
              <Grid item xs={12} key={book.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{book.title}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {book.authors?.join(", ") || "著者情報なし"}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        <Box sx={{ my: 4, textAlign: "center" }}>
          <Button variant="contained" color="primary" onClick={fetchRecommendations} disabled={recommendationLoading}>
            {recommendationLoading ? "おすすめを取得中..." : "おすすめ本を取得"}
          </Button>
        </Box>

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
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Container>
    </Layout>
  );
};

export default UserBookshelfPage;
