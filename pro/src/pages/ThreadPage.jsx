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
  const [replyTo, setReplyTo] = useState(null);
  const [quote, setQuote] = useState(null);

  const fetchComments = useCallback(async () => {
    const commentsRef = collection(db, `books/${bookId}/threads/${threadId}/comments`);
    const commentSnapshot = await getDocs(commentsRef);

    const commentList = await Promise.all(
      commentSnapshot.docs.map(async (docSnap) => {
        const commentData = { id: docSnap.id, ...docSnap.data() };

        if (commentData.userId) {
          try {
            const userDocRef = doc(db, "users", commentData.userId);
            const userDoc = await getDoc(userDocRef);

            commentData.createdBy = userDoc.exists() ? userDoc.data().userName : "不明なユーザー";
          } catch (error) {
            console.error(`Error fetching userName for user ${commentData.userId}:`, error);
            commentData.createdBy = "取得エラー";
          }
        } else {
          commentData.createdBy = "未設定";
        }

        return commentData;
      })
    );

    setComments(commentList);
  }, [bookId, threadId]);

  useEffect(() => {
    const fetchThread = async () => {
      const threadRef = doc(db, `books/${bookId}/threads`, threadId);
      const threadDoc = await getDoc(threadRef);

      if (threadDoc.exists()) {
        setThread(threadDoc.data());
      } else {
        console.error("Thread not found");
      }
    };

    fetchThread();
    fetchComments();
  }, [bookId, threadId, fetchComments]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const commentsRef = collection(db, `books/${bookId}/threads/${threadId}/comments`);
      await addDoc(commentsRef, {
        text: newComment,
        createdBy: user?.userName || "匿名ユーザー",
        userId: user?.uid,
        createdAt: serverTimestamp(),
        replyTo: replyTo || null,
        quote: quote || null,
      });
      setNewComment("");
      setReplyTo(null);
      setQuote(null);
      fetchComments();
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleQuote = (comment) => {
    setQuote(comment.text);
    setReplyTo(comment.id);
  };

  const handleCancelReply = () => {
    setReplyTo(null);
    setQuote(null);
  };

  if (!thread) {
    return (
      <Layout>
        <Typography variant="h6">Loading...</Typography>
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
                      {comment.quote && (
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          sx={{ pl: 2, borderLeft: "2px solid #ccc", mb: 1 }}
                        >
                          {`引用: "${comment.quote}"`}
                        </Typography>
                      )}
                      <Typography variant="body1">{comment.text}</Typography>
                    </>
                  }
                  secondary={`送信日時: ${comment.createdAt?.toDate().toLocaleString()}`}
                />
                <Button size="small" onClick={() => handleQuote(comment)}>引用</Button>
              </ListItem>
            ))}
          </List>

          <Box sx={{ mt: 4 }}>
            {quote && (
              <Typography variant="body2" color="textSecondary" sx={{ pl: 2, borderLeft: "2px solid #ccc", mb: 1 }}>
                {`引用: "${quote}"`}
              </Typography>
            )}
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
            {replyTo && (
              <Button variant="text" color="secondary" onClick={handleCancelReply}>
                返信をキャンセル
              </Button>
            )}
          </Box>
        </Box>
      </Container>
    </Layout>
  );
};

export default ThreadPage;
