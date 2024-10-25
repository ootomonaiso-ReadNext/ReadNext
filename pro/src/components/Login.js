// src/Login.js
import React, { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { GoogleLogin } from '@react-oauth/google'; // 新しいパッケージを使用
import { AuthContext } from './context/AuthContext'; // 認証コンテキストをインポート

function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // 認証関数を取得

  const handleLogin = () => {
    // 仮の認証処理
    login('dummy-token'); // トークンを設定
    navigate('/home'); // ログイン成功後、ホーム画面へ遷移
  };

  const handleGoogleLoginSuccess = (credentialResponse) => {
    const token = credentialResponse.credential;

    // トークンをバックエンドに送信して認証を行う
    fetch('http://localhost:8080/api/auth/google', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.token) {
          login(data.token); // 取得したトークンでログイン
          navigate('/home'); // Googleログイン成功後、ホーム画面へ遷移
        } else {
          // エラーハンドリング
          console.error('ログインエラー:', data);
        }
      })
      .catch((error) => {
        console.error('Googleログインエラー:', error);
      });
  };

  const handleGoogleLoginFailure = () => {
    console.error('Googleログイン失敗');
  };

  return (
    <Container maxWidth="sm">
      <Box
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
        sx={{ mt: 8, display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Login
        </Typography>
        <TextField label="Username" variant="outlined" required fullWidth />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          required
          fullWidth
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Log In
        </Button>

        {/* アカウント作成ボタン */}
        <Button
          component={Link}
          to="/register"
          variant="outlined"
          color="secondary"
          fullWidth
        >
          Create Account
        </Button>

        {/* Googleログインボタンを追加 */}
        <GoogleLogin
          onSuccess={handleGoogleLoginSuccess}
          onError={handleGoogleLoginFailure}
          useOneTap // オプション：ワンタップサインインを有効化
        />
      </Box>
    </Container>
  );
}

export default Login;
