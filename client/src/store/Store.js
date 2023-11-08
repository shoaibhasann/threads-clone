import { configureStore } from '@reduxjs/toolkit';

import authSliceReducer from "./slices/AuthSlice.js";
import themeSliceReducer from "./slices/ThemeSlice.js";
import threadSliceReducer from "./slices/ThreadSlice.js"


const store = configureStore({
    reducer: {
        theme: themeSliceReducer,
        auth: authSliceReducer,
        thread: threadSliceReducer,
    },
    devTools: true,
});

export default store;