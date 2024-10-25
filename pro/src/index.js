import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google'; // 新しいパッケージを使用
import { AuthProvider } from './context/AuthContext'; // 認証コンテキストをインポート

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID; // 環境変数からクライアントIDを取得

ReactDOM.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
