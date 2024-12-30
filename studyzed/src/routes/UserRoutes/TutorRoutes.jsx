import { Routes, Route } from 'react-router-dom'
import TutorSessionPage from  '../../pages/user/SessionChoice/Tutor/sessionchoice'
import MyProfile from '../../pages/user/MyProfile/Tutor/userProfile'
import NotFound from '../../components/Errors/NotFound';


export default function TutorStates () {
    return (
        <Routes>
            <Route path={ 'choose-session/' } element={<TutorSessionPage />} />
            <Route path='profile/' element={<MyProfile />} />

            <Route path='/*' element={<NotFound />} />
        </Routes>
    );
};