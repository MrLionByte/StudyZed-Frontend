import { Routes, Route } from 'react-router-dom'
import SessionChoice from '../../pages/user/SessionChoice/Student/sessionchoice';
import MyProfile from '../../pages/user/MyProfile/Student/userProfile';


export default function TutorRoutes () {
    return (
        <Routes>

            <Route path="choose-session/" element={<SessionChoice />} />
            <Route path="student-profile/" element={<MyProfile />} />

        </Routes>
    );
};

