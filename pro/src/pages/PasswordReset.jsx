import React, { useState } from "react";
import { auth } from "../firebaseConfig"; // Firebaseの初期化ファイルをインポート
import { sendPasswordResetEmail } from "firebase/auth";
import { TextField, Button, Container, Typography, Box, Alert } from "@mui/material";
import Layout from "../components/Layout";

const PasswordReset = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handlePasswordReset = async () => {
    setMessage("");
    setError("");
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("パスワードリセットメールを送信しました。メールボックスを確認してください。");
    } catch (err) {
      setError("パスワードリセットに失敗しました。正しいメールアドレスを入力してください。");
      console.error("パスワードリセットエラー:", err);
    }
  };

  return (
    <Layout>
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Box sx={{ p: 3, boxShadow: 2, borderRadius: 2, textAlign: "center" }}>
          <Typography variant="h5" gutterBottom>
            パスワードリセット
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
            onClick={handlePasswordReset}
            fullWidth
            sx={{ mt: 2 }}
          >
            パスワードリセットメールを送信
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

export default PasswordReset;
