import React, { useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Link } from "react-router-dom";
import { Box, Container, TextField, Button, Typography, List, ListItem, ListItemText } from "@mui/material";

const BookSearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [books, setBooks] = useState([]);

  const handleSearch = async () => {
    const booksRef = collection(db, "books");
    const q = query(booksRef, where("title", ">=", searchTerm), where("title", "<=", searchTerm + "\uf8ff"));
    const querySnapshot = await getDocs(q);
    const results = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setBooks(results);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>本を検索</Typography>
        <TextField
          label="本のタイトルを入力"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleSearch} sx={{ mt: 2 }}>
          検索
        </Button>
      </Box>

      <List>
        {books.map((book) => (
          <ListItem key={book.id} component={Link} to={`/books/${book.id}/threads`} button>
            <ListItemText primary={book.title} secondary={book.authors} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default BookSearchPage;
