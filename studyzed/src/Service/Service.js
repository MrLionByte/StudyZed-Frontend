import api from "../Api/axios_api_call";
import { useDispatch } from 'react-redux';
import { setUser, logout } from "../redux/slice";
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../Api/helpers/constrands'


export const userAuthActions = () => { 
    const dispatch = useDispatch();
    const loginUserorRegister = dispatch(loginUser);
 };