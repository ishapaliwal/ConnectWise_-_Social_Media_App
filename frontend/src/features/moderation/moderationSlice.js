import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "./moderationAPI";

// --- Example: Fetch flagged posts ---
export const fetchFlaggedPosts = createAsyncThunk(
  "moderation/fetchFlaggedPosts",
  async (_, thunkAPI) => {
    try {
      return await api.getFlaggedPosts();
    } catch (err) {
      return thunkAPI.rejectWithValue("Failed to fetch flagged posts");
    }
  }
);

const moderationSlice = createSlice({
  name: "moderation",
  initialState: {
    posts: [],
    users: [],
    comments: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFlaggedPosts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFlaggedPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchFlaggedPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default moderationSlice.reducer;