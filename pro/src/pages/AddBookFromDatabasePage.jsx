import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebaseConfig";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { Typography, Container, TextField, Button, List, ListItem } from "@mui/material";

const GOOGLE_BOOKS_API_URL = "https://www.googleapis.com/books/v1/volumes?q=";

const AddBookFromDatabasePage = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // Firestoreのbooksコレクションで書籍を検索
  const searchBooksInDatabase = async () => {
    const booksQuery = query(
      collection(db, "books"),
      where("title", "==", searchTerm)
    );
    const querySnapshot = await getDocs(booksQuery);

    const books = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setSearchResults(books);
    return books;
  };

  // Google Books APIで書籍を検索
  const searchBooksFromGoogle = async () => {
    const response = await fetch(`${GOOGLE_BOOKS_API_URL}${searchTerm}`);
    const data = await response.json();
    const books = data.items.map((item) => ({
      id: item.id,
      title: item.volumeInfo.title,
      authors: item.volumeInfo.authors || ["不明"],
      publishedDate: item.volumeInfo.publishedDate || "不明",
      description: item.volumeInfo.description || "説明なし",
    }));
    setSearchResults(books);
  };

  // 書籍検索ハンドラ
  const handleSearch = async () => {
    const dbBooks = await searchBooksInDatabase();
    if (dbBooks.length === 0) {
      await searchBooksFromGoogle();
    }
  };

  // 書籍をFirestoreのbooksコレクションに追加
  const handleAddBook = async (book) => {
    const bookDoc = {
      title: book.title,
      authors: book.authors,
      publishedDate: book.publishedDate,
      description: book.description,
    };

    await addDoc(collection(db, "books"), bookDoc);
    alert("新しい書籍が登録されました！");
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h5" style={{ margin: "20px 0" }}>
        書籍を検索して追加
      </Typography>

      <TextField
        label="書籍を検索"
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSearch}
        style={{ marginTop: "10px" }}
      >
        検索
      </Button>

      <List>
        {searchResults.map((book) => (
          <ListItem key={book.id} style={{ display: "flex", flexDirection: "column", alignItems: "start" }}>
            <Typography variant="body1">{book.title}</Typography>
            <Typography variant="body2" color="textSecondary">
              {book.authors.join(", ")}
            </Typography>
            <Button onClick={() => handleAddBook(book)} color="primary" style={{ marginTop: "10px" }}>
              追加
            </Button>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default AddBookFromDatabasePage;
