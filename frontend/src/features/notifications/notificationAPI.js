import API from '../../services/api';

export const getNotifications = async () => {
  try {
    const res = await API.get('/notifications');
    return res.data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

export const markAllRead = async () => {
  try {
    await API.patch('/notifications/read-all');
    return true;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
};

export const markAsRead = async (id) => {
  try {
    await API.patch(`/notifications/${id}/read`);
    return id;
  } catch (error) {
    console.error(`Error marking notification ${id} as read:`, error);
    throw error;
  }
};

export const clearNotifications = async () => {
  try {
    await API.delete('/notifications/clear');
    return true;
  } catch (error) {
    console.error('Error clearing notifications:', error);
    throw error;
  }
};