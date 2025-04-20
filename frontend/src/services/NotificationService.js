import API from './api';

export const fetchNotifications = () => API.get('/notifications');
export const markAsRead = (notificationId) =>
  API.patch(`/notifications/${notificationId}/read`);
export const clearNotifications = () => API.delete('/notifications/clear');