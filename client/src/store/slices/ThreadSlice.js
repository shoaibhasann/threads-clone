import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";

import axiosInstance from "../../helpers/AxiosInstance";

// Thunk function to get user feed
export const getFeed = createAsyncThunk(
  "/thread/feed",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/posts/feed");
      return res.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);

// Thunk function to create new thread
export const createThread = createAsyncThunk(
  "/thread/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = axiosInstance.post("/posts", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.promise(
        res,
        {
          loading: "Posting...",
          success: "Posted",
          error: "Posting failed",
        },
        {
          duration: 1000,
          style: {
            borderRadius: "4px",
            background: "#000",
            color: "#fff",
            fontSize: "16px",
            padding: "10px 30px",
          },
        }
      );

      return (await res).data;
    } catch (error) {
      rejectWithValue(error?.response?.data?.message);
    }
  }
);

const initialState = {
  feed: localStorage.getItem("feed")
    ? JSON.parse(localStorage.getItem("feed"))
    : [],
  followingFeed: localStorage.getItem("followingFeed")
    ? JSON.parse(localStorage.getItem("followingFeed"))
    : [],
  loading: false,
  error: null,
};

const threadSlice = createSlice({
  name: "thread",
  initialState,
  reducers: {
    clearThreadSlice: (state) => {
      state.feed = [];
      state.followingFeed = [];
      state.loading = false;
      state.error = null;
    },

    clearErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFeed.pending, (state) => {
        state.loading = true;
      })
      .addCase(getFeed.fulfilled, (state, action) => {
        localStorage.setItem("feed", JSON.stringify(action.payload.feed));
        state.loading = false;
        state.feed = action.payload.feed;
      })
      .addCase(getFeed.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearErrors, clearThreadSlice } = threadSlice.actions;

export default threadSlice.reducer;
