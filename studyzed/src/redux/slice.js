import { createSlice } from '@reduxjs/toolkit';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../Api/helpers/constrands.js';

const savedUserState = JSON.parse(localStorage.getItem('authState'));
const savedAdminState = JSON.parse(localStorage.getItem('adminAuthState'));

const initialUserState = {
    user : savedUserState?.user || null,
    isAuthenticated : savedUserState?.isAuthenticated || false,
    role : savedUserState?.role || null,
};

const initialAdminState = {
    admin: savedAdminState?.admin || null,
    isAdminAuthenticated: savedAdminState?.isAdminAuthenticated || false,
};

const userAuth = createSlice({
    name: 'auth',
    initialState: initialUserState,
    reducers : {
        setUser : (state, action) => {
            const { user, role } = action.payload;
            console.log(user, role, "SLICE WORK");
            
            state.user = user;
            state.role = role;
            state.isAuthenticated = true;
            localStorage.setItem('authState',JSON.stringify(state));
        },
        logout: (state) => {
            state.user = null;
            state.role = null;
            state.isAuthenticated = false;
            localStorage.removeItem('authState');
        },
    },
});


const adminAuth = createSlice({
    name: "adminAuth",
    initialState: initialAdminState,
    reducers :{
        setAdmin: (state, action)=>{
            const { id, username, email, is_superuser } = action.payload;
            state.admin = { id, username, email, is_superuser };
            state.isAdminAuthenticated = is_superuser || false;
                localStorage.setItem('adminAuthState', JSON.stringify(state));
        },
        adminLogout(state) {
            state.admin = null;
            state.isAdminAuthenticated = false;
            localStorage.removeItem('adminAuthState');
        },
    },
});

export const { setUser, logout } = userAuth.actions;
export const { setAdmin, adminLogout } = adminAuth.actions;
export default { 
   userAuthReducer: userAuth.reducer,
   adminAuthReducer: adminAuth.reducer,
 };