import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";

import axiosInstance from "../../helpers/AxiosInstance";


// Thunk function to drop reply or comment on thread
export const dropComment = createAsyncThunk("/thread/drop-comment", async (data) => {
  try {
    const res = axiosInstance.post(`/posts/reply/${data.postId}`, { comment: data.comment });

    toast.promise(
      res,
      {
        loading: "Replying...",
        success: "Replied",
        error: "Replying failed",
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
    toast.error(error?.response?.data?.message);
  }
})
// Thunk function to drop like on thread
export const likeUnlikeThread = createAsyncThunk(
  "/thread/like-unlike",
  async (postId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/posts/like-unlike/${postId}`);

      return res.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);

// Thunk function to repost the thread
export const repostThread = createAsyncThunk(
  "/thread/repost",
  async (postId) => {
    try {
      const res = await axiosInstance.get(`/posts/repost/${postId}`);
      return res.data;
    } catch (error) {
      toast.error(error?.resposne?.data?.message);
    }
  }
);

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
  loading: false,
  error: null,
};

const threadSlice = createSlice({
  name: "thread",
  initialState,
  reducers: {
    setFeed: (state, action) => {
      state.feed = action.payload;
    },

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
      })
  },
});

export const { clearErrors, clearThreadSlice, setFeed } =
  threadSlice.actions;
export default threadSlice.reducer;
