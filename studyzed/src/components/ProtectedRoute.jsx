import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Route } from 'react-router-dom'
import { toast } from "react-toastify";


export const Student_Protected_Route = ({children}) => {
    const isAuthenticated = useSelector((state)=> state.auth.isAuthenticated);
    const role = useSelector((state)=> state.auth.role);
    if (!isAuthenticated){
        console.log("NOT AUTH STU");
        return <Navigate to="/login" />;
    } 
    if (role !== 'Student'){
        console.log("NOT AUTH STU ROLE");
        return <Navigate to="/login" />;
    }
    return children;
};

export const Tutor_Protected_Route = ({children}) => {
    const isAuthenticated = useSelector((state)=> state.auth.isAuthenticated);
    const role = useSelector((state)=> state.auth.role);
    console.log("ROLe :", role, isAuthenticated);
    
    if (!isAuthenticated){
        console.log("NOT AUTH TEC");
        return <Navigate to="/login" />;
    } 
    if (role !== 'Tutor'){
        console.log("NOT AUTH TEC ROLE");
        return <Navigate to="/login" />;
    }
    return children;
};

export const Admin_Protected_Route = ({children}) => {
    const isAdminAuthenticated = useSelector((state) => state.adminAuth.isAdminAuthenticated);
    console.log("IS AUTH", isAdminAuthenticated);
    
    if (!isAdminAuthenticated) {
        toast.error("Not Authenticated")
        return <Navigate to="/admin/login/" replace />;
    }
    console.log("i am SUCCESSING");
    return children;
};


