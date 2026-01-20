import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import axiosInstance from "../../helpers/AxiosInstance.js";

const initialState = {
  loading: false,

  token: localStorage.getItem("token") || null,

  data: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : {},

  role: localStorage.getItem("role")
    ? JSON.parse(localStorage.getItem("role"))
    : "",
};

// ==========================
// THUNKS
// ==========================

// Get current user (rehydration)
export const getUserData = createAsyncThunk(
  "/auth/me",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/me");
      return res.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);

// Register
export const createAccount = createAsyncThunk(
  "/auth/register",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/auth/register", data);
      return res.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);

// Login
export const login = createAsyncThunk(
  "/auth/login",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/auth/login", data);
      return res.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);

// Logout (frontend-only)
export const logout = createAsyncThunk("/auth/logout", async () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("role");
  toast.success("Logged out successfully");
});

// ==========================
// SLICE
// ==========================

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    const pending = (state) => {
      state.loading = true;
    };

    const fulfilledAuth = (state, action) => {
      const { token, user } = action.payload;

      // 🔐 Save to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", JSON.stringify(user.role));

      state.loading = false;
      state.token = token;
      state.data = user;
      state.role = user.role;
    };

    const rejected = (state) => {
      state.loading = false;
    };

    builder
      // REGISTER
      .addCase(createAccount.pending, pending)
      .addCase(createAccount.fulfilled, fulfilledAuth)
      .addCase(createAccount.rejected, rejected)

      // LOGIN
      .addCase(login.pending, pending)
      .addCase(login.fulfilled, fulfilledAuth)
      .addCase(login.rejected, rejected)

      // LOGOUT
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.token = null;
        state.data = {};
        state.role = "";
      })

      // GET USER
      .addCase(getUserData.pending, pending)
      .addCase(getUserData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.user;
        state.role = action.payload.user.role;
      })
      .addCase(getUserData.rejected, rejected);
  },
});

export default authSlice.reducer;
