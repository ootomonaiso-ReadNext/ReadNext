import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { collection, getDocs, addDoc, serverTimestamp, doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Box, Container, Typography, List, ListItem, ListItemText, TextField, Button } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout"; 

const ThreadPage = () => {
  const { bookId, threadId } = useParams();
  const { user } = useAuth();
  const [thread, setThread] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch thread data
  const fetchThread = useCallback(async () => {
    try {
      const threadRef = doc(db, `books/${bookId}/threads/${threadId}`);
      const threadDoc = await getDoc(threadRef);

      if (threadDoc.exists()) {
        setThread({ id: threadDoc.id, ...threadDoc.data() });
      } else {
        console.warn("スレッドが存在しません");
        setThread(null);
      }
    } catch (error) {
      console.error("スレッドデータの取得エラー:", error);
      setThread(null);
    }
  }, [bookId, threadId]);

  // Fetch comments
  const fetchComments = useCallback(async () => {
    try {
      const commentsRef = collection(db, `books/${bookId}/threads/${threadId}/comments`);
      const commentSnapshot = await getDocs(commentsRef);
      const commentList = commentSnapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setComments(commentList);
    } catch (error) {
      console.error("コメントデータの取得エラー:", error);
    }
  }, [bookId, threadId]);

  useEffect(() => {
    const loadData = async () => {
      await fetchThread();
      await fetchComments();
      setLoading(false);
    };

    loadData();
  }, [fetchThread, fetchComments]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const commentsRef = collection(db, `books/${bookId}/threads/${threadId}/comments`);
      await addDoc(commentsRef, {
        text: newComment,
        createdBy: user?.userName || "匿名ユーザー",
        userId: user?.uid,
        createdAt: serverTimestamp(),
      });
      setNewComment("");
      await fetchComments();
    } catch (error) {
      console.error("コメントの追加エラー:", error);
    }
  };

  if (loading) {
    return (
      <Layout>
        <Container maxWidth="md" sx={{ mt: 4 }}>
          <Typography variant="h6">読み込み中...</Typography>
        </Container>
      </Layout>
    );
  }

  if (!thread) {
    return (
      <Layout>
        <Container maxWidth="md" sx={{ mt: 4 }}>
          <Typography variant="h6">スレッドが見つかりません。</Typography>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight="bold">{thread.title}</Typography>
          <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
            作成者: {thread.createdBy} - 作成日時: {thread.createdAt?.toDate().toLocaleString()}
          </Typography>

          <Typography variant="h6" gutterBottom>コメント</Typography>
          <List>
            {comments.map((comment) => (
              <ListItem key={comment.id} alignItems="flex-start">
                <ListItemText
                  primary={
                    <>
                      <Typography variant="subtitle2">{comment.createdBy}</Typography>
                      <Typography variant="body1">{comment.text}</Typography>
                    </>
                  }
                  secondary={`送信日時: ${comment.createdAt?.toDate().toLocaleString()}`}
                />
              </ListItem>
            ))}
          </List>

          <Box sx={{ mt: 4 }}>
            <TextField
              label="コメントを入力 (1200字まで)"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              sx={{ mb: 2 }}
              inputProps={{ maxLength: 1200 }}
            />
            <Button variant="contained" color="primary" onClick={handleAddComment}>
              コメントを追加
            </Button>
          </Box>
        </Box>
      </Container>
    </Layout>
  );
};

export default ThreadPage;
