import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Link } from "react-router-dom";
import { Box, Container, TextField, Typography, List, ListItem, ListItemText } from "@mui/material";

const BookSearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);

  // 初回に蔵書データをFirestoreから取得
  useEffect(() => {
    const fetchBooks = async () => {
      const booksRef = collection(db, "books");
      const querySnapshot = await getDocs(booksRef);
      const allBooks = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setBooks(allBooks);
      setFilteredBooks(allBooks);
    };

    fetchBooks();
  }, []);

  // searchTermが変わるたびに予測変換を表示
  useEffect(() => {
    if (searchTerm) {
      const filtered = books.filter((book) =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBooks(filtered);
    } else {
      setFilteredBooks(books); // 検索文字がない場合は全蔵書
    }
  }, [searchTerm, books]);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          本を検索!
        </Typography>
        <TextField
          label="本のタイトルを入力"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>

      <List>
        {filteredBooks.map((book) => (
          <ListItem key={book.id} component={Link} to={`/books/${book.id}/threads`} button>
            <ListItemText primary={book.title} secondary={book.authors} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default BookSearchPage;
