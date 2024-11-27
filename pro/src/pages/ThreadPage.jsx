import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { collection, getDocs, addDoc, serverTimestamp, doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Box, Container, Typography, List, ListItem, ListItemText, TextField, Button } from "@mui/material";
import { useAuth } from "../context/AuthContext";

const ThreadPage = () => {
  const { bookId, threadId } = useParams();
  const { user } = useAuth();
  const [thread, setThread] = useState(null); 
  const [comments, setComments] = useState([]); 
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState(null); // 返信先コメントのID
  const [quote, setQuote] = useState(null); // 安価として引用するコメント内容

  // コメント一覧を取得
  const fetchComments = useCallback(async () => {
    const commentsRef = collection(db, `books/${bookId}/threads/${threadId}/comments`);
    const commentSnapshot = await getDocs(commentsRef);
    
    // 各コメントに対してデータ取得
    const commentList = await Promise.all(commentSnapshot.docs.map(async (docSnap) => {
      const commentData = { id: docSnap.id, ...docSnap.data() };
      
      // ユーザーの読書状況（status）を取得
      if (commentData.userId) {
        try {
          const statusDocRef = doc(db, `users/${commentData.userId}/userBooks`, bookId); // userIdとbookIdで指定
          const statusDoc = await getDoc(statusDocRef);
          
          // statusが存在する場合はcommentDataに追加
          commentData.status = statusDoc.exists() ? statusDoc.data().status : "蔵書にない";
        } catch (error) {
          console.error(`Error fetching status for user ${commentData.userId}:`, error);
          commentData.status = "取得エラー";
        }
      } else {
        commentData.status = "未設定";
      }

      return commentData;
    }));

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
  }, [bookId, threadId, fetchComments]); // fetchCommentsを依存配列に追加

  // コメントを追加する関数
  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const commentsRef = collection(db, `books/${bookId}/threads/${threadId}/comments`);
      await addDoc(commentsRef, {
        text: newComment,
        createdBy: user?.userName || "匿名ユーザー",
        userId: user?.uid, // userIdを保存するが表示はしない
        createdAt: serverTimestamp(),
        replyTo: replyTo || null, // 返信先のコメントID
        quote: quote || null, // 引用するコメント内容
      });
      setNewComment("");
      setReplyTo(null); // 返信をリセット
      setQuote(null); // 引用をリセット
      fetchComments();　// コメント一覧を再取得
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  // コメントを引用（安価）する
  const handleQuote = (comment) => {
    setQuote(comment.text); // 引用するコメントの内容を設定
    setReplyTo(comment.id); // 返信先コメントのIDを設定
  };

  // 返信・引用をキャンセルする関数
  const handleCancelReply = () => {
    setReplyTo(null);
    setQuote(null);
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
            <ListItem key={comment.id} alignItems="flex-start">
              <ListItemText
                primary={
                  <>
                    <Typography variant="subtitle2">
                      {comment.createdBy} {comment.status && `（読書状況: ${comment.status}）`}
                    </Typography>
                    {comment.quote && (
                      <Typography variant="body2" color="textSecondary" sx={{ pl: 2, borderLeft: "2px solid #ccc", mb: 1 }}>
                        {`引用: "${comment.quote}"`}
                      </Typography>
                    )}
                    <Typography variant="body1">{comment.text}</Typography>
                  </>
                }
                secondary={`送信日時: ${comment.createdAt?.toDate().toLocaleString()}`}
              />
              <Button size="small" onClick={() => handleQuote(comment)}>
                引用
              </Button>
            </ListItem>
          ))}
        </List>

        {/* 新しいコメント入力 */}
        <Box sx={{ mt: 4 }}>
          {quote && (
            <Typography variant="body2" color="textSecondary" sx={{ pl: 2, borderLeft: "2px solid #ccc", mb: 1 }}>
              {`引用: "${quote}"`}
            </Typography>
          )}
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
          {replyTo && (
            <Button variant="text" color="secondary" onClick={handleCancelReply}>
              返信をキャンセル
            </Button>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default ThreadPage;
