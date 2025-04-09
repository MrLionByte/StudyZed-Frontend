import { useEffect, useState } from "react";
import {adminEndPoints} from '../../../../../api/endpoints/adminEndPoint.js'
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";
import api, {API_BASE_URLS} from "../../../../../api/axios_api_call.js";

export const useApproveSessionManagement = () => {
    
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [fetchFromBackend, setFetchFromBackend] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isOverlayActive, setIsOverlayActive] = useState(false);
    const [sessionPayment, setSessionsPayment] = useState([]);

    async function fetchSessionsData () {
        setLoading(true);
        try {
            const url = API_BASE_URLS["Session_Service"]
            const response = await api.get(adminEndPoints.SeeSessionsToApprove, {
                baseURL: url, 
            });
            setSessions(response.data);
        } catch (e) {
            setError('some error occurred, connect with the support');
            setLoading(false);
        }
    };

    useEffect(()=> {
        if (fetchFromBackend){
            fetchSessionsData();
            setFetchFromBackend(false);
        }
    } ,[fetchFromBackend]);

    const handleApproveSession = async (e) => {
        e.preventDefault();
        e.target.disabled = true;
        try {
            const Pkey = sessionPayment.session_key;   
            const url = API_BASE_URLS["Session_Service"];
            const response = await api.patch(adminEndPoints.GiveApprovelForSession+`${Pkey}/`,
              Pkey,{
                baseURL: url,
            });
            toast.success(response.data.message)
            setIsModalOpen(false)
            setFetchFromBackend(true)
            
        }catch (e) {
            alert("Failed to block user. Please try again.");
        }finally {
            e.target.disabled = false;
        }
    }

    const handleModal = async (e, session_code, tutor_code, session_id) => {
        e.preventDefault();
        try {
          const session_data = { session_code, tutor_code };
          const url = API_BASE_URLS["Payment_Service"];
          const response = await api.get(adminEndPoints.SeeSessionPayment, {
            baseURL: url,
            params: session_data,
          });
          
          response.data[0]["session_key"] = session_id
          setSessionsPayment(response.data[0]);
          setIsModalOpen(true);
        } catch (e) {
          alert("Failed to fetch session details. Please try again.");
        }
      };
      
        

    const handleApprove = async (e, session_code, tutor_code) => {
        handleApproveSession(sessionDetails.session_code, sessionDetails.tutor_code);
        setIsModalOpen(false);
        toast.success('Session approved!');
      };  

    return {
        sessions,
        loading,
        error,
        isModalOpen,
        isOverlayActive,
        sessionPayment,
        
        setIsOverlayActive,
        setIsModalOpen,
        setSessions,
        setLoading,
        setError,
        handleApproveSession,
        handleModal,
    }
    
}