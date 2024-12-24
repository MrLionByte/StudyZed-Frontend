import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from '../pages/home/Home.jsx';
import Signin from '../pages/user/Login/Log-in.jsx';
import Signup from '../pages/user/Sign-up/sign-up';
import StudentRoutes from './UserRoutes/StudentRoutes.jsx'
import TutorRoutes from './UserRoutes/TutorRoutes.jsx'
import {Student_Protected_Route} from '../components/ProtectedRoute.jsx';
import {Tutor_Protected_Route} from '../components/ProtectedRoute.jsx';
import UserDashboard from '../pages/user/Dashboard/userDashboard.jsx'
import NotFound from '../components/Errors/NotFound.jsx';


export default function UserRoutes () {
    return (
        <Routes>
            
            <Route path='/' element={<Home />} />
            <Route path='login/' element={<Signin />} />
            <Route path='sign-up/' element={<Signup />} />

            {/* For STUDENT */}
            
            <Route path='student/*' element={
                <Student_Protected_Route>
                    <StudentRoutes />
                </Student_Protected_Route>
            } />
            
            {/* For TUTOR */}
            <Route path='tutor/*' element={
                <Tutor_Protected_Route>
                    <TutorRoutes />
                </ Tutor_Protected_Route>
                } />
            <Route path='dashboard/' element={<UserDashboard />} />

            <Route path='/*' element={<NotFound />} />
        </Routes>
    );
};