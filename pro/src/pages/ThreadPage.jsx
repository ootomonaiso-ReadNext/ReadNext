import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Box, Container, Typography, List, ListItem, ListItemText, TextField, Button } from "@mui/material";
import { useAuth } from "../context/AuthContext";

const ThreadPage = () => {
  const { bookId, threadId } = useParams();
  const { user } = useAuth();
  const [thread, setThread] = useState(null); // スレッドの詳細
  const [comments, setComments] = useState([]); // コメント一覧
  const [newComment, setNewComment] = useState(""); // 新しいコメントの内容

  // コメント一覧を取得
  const fetchComments = useCallback(async () => {
    const commentsRef = collection(db, `books/${bookId}/threads/${threadId}/comments`);
    const commentSnapshot = await getDocs(commentsRef);
    const commentList = commentSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setComments(commentList);
  }, [bookId, threadId]);

  useEffect(() => {
    // スレッドの詳細を取得
    const fetchThread = async () => {
      const threadRef = collection(db, `books/${bookId}/threads`);
      const threadDoc = await getDocs(threadRef);
      const threadData = threadDoc.docs.find(doc => doc.id === threadId)?.data();
      setThread(threadData);
    };

    fetchThread();
    fetchComments();
  }, [bookId, threadId, fetchComments]);

  // コメントを追加する関数
  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const commentsRef = collection(db, `books/${bookId}/threads/${threadId}/comments`);
      await addDoc(commentsRef, {
        text: newComment,
        createdBy: user?.userName || "匿名ユーザー",
        createdAt: serverTimestamp(),
      });
      setNewComment("");
      fetchComments(); // コメントを追加後にコメント一覧を更新
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  if (!thread) {
    return <Typography variant="h6">Loading...</Typography>;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">{thread.title}</Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
          作成者: {thread.createdBy} - 作成日時: {thread.createdAt?.toDate().toLocaleString()}
        </Typography>
        
        <Typography variant="h6" gutterBottom>コメント</Typography>
        <List>
          {comments.map((comment) => (
            <ListItem key={comment.id}>
              <ListItemText primary={comment.text} secondary={`作成者: ${comment.createdBy}`} />
            </ListItem>
          ))}
        </List>

        <Box sx={{ mt: 4 }}>
          <TextField
            label="コメントを入力"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button variant="contained" color="primary" onClick={handleAddComment}>
            コメントを追加
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default ThreadPage;
