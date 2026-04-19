import api from '../api';
export const login = async (credentials) => api.post('/auth/login', credentials);
export const register = async (userData) => api.post('/auth/register', userData);
