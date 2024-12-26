import { useEffect, useState } from "react";
import api from "../../../../../api/axios_api_call.js";
import {adminEndPoints} from '../../../../../api/endpoints/adminEndPoint.js'


export const useTutorManagement = () => {
    
    const [tutors, setTutors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(()=> {
        async function fetchTutorsData () {
            try {
                const response = await api.get(adminEndPoints.TutorManagement);
                setTutors(response.data);
                const data = () => {
                    }
                console.log("RESPONSE BRUT",response.data)
            } catch (e) {
                console.error("Error :", e);
            }
        };
        fetchTutorsData();
    } ,[]);

    return {
        tutors,
        loading,
        error,
        setTutors,
        setLoading,
        setError,
    }
    
}