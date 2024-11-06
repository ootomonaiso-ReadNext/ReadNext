import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import { Typography, Container, Button, Grid, Card, CardContent } from "@mui/material";
import { useAuth } from "../../hooks/useAuth";
import { bookConverter, firestore } from "../../constants/firestore";
import type { Book } from "../../types/book";

const UserBookshelfPage = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserBooks();
    }
  }, [user]);

  // Firestoreからユーザーの蔵書を取得
  const fetchUserBooks = async () => {
    try {
      const userBooksQuery = query(
        collection(firestore, "userBooks").withConverter(bookConverter),
        where("userId", "==", user?.uid)
      );
      const querySnapshot = await getDocs(userBooksQuery);
      const booksData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
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
            <Grid item xs={12} sm={6} md={4} key={JSON.stringify(book)}>
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
                    {/* 感想: {book.thoughts || "未記録"} */} 感想: 未記録
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
