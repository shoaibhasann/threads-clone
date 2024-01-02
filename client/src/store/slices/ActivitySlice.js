import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axiosInstance from "../../helpers/AxiosInstance";

// Thunk function to fetch reposts reposted by user
export const getReposts = createAsyncThunk("/activity/get-reposts", async (userId, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get(`/posts/fetch-repost/${userId}`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error?.response?.data?.message);
    }
})

// Thunk function to get unfollowed followers
export const getUnfollowedFollowers = createAsyncThunk("/activity/unfollowed-followers", async (_, { rejectWithValue}) => {
try {
    const response = await axiosInstance.get("/unfollowed-followers");

    return response.data;
} catch (error) {
    return rejectWithValue(error?.response?.data?.message);
}
});

const activitySlice = createSlice({
    name: "activity", 
    initialState: {
        unfollwedFollowers: [],
        repostedPost: []
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
         .addCase(getUnfollowedFollowers.fulfilled, (state, action) => {
            state.getUnfollowedFollowers = action.payload.userNotFollowedBack; 
         })
         .addCase(getReposts.fulfilled, (state, action) => {
            state.repostedPost = action.payload.reposts;
         })
    }
});

export default activitySlice.reducer;