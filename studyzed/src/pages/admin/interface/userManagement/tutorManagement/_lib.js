import { useEffect, useState } from "react";
import api from "../../../../../api/axios_api_call.js";
import {adminEndPoints} from '../../../../../api/endpoints/adminEndPoint.js'
import { ToastContainer, toast } from 'react-toastify';


export const useTutorManagement = () => {
    
    const [tutors, setTutors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [fetchFromBackend, setFetchFromBackend] = useState(true);
    const [paginatation, setPaginatation] = useState();


    useEffect(()=> {
        async function fetchTutorsData () {
            try {
                const response = await api.get(adminEndPoints.TutorManagement);
                setTutors(response.data);
                console.log("RESPONSE BRUT",response.data)
            } catch (e) {
                console.error("Error :", e);
            }   
        };
        if (fetchFromBackend){
            fetchTutorsData();
            setFetchFromBackend(false);
        }
        
    } ,[fetchFromBackend]);

    const handleBlockUser = async (e, tutor_id, isActive) => {
        e.preventDefault();
        try {
            const response = await api.patch(adminEndPoints.BlockTutor+`${tutor_id}/`);
            console.log(response.data);
            setFetchFromBackend(true);
            if (isActive){
                toast.success("User blocked successfully!");
            } else {
                toast.success("User un-blocked successfully!");
            }
        }catch (e) {
            console.error("Error :", e);
            alert("Failed to block user. Please try again.");
        }
    }

    return {
        tutors,
        loading,
        error,
        setTutors,
        setLoading,
        setError,
        handleBlockUser,
    }
    
}