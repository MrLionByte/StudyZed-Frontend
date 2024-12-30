import { useEffect, useState } from "react";
import api from "../../../../../api/axios_api_call.js";
import {adminEndPoints} from '../../../../../api/endpoints/adminEndPoint.js'
import { ToastContainer, toast } from 'react-toastify';


export const useTutorManagement = () => {
    
    const [students, setstudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [fetchFromBackend, setFetchFromBackend] = useState(true);


    useEffect(()=> {

        async function fetchStudentsData () {
            setLoading(true);
            try {
                const response = await api.get(adminEndPoints.StudentManamgement);
                setstudents(response.data);
                console.log("RESPONSE BRUT",response.data.results)
            } catch (e) {
                setError(e);
                setLoading(false);
                console.error("Error :", e);
            }
        };
        if (fetchFromBackend){
            fetchStudentsData();
            setFetchFromBackend(false);
        }
    } ,[fetchFromBackend]);

    const handleBlockUser = async (e, student_id, isActive) => {
        e.preventDefault();
        try {
            const response = await api.patch(adminEndPoints.BlockTutor+`${student_id}/`);
            console.log(response.data);
            if (isActive){
                toast.success("User un-blocked successfully!");
            } else {
                toast.success("User blocked successfully!");
            }
            
            setFetchFromBackend(true);
        }catch (e) {
            console.error("Error :", e);
            alert("Failed to block user. Please try again.");
        }
    }

    return {
        students,
        loading,
        error,
        setstudents,
        setLoading,
        setError,
        handleBlockUser,
    }
    
}