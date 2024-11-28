import React, { useState } from "react";
import { db } from "../firebaseConfig"; // Firebaseのデータベース設定をインポート
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
} from "firebase/firestore";
import {
  Typography,
  Container,
  TextField,
  Button,
  List,
  ListItem,
  CardMedia,
  CardContent,
  Pagination,
  Select,
  MenuItem,
  Fab,
} from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Layout from "../components/Layout"; // Layoutをインポート

const GOOGLE_BOOKS_API_URL = "https://www.googleapis.com/books/v1/volumes?q=";
const RESULTS_PER_PAGE = 40;

const AddBookFromDatabasePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("relevance");

  const searchBooksInDatabase = async () => {
    const booksQuery = query(
      collection(db, "books"),
      where("title", "==", searchTerm)
    );
    const querySnapshot = await getDocs(booksQuery);
    const books = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setSearchResults(books);
    console.log("Firestoreから書籍を取得:", querySnapshot.docs);
    return books;
  };

  const searchBooksFromGoogle = async () => {
    let allBooks = [];
    let startIndex = 0;

    while (startIndex < 120) {
      const currentStartIndex = startIndex;
      const response = await fetch(
        `${GOOGLE_BOOKS_API_URL}${searchTerm}&startIndex=${currentStartIndex}&maxResults=${RESULTS_PER_PAGE}&orderBy=${sortOrder}`
      );
      const data = await response.json();

      if (!data.items || data.items.length === 0) break;

      const books = data.items.map((item) => ({
        id: `${item.id}-${currentStartIndex}`,
        title: item.volumeInfo.title || "不明",
        authors: item.volumeInfo.authors || ["不明"],
        averageRating: item.volumeInfo.averageRating || null,
        categories: item.volumeInfo.categories || ["不明"],
        description: item.volumeInfo.description || "説明なし",
        infoLink: item.volumeInfo.infoLink || null,
        language: item.volumeInfo.language || "不明",
        pageCount: item.volumeInfo.pageCount || 0,
        previewLink: item.volumeInfo.previewLink || null,
        publishedDate: item.volumeInfo.publishedDate || "不明",
        ratingsCount: item.volumeInfo.ratingsCount || 0,
        thumbnail: item.volumeInfo.imageLinks?.thumbnail || null,
      }));

      allBooks = [...allBooks, ...books];
      startIndex += RESULTS_PER_PAGE;

      if (allBooks.length >= data.totalItems) break;
    }

    setSearchResults(allBooks);
  };

  const addBookToDatabase = async (book) => {
    try {
      const booksCollection = collection(db, "books");
      await addDoc(booksCollection, {
        title: book.title,
        authors: book.authors,
        averageRating: book.averageRating,
        categories: book.categories,
        description: book.description,
        infoLink: book.infoLink,
        language: book.language,
        pageCount: book.pageCount,
        previewLink: book.previewLink,
        publishedDate: book.publishedDate,
        ratingsCount: book.ratingsCount,
        thumbnail: book.thumbnail,
      });
      alert("書籍が追加されました！");
    } catch (error) {
      console.error("書籍の追加中にエラーが発生しました:", error);
      alert("書籍の追加に失敗しました。");
    }
  };

  const handleSearch = async () => {
    setCurrentPage(1);
    const dbBooks = await searchBooksInDatabase();
    if (dbBooks.length === 0) {
      await searchBooksFromGoogle();
    }
  };

  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
  };

  const currentResults = searchResults.slice(
    (currentPage - 1) * RESULTS_PER_PAGE,
    currentPage * RESULTS_PER_PAGE
  );

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <Layout>
      <Container maxWidth="sm">
        <Typography variant="h5" style={{ margin: "20px 0" }}>
          書籍を検索して追加
        </Typography>

        <TextField
          label="書籍を検索"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginBottom: "10px" }}
        />

        <Select
          value={sortOrder}
          onChange={handleSortChange}
          style={{ marginBottom: "20px", width: "100%" }}
        >
          <MenuItem value="relevance">関連順</MenuItem>
          <MenuItem value="newest">新着順</MenuItem>
        </Select>

        <Button
          variant="contained"
          color="primary"
          onClick={handleSearch}
          style={{ marginBottom: "20px" }}
        >
          検索
        </Button>

        <Pagination
          count={Math.ceil(searchResults.length / RESULTS_PER_PAGE)}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
          style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
        />

        <List>
          {currentResults.map((book, index) => (
            <ListItem
              key={`${book.id}-${index}`}
              style={{ display: "flex", alignItems: "center" }}
            >
              {book.thumbnail && (
                <CardMedia
                  component="img"
                  image={book.thumbnail}
                  alt={book.title}
                  style={{ width: 60, height: 90, marginRight: "10px" }}
                />
              )}
              <CardContent>
                <Typography variant="body1">{book.title}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {book.authors.join(", ")}
                </Typography>
                <Button
                  color="primary"
                  style={{ marginTop: "10px" }}
                  onClick={() => addBookToDatabase(book)}
                >
                  追加
                </Button>
              </CardContent>
            </ListItem>
          ))}
        </List>

        <Fab
          color="primary"
          onClick={scrollToTop}
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            zIndex: 1000,
          }}
        >
          <KeyboardArrowUpIcon />
        </Fab>
      </Container>
    </Layout>
  );
};

export default AddBookFromDatabasePage;
