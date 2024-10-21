import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth/';  // Spring Boot APIのエンドポイント

export const login = (username, password) => {
  return axios.post(API_URL + 'login', { username, password });
};

export const register = (username, email, password) => {
  return axios.post(API_URL + 'register', { username, email, password });
};
