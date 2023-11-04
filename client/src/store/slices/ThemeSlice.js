import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    themeMode: "dark"
}

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme : (state, action) => {
        state.themeMode = action.payload;
    }
  },
});

export const { setTheme } = themeSlice.actions;

export default themeSlice.reducer;
