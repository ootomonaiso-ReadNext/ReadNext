import React, { useState } from "react";
import { auth } from "../firebaseConfig";
import { confirmPasswordReset } from "firebase/auth";
import { useSearchParams, useNavigate } from "react-router-dom";
import { TextField, Button, Container, Typography, Box, Alert } from "@mui/material";
import Layout from "../components/Layout";

const ResetPasswordConfirm = () => {
  const [searchParams] = useSearchParams();
  const oobCode = searchParams.get("oobCode");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleResetPassword = async () => {
    setMessage("");
    setError("");

    if (newPassword !== confirmPassword) {
      setError("パスワードが一致しません。");
      return;
    }

    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      setMessage("パスワードが正常にリセットされました。ログインしてください。");
      setTimeout(() => {
        navigate("/login"); // ログインページにリダイレクト
      }, 3000);
    } catch (err) {
      setError("パスワードのリセットに失敗しました。リンクが有効であることを確認してください。");
      console.error("パスワードリセット確認エラー:", err);
    }
  };

  return (
    <Layout>
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Box sx={{ p: 3, boxShadow: 2, borderRadius: 2, textAlign: "center" }}>
          <Typography variant="h5" gutterBottom>
            新しいパスワードの設定
          </Typography>
          <TextField
            label="新しいパスワード"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            variant="outlined"
            fullWidth
            margin="normal"
          />
          <TextField
            label="新しいパスワードの確認"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            variant="outlined"
            fullWidth
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleResetPassword}
            fullWidth
            sx={{ mt: 2 }}
          >
            パスワードをリセット
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

export default ResetPasswordConfirm;
