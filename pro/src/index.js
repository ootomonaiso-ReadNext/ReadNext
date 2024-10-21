import React from 'react';
import { createRoot } from 'react-dom/client'; // createRootをインポート
import App from './App';
import './index.css';

// ルート要素を取得
const rootElement = document.getElementById('root');

// createRootを使用してアプリケーションをレンダリング
const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
