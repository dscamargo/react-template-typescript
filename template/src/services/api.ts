import axios from 'axios';

import { TokenStorage, UserStorage } from '../hooks/Auth';

const { REACT_APP_API_URL } = process.env;

const api = axios.create({
  baseURL: REACT_APP_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TokenStorage);

  const { headers } = config;

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return { ...config, headers };
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error && error.response && error.response.status === 401) {
      localStorage.removeItem(TokenStorage);
      localStorage.removeItem(UserStorage);
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    }

    return Promise.reject(error);
  },
);

export default api;
