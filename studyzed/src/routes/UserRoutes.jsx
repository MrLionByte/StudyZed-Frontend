import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from '../pages/landing/Home';
import Signin from '../pages/user/login/Sign-in';
import Signup from '../pages/user/sign-up/sign-up';
import SessionChoice from '../pages/user/SessionChoice/sessionchoice';

export default function UserRoutes () {
    return (
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/sign-in' element={<Signin />} />
            <Route path='/sign-up' element={<Signup />} />
            <Route path='/choose-session' element={<SessionChoice />} /> 
        </Routes>
    );
};