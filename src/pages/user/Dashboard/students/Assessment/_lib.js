import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { studentEndPoints } from "../../../../../api/endpoints/userEndPoints";
import api, { API_BASE_URLS } from "../../../../../api/axios_api_call.js";
import { getSessionData } from "../../components/currentSession.js";

export const useAssessments = () => {
  const [assessments, setAssessments] = useState([]);
  const [attemptedAssessments, setAttemptedAssessments] = useState([])
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isCreatingAssessment, setIsCreatingAssessment] = useState(false);
  const [fetchFromBackend, setFetchFromBackend] = useState(true);
  const [selectedAssessment, setSelectedAssessment] = useState('');
  const [attemptedAssessment, setAttemptedAssessment] = useState({});

  useEffect(() => {
      if (fetchFromBackend) {
          fetchAssessments().then(() => setFetchFromBackend(false));
      }
  }, [fetchFromBackend,assessments,selectedAssessment]);
  

  const fetchAssessments = async () => {
    setLoading(true);
    try {
      const url = API_BASE_URLS["Session_Service"]
      const session_data = getSessionData();
      const response = await api.get(studentEndPoints.GetStudentAssessments, {
        baseURL: url,
        params: {
          session_code: session_data?.sessions?.session_code,
        },
        
      });
      
      setAssessments(response.data);
      await attendedAssessments();
    } catch (err) {
      setError("Failed to fetch assessments");
      toast.error("Error fetching assessments");
    } finally {
      setLoading(false);
    }
  };

  const attendedAssessments = async () => {
    setLoading(true);
    try {
      const url = API_BASE_URLS["Session_Service"]
      const response = await api.get(studentEndPoints.GetAttendedAssessments, {
        baseURL:url,
      });
      setAttemptedAssessments(response.data)
      
      // setAssessments((prev) => [response.data, ...prev]);
    } catch (err) {
      setError("Failed to create assessment");
      toast.error("Error creating assessment");
    } finally {
      setLoading(false);
    }
  };

  return { assessments, loading, error,isCreatingAssessment, 
    attemptedAssessments,selectedAssessment,attemptedAssessment,fetchFromBackend,
    setSelectedAssessment,setAttemptedAssessment, setIsCreatingAssessment,
    fetchAssessments, setFetchFromBackend
     };
};
