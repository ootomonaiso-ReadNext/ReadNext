import React, { useState } from "react";
import { auth } from "../firebaseConfig";
import { sendPasswordResetEmail } from "firebase/auth";
import { TextField, Button, Container, Typography, Box, Alert } from "@mui/material";
import Layout from "../components/Layout";

const ResetPasswordRequest = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSendResetEmail = async () => {
    setMessage("");
    setError("");

    if (!email) {
      setError("メールアドレスを入力してください。");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("パスワードリセットメールを送信しました。メールを確認してください。");
    } catch (err) {
      setError("メール送信に失敗しました。正しいメールアドレスを入力してください。");
      console.error("パスワードリセットメール送信エラー:", err);
    }
  };

  return (
    <Layout>
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Box sx={{ p: 3, boxShadow: 2, borderRadius: 2, textAlign: "center" }}>
          <Typography variant="h5" gutterBottom>
            パスワードリセットメール送信
          </Typography>
          <TextField
            label="登録済みのメールアドレス"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="outlined"
            fullWidth
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSendResetEmail}
            fullWidth
            sx={{ mt: 2 }}
          >
            リセットメールを送信
          </Button>
          {message && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {message}
            </Alert>
          )}
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </Box>
      </Container>
    </Layout>
  );
};

export default ResetPasswordRequest;
