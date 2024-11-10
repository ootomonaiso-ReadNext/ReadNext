import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Box, Container, TextField, Button, Typography } from "@mui/material";

const NewThreadPage = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [createdBy, setCreatedBy] = useState("");

  const handleCreateThread = async () => {
    if (!title || !createdBy) return;

    try {
      // 指定された bookId の本に threads コレクションを作成して追加
      const threadsRef = collection(db, `books/${bookId}/threads`);
      await addDoc(threadsRef, {
        title: title,
        createdBy: createdBy,
        createdAt: serverTimestamp(),
      });

      // スレッド作成後にスレッド一覧ページにリダイレクト
      navigate(`/books/${bookId}/threads`);
    } catch (error) {
      console.error("スレッドの作成中にエラーが発生しました:", error);
    }
  };

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
        <TextField
          label="作成者"
          variant="outlined"
          fullWidth
          value={createdBy}
          onChange={(e) => setCreatedBy(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button variant="contained" color="primary" onClick={handleCreateThread}>
          作成
        </Button>
      </Box>
    </Container>
  );
};

export default NewThreadPage;
