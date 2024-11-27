import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(document.getElementById('root')); // createRootを使用
root.render(
  <GoogleOAuthProvider clientId="107285687559-nqjudb9mfrsaua8gdcjbjpt69d4f457r.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
);
