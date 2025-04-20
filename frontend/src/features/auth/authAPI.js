import API from './api';

export const login = async ({ email, password }) => {
  const res = await API.post('/auth/login', { email, password });
  return res.data;
};

export const register = async ({ name, email, password }) => {
  const res = await API.post('/auth/register', { name, email, password });
  return res.data;
};

export const logout = async () => {
  await API.post('/auth/logout');
};

export const getCurrentUser = async () => {
  const res = await API.get('/auth/me');
  return res.data;
};