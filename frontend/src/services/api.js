import axios from "axios";

const API = axios.create({
  baseURL: "https://team7finalproject-production.up.railway.app/api",
  // baseURL: "http://localhost:5000/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      console.error("Unauthorized, redirect to login if needed");
    }
    return Promise.reject(error);
  }
);

export default API;
