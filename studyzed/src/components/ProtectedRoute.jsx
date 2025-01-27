import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from 'react-router-dom'
import { toast } from "react-toastify";


export const Student_Protected_Route = ({children}) => {
    const isAuthenticated = useSelector((state)=> state.auth.isAuthenticated);
    const role = useSelector((state)=> state.auth.role);
    if (!isAuthenticated){
        return <Navigate to="/login" />;
    }
    return children;
};

export const Tutor_Protected_Route = ({children}) => {
    const isAuthenticated = useSelector((state)=> state.auth.isAuthenticated);
    const role = useSelector((state)=> state.auth.role);
    
    if (!isAuthenticated){
        return <Navigate to="/login" />;
    }
    return children;
};

export const Admin_Protected_Route = ({children}) => {
    const isAdminAuthenticated = useSelector((state) => state.adminAuth.isAdminAuthenticated);
    
    if (!isAdminAuthenticated) {
        toast.error("Not Authenticated")
        return <Navigate to="/admin/login/" replace />;
    }
    return children;
};


export const CheckIsAuthenticatedUser = ({children}) => {
    const isAuthenticated = useSelector((state)=> state.auth.isAuthenticated);
    const role = useSelector((state)=> state.auth.role);
    const url = `/${role}/choose-session/`.toLowerCase();
    if (isAuthenticated) {
        return <Navigate to={url} replace />;
    }
    return children;
};