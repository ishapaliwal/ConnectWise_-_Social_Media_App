import API from './api';

export const addComment = async (postId, text) => {
  const res = await API.post(`/comments/${postId}`, { text });
  return res.data;
};

export const fetchComments = async (postId) => {
  const res = await API.get(`/comments/${postId}`);
  return res.data;
};

export const deleteComment = async (commentId) => {
  const res = await API.delete(`/comments/${commentId}`);
  return res.data;
};

export const flagComment = async (commentId) => {
  const res = await API.post(`/comments/${commentId}/flag`);
  return res.data;
};