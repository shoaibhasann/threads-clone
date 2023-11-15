import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";

import axiosInstance from "../../helpers/AxiosInstance.js";


const initialState = {

  loading: false,

  isLoggedIn: localStorage.getItem("isLoggedIn")
    ? JSON.parse(localStorage.getItem("isLoggedIn"))
    : false,

  role: localStorage.getItem("role")
    ? JSON.parse(localStorage.getItem("role"))
    : "",

  data: localStorage.getItem("data")
    ? JSON.parse(localStorage.getItem("data"))
    : {},
};

// Thunk function to get user data
export const getUserData = createAsyncThunk("/auth/get-data", async (_, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get("/me");

    return res.data;
  } catch (error) {
    return rejectWithValue(error?.response?.data?.message);
  }
});

// thunk function to create new account
export const createAccount = createAsyncThunk(
  "/auth/signup",
  async (data, { rejectWithValue }) => {
    try {
      const res = axiosInstance.post("/auth/register", data);
      return (await res).data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);

// thunk function to login user
export const login = createAsyncThunk(
  "/auth/login",
  async (data, { rejectWithValue }) => {
    try {
      const res = axiosInstance.post("/auth/login", data);
      return (await res).data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);

// thunk function to logout user
export const logout = createAsyncThunk("/auth/logout", async () => {
  try {
    const res = axiosInstance.get("/auth/logout");

    toast.promise(
      res,
      {
        loading: "Logging out...",
        success: (response) => {
          return response?.data?.message;
        },
        error: "Logout failed.",
      });
    return (await res).data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
})

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {

    const updateStateOnAuthPending = (state) => {
      state.loading = true;
    }

    const updateStateOnAuthSuccess = (state, action) => {
      localStorage.setItem("data", JSON.stringify(action?.payload?.user));
      localStorage.setItem("isLoggedIn", true);
      localStorage.setItem("role", JSON.stringify(action?.payload?.user?.role));
      state.loading = false;
      state.isLoggedIn = true;
      state.data = action?.payload?.user;
      state.role = action?.payload?.user?.role;
    };

    const updateStateOnAuthFail = (state) => {
      state.loading = false;
    }

    builder
      .addCase(createAccount.pending, (state) => {
        updateStateOnAuthPending(state);
      })
      .addCase(login.pending, (state) => {
        updateStateOnAuthPending(state);
      })
      .addCase(createAccount.fulfilled, (state, action) => {
        updateStateOnAuthSuccess(state, action);
      })
      .addCase(login.fulfilled, (state, action) => {
        updateStateOnAuthSuccess(state, action);
      })
      .addCase(createAccount.rejected, (state) => {
        updateStateOnAuthFail(state);
      })
      .addCase(login.rejected, (state) => {
        updateStateOnAuthFail(state);
      })
      .addCase(logout.fulfilled, (state) => {
        localStorage.clear();
        state.isLoggedIn = false;
        state.data = {};
        state.role = "";
      })
      .addCase(getUserData.pending, (state) => {
        updateStateOnAuthPending(state);
      })
      .addCase(getUserData.fulfilled, (state, action) => {
        updateStateOnAuthSuccess(state, action);
      })
      .addCase(getUserData.rejected, (state) => {
        updateStateOnAuthFail(state);
      });
  },
});

export default authSlice.reducer;
