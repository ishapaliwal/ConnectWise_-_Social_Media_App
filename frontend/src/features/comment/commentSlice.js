import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as commentAPI from './commentAPI';

// --- Thunks --- //
export const fetchComments = createAsyncThunk(
  'comments/fetchComments',
  async (postId, thunkAPI) => {
    try {
      return await commentAPI.fetchComments(postId);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.error || 'Failed to fetch comments');
    }
  }
);

export const addComment = createAsyncThunk(
  'comments/addComment',
  async ({ postId, text }, thunkAPI) => {
    try {
      return await commentAPI.addComment(postId, text);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.error || 'Failed to add comment');
    }
  }
);

// --- Slice --- //
const commentSlice = createSlice({
  name: 'comments',
  initialState: {
    commentsByPost: {},
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        const postId = action.meta.arg;
        state.loading = false;
        state.commentsByPost[postId] = action.payload;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addComment.fulfilled, (state, action) => {
        // const postId = action.meta.arg.postId;
        // if (!state.commentsByPost[postId]) {
        //   state.commentsByPost[postId] = [];
        // }
        // state.commentsByPost[postId].push(action.payload);
      });
  },
});

export default commentSlice.reducer;