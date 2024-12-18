import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from '../pages/landing/Home';
import Signin from '../pages/user/Login/Sign-in.jsx';
import Signup from '../pages/user/Sign-up/sign-up';
import StudentRoutes from './Role_Route/StudentRoutes.jsx'
import TutorRoutes from './Role_Route/TutorRoutes.jsx'
import {Student_Protected_Route} from '../components/ProtectedRoute.jsx';
import {Tutor_Protected_Route} from '../components/ProtectedRoute.jsx';
import NotFound from '../components/errors/NotFound.jsx'

export default function UserRoutes () {
    return (
        <Routes>

            <Route path='/' element={<Home />} />
            <Route path='/log-in' element={<Signin />} />
            <Route path='/sign-up' element={<Signup />} />

            {/* For TUTOR */}
            
            <Route path='student/*' element={
                <Student_Protected_Route>
                    <StudentRoutes />
                </Student_Protected_Route>
            } />
            
            {/* For STUDENT */}
            <Route path='tutor/*' element={
                <Tutor_Protected_Route>
                    <TutorRoutes />
                </ Tutor_Protected_Route>
                } />

            <Route path='/*' element={<NotFound />} />
        </Routes>
    );
};