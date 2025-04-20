import API from '../../services/api';

export const getInboxUsers = async () => {
  const res = await API.get('/chat');
  return res.data;
};

export const getMessages = async (otherUserId) => {
  const res = await API.get(`/chat/messages/${otherUserId}`);
  return res.data;
};

export const sendMessage = async (otherUserId, text) => {
  const res = await API.post(`/chat/messages/${otherUserId}`, { text });
  return res.data;
};