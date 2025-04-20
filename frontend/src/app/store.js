import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import postReducer from '../features/posts/postSlice';
import commentReducer from '../features/comment/commentSlice';
import userReducer from '../features/users/userSlice';
import chatReducer from '../features/chat/chatSlice';
import notificationReducer from '../features/notifications/notificationSlice';
import moderationReducer from '../features/moderation/moderationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postReducer,
    comments: commentReducer,
    user: userReducer,
    chat: chatReducer,
    notifications: notificationReducer,
    moderation: moderationReducer,
  },
});