import { configureStore } from '@reduxjs/toolkit';
import reducer from './slice.js';

const store = configureStore({
    reducer: {
       auth : reducer.userAuthReducer, 
       adminAuth: reducer.adminAuthReducer,
    },
});

export default store;