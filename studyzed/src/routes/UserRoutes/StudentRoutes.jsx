import { Routes, Route } from 'react-router-dom'
import SessionChoice from '../../pages/user/SessionChoice/Student/sessionchoice';
import MyProfile from '../../pages/user/MyProfile/Student/userProfile';
import NotFound from '../../components/Errors/NotFound';


export default function TutorRoutes () {
    return (
        <Routes>

            <Route path="choose-session/" element={<SessionChoice />} />
            <Route path="student-profile/" element={<MyProfile />} />
            <Route path='/*' element={<NotFound />} />
        </Routes>
    );
};

