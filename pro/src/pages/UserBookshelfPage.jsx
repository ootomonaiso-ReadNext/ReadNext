import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebaseConfig";
import { collection, getDocs, doc, getDoc, updateDoc } from "firebase/firestore";
import { Link } from "react-router-dom";
import { Typography, Container, Button, Grid, Card, CardContent, CardMedia, Select, MenuItem } from "@mui/material";

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
            status: userBookDoc.data().status || "未読", // ステータスをデフォルト「未読」で設定
          };
        } else {
          console.warn(`書籍データが見つかりませんでした (ID: ${bookId})`);
          return null;
        }
      });

      const booksData = (await Promise.all(bookPromises)).filter(Boolean);
      setBooks(booksData);
    } catch (error) {
      console.error("Error fetching user books:", error);
    } finally {
      setLoading(false);
    }
  };

  // Firestoreで書籍のステータスを更新
  const handleStatusChange = async (bookId, newStatus) => {
    try {
      const userBookRef = doc(db, "users", user.uid, "userBooks", bookId);
      await updateDoc(userBookRef, { status: newStatus });

      // ローカル状態を更新してUIに即時反映
      setBooks((prevBooks) =>
        prevBooks.map((book) =>
          book.id === bookId ? { ...book, status: newStatus } : book
        )
      );
    } catch (error) {
      console.error("Error updating book status:", error);
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" style={{ margin: "20px 0" }}>
        あなたの蔵書
      </Typography>

      {/* 蔵書を追加するボタンを常に表示 */}
      <Button
        variant="contained"
        color="primary"
        component={Link}
        to="/add-from-database"
        style={{ marginBottom: "20px" }}
      >
        蔵書を追加する
      </Button>

      {loading ? (
        <Typography variant="body1">読み込み中...</Typography>
      ) : books.length === 0 ? (
        <div style={{ textAlign: "center", margin: "20px 0" }}>
          <Typography variant="body1" color="textSecondary">
            現在、蔵書がありません。
          </Typography>
        </div>
      ) : (
        <Grid container spacing={2}>
          {books.map((book) => (
            <Grid item xs={12} sm={6} md={4} key={book.id}>
              <Card>
                {book.thumbnail && (
                  <CardMedia
                    component="img"
                    image={book.thumbnail}
                    alt={book.title}
                    style={{
                      maxHeight: 200,
                      maxWidth: "100%",
                      objectFit: "contain",
                      margin: "auto",
                    }}
                  />
                )}
                <CardContent>
                  <Typography variant="h6" gutterBottom>{book.title}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {book.authors ? book.authors.join(", ") : "著者情報なし"}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {book.publishedDate ? `発行年: ${book.publishedDate}` : ""}
                  </Typography>

                  {/* ステータス選択メニュー */}
                  <Select
                    value={book.status}
                    onChange={(e) => handleStatusChange(book.id, e.target.value)}
                    fullWidth
                    variant="outlined"
                    style={{ marginTop: "10px" }}
                  >
                    <MenuItem value="未読">未読</MenuItem>
                    <MenuItem value="読書中">読書中</MenuItem>
                    <MenuItem value="読了済み">読了済み</MenuItem>
                  </Select>
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
