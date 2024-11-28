import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Box, Container, TextField, Button, Typography, CircularProgress } from "@mui/material";
import { useAuth } from "../context/AuthContext";

// 新しいスレッドを作成するページ
const NewThreadPage = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth(); // AuthContext から user を取得
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true); // ユーザー情報のロードを追跡する状態

  useEffect(() => {
    if (user && user.userName) {
      setLoading(false);
    }
  }, [user]);

  const handleCreateThread = async () => {
    if (!title || !user?.userName) return;

    try {
      const threadsRef = collection(db, `books/${bookId}/threads`);
      await addDoc(threadsRef, {
        title: title,
        createdBy: user.userName,
        createdAt: serverTimestamp(),
      });
      navigate(`/books/${bookId}/threads`);
    } catch (error) {
      console.error("Error creating thread:", error);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>新しいスレッドを作成</Typography>
        <TextField
          label="スレッドタイトル"
          variant="outlined"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreateThread}
          disabled={!user?.userName}
        >
          作成
        </Button>
      </Box>
    </Container>
  );
};

export default NewThreadPage;
