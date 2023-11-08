import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";

import axiosInstance from "../../helpers/AxiosInstance";


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
            background: "#000" ,
            color: "#fff",
            fontSize: "16px",
            padding: "10px 30px"
          },
        }
      );

      return (await res).data;
    } catch (error) {
      rejectWithValue(error?.response?.data?.message);
    }
  }
);

const threadSlice = createSlice({
  name: "thread",
  initialState: {
    threads: [],
  },
  reducers: {},
  extraReducers: {},
});

export default threadSlice.reducer;
