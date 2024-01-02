import { configureStore } from '@reduxjs/toolkit';

import ActivitySliceReducer from './slices/ActivitySlice.js';
import authSliceReducer from "./slices/AuthSlice.js";
import themeSliceReducer from "./slices/ThemeSlice.js";
import threadSliceReducer from "./slices/ThreadSlice.js";
import userSliceReducer from "./slices/UserSlice.js";


const store = configureStore({
    reducer: {
        theme: themeSliceReducer,
        auth: authSliceReducer,
        thread: threadSliceReducer,
        user: userSliceReducer,
        activity: ActivitySliceReducer
    },
    devTools: true,
});

export default store;