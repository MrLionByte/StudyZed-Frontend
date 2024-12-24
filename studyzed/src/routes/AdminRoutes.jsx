import { Route, Routes } from 'react-router-dom';
import {Admin_Protected_Route} from '../components/ProtectedRoute.jsx';
import AdminLogin from '../pages/admin/Login/AdminLogin.jsx'

export default function AdminRoutes () {
    return (
        <Routes>

            <Route path='login/' element={<AdminLogin />} />

        </Routes>
    );
};