import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as notificationAPI from './notificationAPI';

export const fetchNotifications = createAsyncThunk('notifications/fetchNotifications', async (_, thunkAPI) => {
  try {
    return await notificationAPI.getNotifications();
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.error || 'Failed to load notifications');
  }
});

export const markAllRead = createAsyncThunk('notifications/markAllRead', async (_, thunkAPI) => {
  try {
    return await notificationAPI.markAllRead();
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.error || 'Failed to mark notifications');
  }
});

export const markNotificationRead = createAsyncThunk('notifications/markNotificationRead', async (id, thunkAPI) => {
  try {
    return await notificationAPI.markAsRead(id);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.error || 'Failed to mark notification');
  }
});

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    list: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(markAllRead.fulfilled, (state) => {
        state.list = state.list.map(n => ({ ...n, read: true }));
      })
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        const id = action.payload;
        const notif = state.list.find(n => n.id === id);
        if (notif) notif.read = true;
      });
  }
});

export default notificationSlice.reducer;