import { Routes, Route } from 'react-router-dom'
import SessionChoice from '../../pages/user/SessionChoice/sessionchoice';
import MyProfile from '../../pages/user/MyProfile/userProfile';


export default function TutorRoutes () {
    return (
        <Routes>
            <Route path='/choose-session' element={<SessionChoice />} />
            <Route path='/profile' element={<MyProfile />} />
        </Routes>
    );
};