import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebaseConfig";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { Link } from "react-router-dom";
import { Typography, Container, Button, Grid, Card, CardContent } from "@mui/material";

const UserBookshelfPage = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserBooks();
    }
  }, [user]);

  // Firestoreからユーザーの蔵書を取得
  const fetchUserBooks = async () => {
    try {
      setLoading(true);

      // Step 1: ユーザーの userBooks サブコレクションから書籍IDを取得
      const userBooksQuery = collection(db, "users", user.uid, "userBooks");
      const userBooksSnapshot = await getDocs(userBooksQuery);

      const bookPromises = userBooksSnapshot.docs.map(async (userBookDoc) => {
        const bookId = userBookDoc.id; // userBooksのドキュメントIDが書籍のIDと同じ
        const bookDocRef = doc(db, "books", bookId); // books コレクションから書籍ドキュメントを参照
        const bookSnapshot = await getDoc(bookDocRef);

        if (bookSnapshot.exists()) {
          return { id: bookId, ...bookSnapshot.data() };
        } else {
          console.warn(`書籍データが見つかりませんでした (ID: ${bookId})`);
          return null;
        }
      });

      // 全ての書籍データを取得し、存在しないものはフィルタリング
      const booksData = (await Promise.all(bookPromises)).filter(Boolean);
      setBooks(booksData);
    } catch (error) {
      console.error("Error fetching user books:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" style={{ margin: "20px 0" }}>
        あなたの蔵書
      </Typography>

      {loading ? (
        <Typography variant="body1">読み込み中...</Typography>
      ) : books.length === 0 ? (
        // 蔵書がない場合のメッセージ
        <div style={{ textAlign: "center", margin: "20px 0" }}>
          <Typography variant="body1" color="textSecondary">
            現在、蔵書がありません。
          </Typography>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/add-from-database"
            style={{ marginTop: "10px" }}
          >
            蔵書を追加する
          </Button>
        </div>
      ) : (
        // 蔵書がある場合の一覧表示
        <Grid container spacing={2}>
          {books.map((book) => (
            <Grid item xs={12} sm={6} md={4} key={book.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{book.title}</Typography>
                  <Typography variant="subtitle1" color="textSecondary">
                    {book.authors ? book.authors.join(", ") : "著者情報なし"}
                  </Typography>
                  <Typography variant="body2">
                    {book.publishedDate ? `発行日: ${book.publishedDate}` : ""}
                  </Typography>
                  <Typography variant="body2" style={{ marginTop: "10px" }}>
                    {book.description || "説明なし"}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default UserBookshelfPage;
