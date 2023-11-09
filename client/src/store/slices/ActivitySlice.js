import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axiosInstance from "../../helpers/AxiosInstance";

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
        unfollwedFollowers: []
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
         .addCase(getUnfollowedFollowers.fulfilled, (state, action) => {
            state.getUnfollowedFollowers = action.payload.userNotFollowedBack; 
         })
    }
});

export default activitySlice.reducer;