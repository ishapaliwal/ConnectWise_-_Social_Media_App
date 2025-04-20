import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as chatAPI from './chatAPI';

// Thunks
export const fetchInbox = createAsyncThunk('chat/fetchInbox', async (_, thunkAPI) => {
  try {
    return await chatAPI.getInboxUsers();
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.error || 'Failed to load inbox');
  }
});

export const fetchMessages = createAsyncThunk('chat/fetchMessages', async (otherUserId, thunkAPI) => {
  try {
    return await chatAPI.getMessages(otherUserId);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.error || 'Failed to load messages');
  }
});

export const sendMessage = createAsyncThunk('chat/sendMessage', async ({ otherUserId, text }, thunkAPI) => {
  try {
    return await chatAPI.sendMessage(otherUserId, text);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.error || 'Failed to send message');
  }
});

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    inbox: [],
    messages: {},
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInbox.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInbox.fulfilled, (state, action) => {
        state.loading = false;
        state.inbox = action.payload;
      })
      .addCase(fetchInbox.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        const otherUserId = action.meta.arg;
        state.messages[otherUserId] = action.payload;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        const otherUserId = action.meta.arg.otherUserId;
        state.messages[otherUserId] = [...(state.messages[otherUserId] || []), action.payload];
      });
  }
});

export default chatSlice.reducer;