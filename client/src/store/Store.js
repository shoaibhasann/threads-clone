import { configureStore } from '@reduxjs/toolkit';

import authSliceReducer from "./slices/AuthSlice.js";
import themeSliceReducer from "./slices/ThemeSlice.js";


const store = configureStore({
    reducer: {
        theme: themeSliceReducer,
        auth: authSliceReducer,
    },
    devTools: true,
});

export default store;