import { createSlice } from "@reduxjs/toolkit";

const threadSlice = createSlice({
    name: "thread",
    initialState: {
        threads: [],
    },
    reducers: {},
    extraReducers: {}
});

export default threadSlice.reducer;