import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth/';

const api = axios.create({
  baseURL: API_URL,
});

export const googleLogin = (token) => {
    return api.post('google', {}, { // リクエストボディは空のままでOK
      headers: {
        'Authorization': `Bearer ${token}` // トークンはAuthorizationヘッダーで送信
      }
    });
};

export const register = (username, email, password) => {
  return api.post('register', {
    username,
    email,
    password
  });
};
