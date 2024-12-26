import { useEffect, useState } from "react";
import api from "../../../../../api/axios_api_call";
import {adminEndPoints} from '../../../../../api/endpoints/adminEndPoint.js'


export const useStudentManagement = () => {
    
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(()=> {
        async function fetchTutorsData () {
            try {
                const response = await api.get(adminEndPoints.TutorManagement);
                console.log(response.data)
            } catch (e) {
                console.error("Error :", e);
            }
        };
        fetchTutorsData();
    } ,[]);

    return {
        students,
        loading,
        error,
        setStudents,
        setLoading,
        setError,
    }
    
}