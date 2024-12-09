import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import {
  Box,
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";
import Layout from "../components/Layout"; // Layoutをインポート

// スレッド一覧ページ
const ThreadListPage = () => {
  const { bookId } = useParams();
  const [threads, setThreads] = useState([]);
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  // Firestoreからスレッド一覧を取得
  useEffect(() => {
    const fetchThreads = async () => {
      const threadsRef = collection(db, `books/${bookId}/threads`);
      const threadSnapshot = await getDocs(threadsRef);
      const threadList = threadSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setThreads(threadList);
    };

    const fetchBookDetails = async () => {
      const bookRef = doc(db, "books", bookId);
      const bookDoc = await getDoc(bookRef);
      if (bookDoc.exists()) {
        setBook({ id: bookDoc.id, ...bookDoc.data() });
      }
      setLoading(false);
    };

    fetchThreads();
    fetchBookDetails();
  }, [bookId]);

  if (loading) {
    return (
      <Layout>
        <Container maxWidth="md" sx={{ mt: 4 }}>
          <Typography variant="h6" align="center">読み込み中...</Typography>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        {/* 本の情報を表示するヘッダー */}
        {book && (
          <Card sx={{ display: "flex", mb: 4 }}>
            <CardMedia
              component="img"
              sx={{ width: 150 }}
              image={book.thumbnail}
              alt={book.title}
            />
            <CardContent>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                {book.title}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                著者: {book.authors}
              </Typography>
              <Typography variant="body1">{book.description}</Typography>
            </CardContent>
          </Card>
        )}

        {/* スレッド一覧 */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>スレッド一覧</Typography>
          <Button
            variant="contained"
            component={Link}
            to={`/books/${bookId}/new-thread`}
            color="primary"
            sx={{ mb: 2 }}
          >
            新しいスレッドを作成
          </Button>
          <List>
            {threads.map((thread) => (
              <ListItem
                key={thread.id}
                component={Link}
                to={`/books/${bookId}/threads/${thread.id}/comments`}
                button
              >
                <ListItemText primary={thread.title} secondary={`作成者: ${thread.createdBy}`} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Container>
    </Layout>
  );
};

export default ThreadListPage;
