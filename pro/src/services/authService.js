import axios from 'axios';

const API_URL = '/api/auth/';

export const register = (username, email, password) => {
    return axios.post(API_URL + 'register', { username, email, password });
};

export const login = (username, password) => {
    return axios.post(API_URL + 'login', { username, password });
};

export const logout = () => {
    return axios.post(API_URL + 'logout');
};
