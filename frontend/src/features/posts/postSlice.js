import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as postAPI from "./postAPI";
import { handleRequest } from "../../utils/request";

export const getAllPosts = createAsyncThunk("posts/fetchAll", async () => {
  return await handleRequest(() => postAPI.fetchPosts());
});

export const createNewPost = createAsyncThunk(
  "posts/create",
  async (data, { rejectWithValue }) => {
    try {
      return await handleRequest(
        () => postAPI.createPost(data),
        "Post created!"
      );
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const toggleLike = createAsyncThunk(
  "posts/toggleLike",
  async ({ postId, shouldLike }, { rejectWithValue }) => {
    try {
      const likes = await postAPI.likePost(postId, shouldLike);
      return { postId, likes };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addCommentToPost = createAsyncThunk(
  "posts/addComment",
  async ({ postId, text }, { rejectWithValue }) => {
    try {
      const comment = await postAPI.addComment(postId, text);
      return { postId, comment };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const postSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [],
    loading: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllPosts.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(getAllPosts.fulfilled, (state, action) => {
        state.posts = action.payload;
        state.loading = "succeeded";
      })
      .addCase(getAllPosts.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload;
      })

      .addCase(createNewPost.fulfilled, (state, action) => {
        state.posts.unshift(action.payload);
      })

      .addCase(toggleLike.fulfilled, (state, action) => {
        const post = state.posts.find((p) => p.id === action.payload.postId);
        if (post) post.likes = action.payload.likes;
      })

      .addCase(addCommentToPost.fulfilled, (state, action) => {
        const post = state.posts.find((p) => p.id === action.payload.postId);
        if (post) {
          post.comments = post.comments || [];
          post.comments.push(action.payload.comment);
        }
      });
  },
});

export default postSlice.reducer;
export const selectPosts = (state) => state.posts.posts;
export const selectPostLoading = (state) => state.posts.loading;