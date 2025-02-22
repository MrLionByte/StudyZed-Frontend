import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { TutorEndPoints } from "../../../../../api/endpoints/userEndPoints";
import api, { API_BASE_URLS } from "../../../../../api/axios_api_call.js";
import { getSessionData } from "../../components/currentSession.js";

export const useAssessments = () => {
  const [assessments, setAssessments] = useState([]);
  const [attendedStudents ,setAttendedStudents] = useState([])

  const [studentAttendedAssessment, setStudentAttendedAssessment] = useState([])

  const [scheduled, setScheduled] = useState(0);
  const [ongoing, setOngoing] = useState(0);
  const [completed, setCompleted] = useState(0);

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
      const url = API_BASE_URLS["Session_Service"]
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
      const response = await api.post(TutorEndPoints.CreateNewAssessment, assessmentData);
      setAssessments((prev) => [response.data, ...prev]);
      toast.success("Assessment created successfully");
    } catch (err) {
      setError("Failed to create assessment");
      toast.error("Error creating assessment");
    } finally {
      setLoading(false);
    }
  };

  const handleAttendedAssessmentView = async (assessment) =>{
    try{
      const url = API_BASE_URLS["Session_Service"]
      const response = await api.get(TutorEndPoints.GetStudentsAttendedAssessment,{
        baseURL: url,
        params:{assessment_id: assessment.id}
      });
      setAttendedStudents(response.data)
      console.log(response);
      
    } catch(error){
      console.log("ATT ERROR",error);
      
    }
  }

  const handleStudentAssessment = async(student) => {
    console.log(student);
    try {
      const url = API_BASE_URLS["Session_Service"]
      const response = await api.get(TutorEndPoints.GetAttendedAssessment,{
        baseURL: url,
        params:{student_id: student.id}
      });
      console.log(response);
      setStudentAttendedAssessment(response.data)   
    } catch(error){
      console.log("ATT ERROR",error);
    }
  }

  return { assessments,attendedStudents,studentAttendedAssessment, loading, error,isCreatingAssessment, scheduled, ongoing, completed,
    setIsCreatingAssessment,fetchAssessments, createAssessment,setFetchFromBackend,
    handleAttendedAssessmentView,handleStudentAssessment
     };
};
