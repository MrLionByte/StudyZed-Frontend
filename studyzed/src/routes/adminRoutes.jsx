import { Route, Routes, Navigate } from 'react-router-dom';
import {Admin_Protected_Route} from '../components/ProtectedRoute.jsx';
import AdminLogin from '../pages/admin/login/adminLogin.jsx'
import AdminHome from '../pages/admin/interface/adminInterface.jsx'
import Dashboard from '../pages/admin/interface/dashboard/dashboard.jsx';
import TutorManagement from '../pages/admin/interface/userManagement/tutorManagement/tutorManagement.jsx';
import StudentManagement from '../pages/admin/interface/userManagement/studentManagement/studentManagement.jsx';

export default function AdminRoutes () {
    return (
        <Routes>

            <Route path='login/' element={<AdminLogin />} />
            
            <Route path='' element={<AdminHome />} >
                <Route index element={<Navigate to="dashboard" replace />} /> 
                <Route path='dashboard/' element={<Dashboard />} />
                <Route path='tutor-management/' element={<TutorManagement />} />
                <Route path='student-management/' element={<StudentManagement />} />
            </Route>
        </Routes>
    );
};