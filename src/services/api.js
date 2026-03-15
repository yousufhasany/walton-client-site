import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Attach JWT token to every request if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Product APIs ───────────────────────────────────────────────────────────
export const fetchProducts = (params) => API.get('/products', { params });
export const fetchProduct = (id) => API.get(`/products/${id}`);
export const createProduct = (data) =>
  API.post('/products', data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateProduct = (id, data) =>
  API.put(`/products/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteProduct = (id) => API.delete(`/products/${id}`);

// ─── Sales APIs ──────────────────────────────────────────────────────────────
export const fetchSales = () => API.get('/sales');
export const addSale = (data) => API.post('/sales', data);

// ─── Purchase APIs ───────────────────────────────────────────────────────────
export const fetchPurchases = () => API.get('/purchase');
export const addPurchase = (data) => API.post('/purchase', data);

// ─── Auth APIs ───────────────────────────────────────────────────────────────
export const login = (data) => API.post('/auth/login', data);
export const register = (data) => API.post('/auth/register', data);
export const firebaseLogin = (data) => API.post('/auth/firebase', data);

// ─── Contact Message APIs ───────────────────────────────────────────────────
export const submitContactMessage = (data) => API.post('/contact-messages', data);
export const fetchContactMessages = () => API.get('/contact-messages');
export const markContactMessageAsRead = (id) => API.patch(`/contact-messages/${id}/read`);

export default API;
