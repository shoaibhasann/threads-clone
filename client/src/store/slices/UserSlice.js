import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axiosInstance from "../../helpers/AxiosInstance";

// Thunk function to get user details
export const fetchUser = createAsyncThunk("/user/get-profile", async (userId, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get(`/user-profile/${userId}`);

    return res.data;
  } catch (error) {
    return rejectWithValue(error?.response?.data?.message);
  }
});

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: {},
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
        .addCase(fetchUser.pending, (state) => {
            state.loading = true
        })
        .addCase(fetchUser.fulfilled, (state, action) => {
            state.loading = false;
            state.userData = action.payload.data;
        })
        .addCase(fetchUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload
        })
  }
});

export default userSlice.reducer;
