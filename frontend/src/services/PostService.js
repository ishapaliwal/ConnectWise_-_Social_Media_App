import API from './api';

export const fetchPosts = () => API.get('/posts');
export const createPost = (data) => API.post('/posts', data);
export const likePost = (postId) => API.post(`/posts/${postId}/like`);
export const commentOnPost = (postId, comment) =>
  API.post(`/posts/${postId}/comments`, { text: comment });
export const fetchComments = (postId) => API.get(`/posts/${postId}/comments`);
export const uploadPostImage = (formData) =>
  API.post("/upload", formData, {headers: {"Content-Type": "multipart/form-data",},});