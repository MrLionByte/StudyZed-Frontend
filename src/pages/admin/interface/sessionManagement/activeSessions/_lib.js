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

    useEffect(()=> {

        async function fetchSessionsData () {
            setLoading(true);
            try {
                const url = API_BASE_URLS["Session_Service"]
                const response = await api.get(adminEndPoints.ActiveSessions, {
                    baseURL: url, 
                });
                
                setSessions(response.data);
             
            } catch (e) {
                setError(e);
                setLoading(false);
                console.error("Error :", e);
            }
        };
        
        if (fetchFromBackend){
            fetchSessionsData();
            setFetchFromBackend(false);
        }
    } ,[fetchFromBackend]);

    const handleSessionBlock = async (e) => {
        e.preventDefault();
        e.target.disabled = true;
        try {
           
            const Pkey = sessionPayment.session_key;
            
            const url = API_BASE_URLS["Session_Service"];
            const response = await api.patch(adminEndPoints.BlockedSessions+`${Pkey}/`,
              Pkey,{
                baseURL: url,
            });
          
            toast.success(response.data.message)
            setIsModalOpen(false)
            setFetchFromBackend(true)
            
        }catch (e) {
            console.error("Error :", e);
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
          response.data["session_key"] = session_id
          setSessionsPayment(response.data);
          setIsModalOpen(true);
        } catch (e) {
          console.error("Error fetching session details:", e);
          alert("Failed to fetch session details. Please try again.");
        }
      };
      
        

    const handleApprove = async (e, session_code, tutor_code) => {
        handleSessionBlock(sessionDetails.session_code, sessionDetails.tutor_code);
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
        handleSessionBlock,
        handleModal,
    }
    
}