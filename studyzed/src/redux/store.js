import { configureStore } from '@reduxjs/toolkit';
import reducer from './slice.js';

const store = configureStore({
    reducer: {
       auth : reducer.userAuthREducer, 
    },
});

export default store;