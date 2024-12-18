import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Route } from 'react-router-dom'


export const Student_Protected_Route = ({children}) => {
    const isAuthenticated = useSelector((state)=> state.auth.isAuthenticated);
    const role = useSelector((state)=> state.auth.role);
    if (!isAuthenticated){
        console.log("NOT AUTH STU");
        
        return <Navigate to="/log-in" />;
    } 
    if (role !== 'Student'){
        console.log("NOT AUTH STU ROLE");
        return <Navigate to="/log-in" />;
    }
    return children;
};

export const Tutor_Protected_Route = ({children}) => {
    const isAuthenticated = useSelector((state)=> state.auth.isAuthenticated);
    const role = useSelector((state)=> state.auth.role);
    if (!isAuthenticated){
        console.log("NOT AUTH TEC");
        return <Navigate to="/log-in" />;
    } 
    if (role !== 'Tutor'){
        console.log("NOT AUTH TEC ROLE");
        return <Navigate to="/log-in" />;
    }
    return children;
};

export const Admin_Protected_Route = ({children}) => {
    const isAuthenticated = useSelector((state) => state.adminAuth.isAuthenticated);

    if (!isAuthenticated) {
        return <Navigate to="/" />;
    }
    return children;
};
