import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebaseConfig";
import { collection, getDocs, doc, getDoc, updateDoc } from "firebase/firestore";
import { Link } from "react-router-dom";
import {
  Typography,
  Container,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Select,
  MenuItem,
  CircularProgress,
  Box,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Add as AddIcon, Book as BookIcon } from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

const UserBookshelfPage = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserBooks();
    }
  }, [user]);

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
            status: userBookDoc.data().status || "未読",
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

  const handleStatusChange = async (bookId, newStatus) => {
    try {
      const userBookRef = doc(db, "users", user.uid, "userBooks", bookId);
      await updateDoc(userBookRef, { status: newStatus });

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
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg">
        <Typography variant="h4" component="h1" gutterBottom sx={{ my: 4 }}>
          あなたの蔵書
        </Typography>

        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/add-from-database"
          startIcon={<AddIcon />}
          sx={{ mb: 4 }}
        >
          蔵書を追加する
        </Button>

        {loading ? (
          <Box display="flex" justifyContent="center" my={8}>
            <CircularProgress />
          </Box>
        ) : books.length === 0 ? (
          <Box textAlign="center" my={8}>
            <Typography variant="body1" color="textSecondary">
              現在、蔵書がありません。
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {books.map((book) => (
              <Grid item xs={12} key={book.id}>
                <Card sx={{ display: "flex", height: "150px" }}> {/* 横並びレイアウト */}
                  <CardMedia
                    sx={{
                      width: 100,
                      height: 150,
                      position: "relative",
                      bgcolor: book.thumbnail ? "transparent" : "grey.200",
                    }}
                  >
                    {book.thumbnail ? (
                      <img
                        src={book.thumbnail}
                        alt={book.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          height: "100%",
                          width: "100%",
                        }}
                      >
                        <BookIcon sx={{ fontSize: 60, color: "grey.400" }} />
                      </Box>
                    )}
                  </CardMedia>

                  <CardContent sx={{ flex: "1", padding: "10px 16px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <Box>
                      <Typography
                        gutterBottom
                        variant="h6"
                        component="h2"
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {book.title}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {book.authors ? book.authors.join(", ") : "著者情報なし"}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {book.publishedDate ? `発行年: ${book.publishedDate}` : ""}
                      </Typography>
                    </Box>

                    {/* ステータス選択メニューの調整 */}
                    <FormControl fullWidth sx={{ mt: 1, mb: 1 }} size="small">
                      <InputLabel id={`status-select-label-${book.id}`}>ステータス</InputLabel>
                      <Select
                        labelId={`status-select-label-${book.id}`}
                        value={book.status}
                        onChange={(e) => handleStatusChange(book.id, e.target.value)}
                        label="ステータス"
                        sx={{ width: "120px" }}
                      >
                        <MenuItem value="未読">未読</MenuItem>
                        <MenuItem value="読書中">読書中</MenuItem>
                        <MenuItem value="読了済み">読了済み</MenuItem>
                      </Select>
                    </FormControl>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default UserBookshelfPage;
