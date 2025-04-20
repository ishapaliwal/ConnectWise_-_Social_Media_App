import API from "../../services/api";

export const fetchPosts = async () => {
  const res = await API.get("/posts");
  return res.data;
};

export const createPost = async ({ user_id, content, image_url }) => {
  const res = await API.post("/posts", {
    user_id,
    content,
    image_url,
  });
  return res.data;
};

export const likePost = async (postId) => {
  const res = await API.post(`/posts/${postId}/like`);
  return res.data.likes;
};

export const addComment = async (postId, text) => {
  const res = await API.post(`/posts/${postId}/comments`, { text });
  return res.data;
};

export const fetchComments = async (postId) => {
  const res = await API.get(`/posts/${postId}/comments`);
  return res.data;
};

export const fetchPostsByUser = async (userId) => {
  const res = await API.get(`/posts/user/${userId}`);
  return res.data;
};

export const fetchLikesByPost = async (postId) => {
  const res = await API.get(`/posts/${postId}/likes`);
  return res.data;
};

export const getPostById = async (postId) => {
  const res = await API.get(`/posts/${postId}`);
  return res.data;
};