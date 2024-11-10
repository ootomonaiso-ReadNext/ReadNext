// src/pages/Register.js
import React, { useState } from "react";
import { signUpWithEmail } from "../services/authService";
import { createUserDocument } from "../services/userService";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Container, TextField, Button, Typography, Box, Alert } from "@mui/material";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userId, setUserId] = useState(""); // ユーザーID用のフィールド
  const [userName, setUserName] = useState(""); // ユーザーネーム用のフィールド
  const [error, setError] = useState(null);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleSignUp = async () => {
    setError(null); // エラーを初期化

    // 必須フィールドのチェック
    if (!userId.trim() || !userName.trim()) {
      setError("ユーザーIDとユーザーネームを入力してください");
      return;
    }
    
    try {
      // Firebase Authでアカウントを作成
      const userCredential = await signUpWithEmail(email, password);
      setUser(userCredential.user);

      // Firestoreにユーザー情報を保存
      const settings = { theme: "light", notifications: true };
      await createUserDocument(userCredential.user.uid, userId, userName, settings);

      // ホームページにリダイレクト
      navigate("/");
    } catch (error) {
      setError(error.message); // エラーメッセージをセット
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: 4,
          boxShadow: 3,
          borderRadius: 2,
          bgcolor: "background.paper",
        }}
      >
        <Typography variant="h5" gutterBottom>
          Register
        </Typography>
        {error && <Alert severity="error" sx={{ width: "100%", mb: 2 }}>{error}</Alert>}
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          variant="outlined"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextField
          label="User ID (Unique)"
          variant="outlined"
          fullWidth
          margin="normal"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <TextField
          label="User Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleSignUp}
        >
          Sign Up
        </Button>
      </Box>
    </Container>
  );
};

export default Register;
