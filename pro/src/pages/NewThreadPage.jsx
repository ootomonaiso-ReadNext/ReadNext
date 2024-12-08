import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebaseConfig";
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout"; // へっだー

// 新しいスレッドを作成するページ
const NewThreadPage = () => {
  const { bookId } = useParams(); // URLからbookIdを取得
  const navigate = useNavigate();
  const { user, userData } = useAuth(); // AuthContextからユーザーデータを取得
  const [title, setTitle] = useState(""); // スレッドタイトル
  const [initialComment, setInitialComment] = useState(""); // 最初のコメント
  const [loading, setLoading] = useState(true); // ユーザー情報のロード状態を追跡

  // ユーザー情報のロードが完了したらローディング状態を解除
  useEffect(() => {
    if (user || userData) {
      setLoading(false);
    }
  }, [user, userData]);

  // スレッドとコメントを作成
  const handleCreateThread = async () => {
    if (!title.trim() || !initialComment.trim()) {
      console.warn("スレッドタイトルまたは最初のコメントが空です。");
      return;
    }

    try {
      const threadsRef = collection(db, `books/${bookId}/threads`);
      const userName = user?.userName || userData?.displayName || "UnknownUser";

      // スレッドを作成
      const threadDoc = await addDoc(threadsRef, {
        title: title.trim(),
        createdBy: userName,
        createdAt: serverTimestamp(),
      });

      console.log("スレッド作成成功:", threadDoc.id);

      // 最初のコメントを作成
      const commentsRef = collection(db, `books/${bookId}/threads/${threadDoc.id}/comments`);
      await addDoc(commentsRef, {
        text: initialComment.trim(),
        createdBy: userName,
        createdAt: serverTimestamp(),
      });

      console.log("最初のコメント作成成功");
      navigate(`/books/${bookId}/threads`);
    } catch (error) {
      console.error("スレッドまたはコメントの作成エラー:", error);
    }
  };

  // ローディング中の表示
  if (loading) {
    return (
      <Layout>
        <Container maxWidth="sm" sx={{ mt: 4 }}>
          <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
            <CircularProgress />
          </Box>
        </Container>
      </Layout>
    );
  }

  // ページのレンダリング
  return (
    <Layout>
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            新しいスレッドを作成
          </Typography>
          <TextField
            label="スレッドタイトル"
            variant="outlined"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="最初のコメント"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            value={initialComment}
            onChange={(e) => setInitialComment(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateThread}
            disabled={!title.trim() || !initialComment.trim()}
          >
            作成
          </Button>
        </Box>
      </Container>
    </Layout>
  );
};

export default NewThreadPage;
