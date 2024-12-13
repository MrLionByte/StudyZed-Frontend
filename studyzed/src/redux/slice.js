import {} from '@reduxjs/toolkit';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../Api/helpers/constrands.js';

const initialUserState = {
    user : savedAuthState?.user || null,
    isAuthenticated : savedAuthState?.isAuthenticated || false,
};

const userAuth = createSlice({
    name: 'auth',
    initialState: initialUserState,
    reducers : {
        setUser : (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            localStorage.setItem('authState',JSON.stringify(state));
        },
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            localStorage.removeItem('authState');
        },
    },
});

export const { setUser, logout } = userAuth.actions;
export default { 
   userAuthREducer: userAuth.reducer,
 };