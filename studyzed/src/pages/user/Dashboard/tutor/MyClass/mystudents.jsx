import { useEffect, useState } from "react"
import { Bounce, toast, ToastContainer } from "react-toastify"
import {TutorEndPoints} from "../../../../../api/endpoints/userEndPoints";
import api,{api_dictatory} from "../../../../../api/axios_api_call";
import { LucideSquareArrowRight } from "lucide-react";
  

export default function StudentsInSession({session_data}) {
    const [students ,setStudents] = useState([])
    const [fetchFromBackend, setFetchFromBackend] = useState(true)
    const [loading,setLoading] = useState(false)
    const [error, setError] = useState('')
    const [sessionData, setSessionData] = useState('')
    const [isOverlayActive ,setIsOverlayActive] = useState(false)

    useEffect(() => {
      if (session_data) {
          setSessionData(session_data);
      }
      console.log(sessionData, "::", session_data);
      
  }, [session_data]);
   
    useEffect(()=> {

        async function fetchStudentsData () {
            setLoading(true);
            try {
                const url = api_dictatory["Session_Service"]
                const qury_data = {"session_code": session_data.sessions.session_code}
                console.log("QURY ",qury_data);
                
                const response = await api.get(TutorEndPoints.StudentsInSession,{
                    baseURL: url,
                    params: qury_data,
                });
                setStudents(response.data);
                console.log("RESPONSE BRUT",response.data)
                
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

    const handleApproveStudent = async(studentId) => {
      setLoading(true);
            try {
              console.log("STUDENT ID",studentId);
              
                const url = api_dictatory["Session_Service"]
                const dummy_data = {"dummy":"data"}
                const response = await api.patch(
                  `${TutorEndPoints.ApproveStudentInSession}${studentId}/`,
                  studentId,{
                    baseURL: url,
                });
                setStudents(response.data);
                setLoading(false)
                toast.success("sucessfully approved student")
                console.log("RESPONSE BRUT",response.data)
                setFetchFromBackend(true)
            } catch (e) {
                setError(e);
                setLoading(false);
                console.error("Error :", e);
            }
      
    }

    const confirmationToast = (e, studentId) => {
      e.preventDefault();
      setIsOverlayActive(true);
      toast(
          ({ closeToast }) => (
              <div>
                  <p>Are you sure you want to Approve this Student?</p>
                  <div className='flex justify-between'>
                  <button
                      className="rounded bg-green-500 text-white px-4 py-2 mt-2 cursor-pointer"
                      onClick={() => {
                        handleApproveStudent(studentId);
                          setIsOverlayActive(false);
                          closeToast();
                      }}
                  >
                      Yes
                  </button>
                  <button
                    className='rounded bg-red-500 text-white px-4 py-2 mt-2 cursor-pointer'
                    onClick={() => {
                      setIsOverlayActive(false);
                      closeToast();}}
                  >
                    NO
                  </button>
                  </div>
              </div>
          ),
          {
              autoClose: false,
              closeOnClick: false,
              draggable: false,
              position: "top-center",
              onClose: () => setIsOverlayActive(false),
          }
      );
    };

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="grid auto-rows-min gap-5 md:grid-cols-5">
            {students && Array.isArray(students) && students.length > 0 ? (
              <>
              {students.map((student) => (
                <div key={student.id} className={`aspect-video rounded-xl flex flex-col items-center p-4 
                bg-muted/50 text-black`} >
                  <h4 className="font-semibold">{student.student_code}</h4>
                  
                  <p className="font-bold">{student.username}</p>
                  <p className="text-sm">Applied on : {student.joined_on}</p>
                  <p className="text-sm flex justify-center items-center gap-3 p-2">Student details
                    <LucideSquareArrowRight className="hover:text-blue-900 cursor-pointer" /></p>
                  
                  {(!student.is_allowded ? 
                  <button className='rounded bg-slate-400 hover:bg-green-500 mt-4 p-2 cursor-pointer'
                    onClick={(e)=> confirmationToast(e, student.id)}
                    >Approve Student</button>
                  :
                  
                  <div className="rounded bg-green-500 mt-4 p-2">
                    Approved
                  </div>
                  )}

                </div>
              ))}
              {isOverlayActive && <div className="overlay active"></div>}
              <ToastContainer
            autoClose={1000} 
            closeOnClick
            pauseOnHover
            draggable
            position="top-center"
            theme="colored"
        />
        </>
          ) : (
            <p>No students found.</p>
          )}
            </div>
          </div>
    )
  }
  