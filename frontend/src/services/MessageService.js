import API from './api';

export const fetchInbox = () => API.get('/chat');
export const getChatWithUser = (otherUserId) => API.get(`/chat/messages/${otherUserId}`);
export const sendMessage = (otherUserId, message) =>
  API.post(`/chat/messages/${otherUserId}`, { text: message });