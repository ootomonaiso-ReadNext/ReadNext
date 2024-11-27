import React, { useState } from "react";
import { useAuth } from "../context/AuthContext"; // 認証コンテキストからユーザー情報を取得
import { db } from "../firebaseConfig"; // Firebaseのデータベース設定をインポート
import {
  collection,
  query,
  where,
  getDocs,
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

// Google Books APIのURLと1ページあたりの検索結果数
const GOOGLE_BOOKS_API_URL = "https://www.googleapis.com/books/v1/volumes?q=";
const RESULTS_PER_PAGE = 40;

// 本をデータベースから追加するページコンポーネント
const AddBookFromDatabasePage = () => {
  const { user } = useAuth(); // 現在ログインしているユーザー情報を取得
  const [searchTerm, setSearchTerm] = useState(""); // 検索キーワードの状態
  const [searchResults, setSearchResults] = useState([]); // 検索結果の状態
  const [currentPage, setCurrentPage] = useState(1); // 現在のページ番号
  const [sortOrder, setSortOrder] = useState("relevance"); // ソート順の状態

  // Firestoreのbooksコレクションから書籍を検索
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
    setSearchResults(books); // Firestoreからの検索結果を設定
    console.log("Firestoreから書籍を取得:", querySnapshot.docs);
    return books;
  };

  // Google Books APIを使用して書籍を検索
  const searchBooksFromGoogle = async () => {
    let allBooks = [];
    let startIndex = 0;

    // Google Books APIから最大120件の結果を取得
    while (startIndex < 120) {
      const currentStartIndex = startIndex; // スコープを固定
      const response = await fetch(
        `${GOOGLE_BOOKS_API_URL}${searchTerm}&startIndex=${currentStartIndex}&maxResults=${RESULTS_PER_PAGE}&orderBy=${sortOrder}`
      );
      const data = await response.json();

      if (!data.items || data.items.length === 0) break; // 結果がなければループを終了

      // 検索結果の書籍データを取得して整理
      const books = data.items.map((item) => ({
        id: `${item.id}-${currentStartIndex}`,
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

    setSearchResults(allBooks); // APIからの検索結果を設定
  };

  // 検索ボタンがクリックされたときの処理
  const handleSearch = async () => {
    setCurrentPage(1); // ページ番号をリセット
    const dbBooks = await searchBooksInDatabase(); // Firestoreでの検索
    if (dbBooks.length === 0) {
      await searchBooksFromGoogle(); // Firestoreに該当書籍がない場合、Google Books APIで検索
    }
  };

  // ソート順が変更されたときの処理
  const handleSortChange = (event) => {
    setSortOrder(event.target.value); // ソート順を更新
  };

  // 現在のページに表示する書籍を取得
  const currentResults = searchResults.slice(
    (currentPage - 1) * RESULTS_PER_PAGE,
    currentPage * RESULTS_PER_PAGE
  );

  // ページ番号が変更されたときの処理
  const handlePageChange = (event, value) => {
    setCurrentPage(value); // ページ番号を更新
  };

  // ページ上部にスクロールする処理
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h5" style={{ margin: "20px 0" }}>
        書籍を検索して追加
      </Typography>

      {/* 検索フィールド */}
      <TextField
        label="書籍を検索"
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: "10px" }}
      />

      {/* 並び順の選択 */}
      <Select
        value={sortOrder}
        onChange={handleSortChange}
        style={{ marginBottom: "20px", width: "100%" }}
      >
        <MenuItem value="relevance">関連順</MenuItem>
        <MenuItem value="newest">新着順</MenuItem>
      </Select>

      {/* 検索ボタン */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleSearch}
        style={{ marginBottom: "20px" }}
      >
        検索
      </Button>

      {/* ページネーション */}
      <Pagination
        count={Math.ceil(searchResults.length / RESULTS_PER_PAGE)}
        page={currentPage}
        onChange={handlePageChange}
        color="primary"
        style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
      />

      {/* 検索結果のリスト */}
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
              >
                追加
              </Button>
            </CardContent>
          </ListItem>
        ))}
      </List>

      {/* ページ上部へ戻るボタン */}
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
  );
};

export default AddBookFromDatabasePage;
