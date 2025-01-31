import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { TutorEndPoints } from "../../../../../api/endpoints/userEndPoints";
import api, { api_dictatory } from "../../../../../api/axios_api_call.js";
import { getSessionData } from "../../components/currentSession.js";

export const useAssessments = () => {
  const [assessments, setAssessments] = useState([]);
  //   const [assessments, setAssessments] = useState([
  //   { id: 7, title: 'Assessment 7', questions: [] },
  //   { id: 6, title: 'Assessment 6', questions: [] },
  //   { id: 5, title: 'Assessment 5', questions: [] },
  //   { id: 4, title: 'Assessment 4', questions: [] },
  //   { id: 3, title: 'Assessment 3', questions: [] },
  // ]);  
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isCreatingAssessment, setIsCreatingAssessment] = useState(false);
    const [fetchFromBackend, setFetchFromBackend] = useState(true);
  
  useEffect(() => {
      if (fetchFromBackend) {
          fetchAssessments().then(() => setFetchFromBackend(false));
      }
  }, [fetchFromBackend]);
  

  const fetchAssessments = async () => {
    setLoading(true);
    try {
      const url = api_dictatory["Session_Service"]
      const session_data = getSessionData();
      const response = await api.get(TutorEndPoints.GetAllAssessments, {
        baseURL: url,
        params: {
          session_code: session_data?.sessions?.session_code,
        },
        
      });
      console.log(response);
      
      setAssessments(response.data);
    } catch (err) {
      setError("Failed to fetch assessments");
      toast.error("Error fetching assessments");
    } finally {
      setLoading(false);
    }
  };

  const createAssessment = async (assessmentData) => {
    setLoading(true);
    try {
      const response = await api.post(TutorEndPoints.CREATE_ASSESSMENT, assessmentData);
      setAssessments((prev) => [response.data, ...prev]);
      toast.success("Assessment created successfully");
    } catch (err) {
      setError("Failed to create assessment");
      toast.error("Error creating assessment");
    } finally {
      setLoading(false);
    }
  };

  return { assessments, loading, error,isCreatingAssessment, 
    setIsCreatingAssessment,fetchAssessments, createAssessment,
     };
};
