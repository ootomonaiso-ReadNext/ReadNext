import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebaseConfig";
import { collection, query, where, getDocs, addDoc, doc, setDoc } from "firebase/firestore";
import { Typography, Container, TextField, Button, List, ListItem, CardMedia, CardContent, Pagination, Select, MenuItem } from "@mui/material";

const GOOGLE_BOOKS_API_URL = "https://www.googleapis.com/books/v1/volumes?q=";
const RESULTS_PER_PAGE = 40;

const AddBookFromDatabasePage = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("relevance");

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

  // Google Books APIで書籍を検索し、ソート順を適用
  const searchBooksFromGoogle = async () => {
    let allBooks = [];
    let startIndex = 0;

    while (startIndex < 120) {
      const response = await fetch(
        `${GOOGLE_BOOKS_API_URL}${searchTerm}&startIndex=${startIndex}&maxResults=${RESULTS_PER_PAGE}&orderBy=${sortOrder}`
      );
      const data = await response.json();
      
      if (!data.items || data.items.length === 0) break;
      
      const books = data.items.map((item) => ({
        id: item.id + startIndex,
        title: item.volumeInfo.title,
        authors: item.volumeInfo.authors || ["不明"],
        publishedDate: item.volumeInfo.publishedDate || "不明",
        description: item.volumeInfo.description || "説明なし",
        thumbnail: item.volumeInfo.imageLinks?.thumbnail || null,
      }));
      allBooks = [...allBooks, ...books];
      startIndex += RESULTS_PER_PAGE;

      if (allBooks.length >= data.totalItems) break;
    }

    setSearchResults(allBooks);
  };

  // 書籍検索ハンドラ
  const handleSearch = async () => {
    setCurrentPage(1);
    const dbBooks = await searchBooksInDatabase();
    if (dbBooks.length === 0) {
      await searchBooksFromGoogle();
    }
  };

  // ソート順変更ハンドラ
  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
  };

  // 書籍をFirestoreのbooksコレクションとユーザーの蔵書に追加
const handleAddBook = async (book) => {
  try {
    // Step 1: 既存の書籍があるか確認
    const booksQuery = query(
      collection(db, "books"),
      where("title", "==", book.title),
      where("authors", "==", book.authors),
      where("publishedDate", "==", book.publishedDate)
    );
    const querySnapshot = await getDocs(booksQuery);

    let bookId;
    if (!querySnapshot.empty) {
      // 重複する書籍が存在する場合
      bookId = querySnapshot.docs[0].id; // 既存のドキュメントIDを取得
      console.log("既存の書籍を使用します:", bookId);
    } else {
      // 重複する書籍が存在しない場合、新規追加
      const bookDoc = {
        title: book.title,
        authors: book.authors,
        publisher: book.publisher || "不明",
        publishedDate: book.publishedDate,
        description: book.description || "説明なし",
        pageCount: book.pageCount || 0,
        categories: book.categories || [],
        averageRating: book.averageRating || null,
        ratingsCount: book.ratingsCount || 0,
        language: book.language || "不明",
        previewLink: book.previewLink || null,
        infoLink: book.infoLink || null,
        thumbnail: book.thumbnail || null,
      };
      const bookRef = await addDoc(collection(db, "books"), bookDoc);
      bookId = bookRef.id; // 新しい書籍のIDを取得
      console.log("新しい書籍を追加しました:", bookId);
    }

    // Step 2: ユーザーの `userBooks` サブコレクションに書籍IDを追加
    const userBooksRef = doc(db, "users", user.uid, "userBooks", bookId);
    await setDoc(userBooksRef, {
      addedAt: new Date(),
      bookId: bookId, // 書籍IDを保存
    });

    alert("書籍がユーザーの蔵書に追加されました！");
  } catch (error) {
    console.error("Error adding book to user's collection: ", error);
  }
};


  // 現在のページの表示用データを取得
  const currentResults = searchResults.slice(
    (currentPage - 1) * RESULTS_PER_PAGE,
    currentPage * RESULTS_PER_PAGE
  );

  // ページ変更ハンドラ
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
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
          <ListItem key={`${book.id}-${index}`} style={{ display: "flex", alignItems: "center" }}>
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
              <Button onClick={() => handleAddBook(book)} color="primary" style={{ marginTop: "10px" }}>
                追加
              </Button>
            </CardContent>
          </ListItem>
        ))}
      </List>

      <Pagination
        count={Math.ceil(searchResults.length / RESULTS_PER_PAGE)}
        page={currentPage}
        onChange={handlePageChange}
        color="primary"
        style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
      />
    </Container>
  );
};

export default AddBookFromDatabasePage;
