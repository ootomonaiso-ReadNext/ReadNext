import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Box, Container, Typography, List, ListItem, ListItemText, Button } from "@mui/material";

const ThreadListPage = () => {
  const { bookId } = useParams();
  const [threads, setThreads] = useState([]);

  useEffect(() => {
    const fetchThreads = async () => {
      const threadsRef = collection(db, `books/${bookId}/threads`);
      const threadSnapshot = await getDocs(threadsRef);
      const threadList = threadSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setThreads(threadList);
    };
    fetchThreads();
  }, [bookId]);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>スレッド一覧</Typography>
        <Button variant="contained" component={Link} to={`/books/${bookId}/new-thread`} color="primary" sx={{ mb: 2 }}>
          新しいスレッドを作成
        </Button>
        <List>
          {threads.map((thread) => (
            <ListItem key={thread.id} component={Link} to={`/books/${bookId}/threads/${thread.id}/comments`} button>
              <ListItemText primary={thread.title} secondary={`作成者: ${thread.createdBy}`} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  );
};

export default ThreadListPage;
