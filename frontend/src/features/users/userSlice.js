import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as userAPI from "./userAPI";

export const fetchUserProfile = createAsyncThunk(
  "user/fetchUserProfile",
  async (_, thunkAPI) => {
    try {
      return await userAPI.getUserProfile();
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.error || "Failed to fetch profile"
      );
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "user/updateUserProfile",
  async (formData, thunkAPI) => {
    try {
      return await userAPI.updateUserProfile(formData);
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.error || "Failed to update profile"
      );
    }
  }
);

export const fetchAllUsers = createAsyncThunk('users/fetchAll', async (_, thunkAPI) => {
  try {
    return await userAPI.getAllUsers();
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.error || 'Failed to fetch users');
  }
});

const userSlice = createSlice({
  name: "user",
  initialState: {
    allUsers: [],
    profile: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
      })
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.allUsers = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;