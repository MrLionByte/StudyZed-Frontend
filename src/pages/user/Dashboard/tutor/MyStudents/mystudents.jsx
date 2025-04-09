import { useEffect, useState } from 'react';
import { Bounce, toast, ToastContainer } from 'react-toastify';
import { TutorEndPoints } from '../../../../../api/endpoints/userEndPoints';
import api, { API_BASE_URLS } from '../../../../../api/axios_api_call';
import { getSessionData } from '../../components/currentSession';
import { getStudentByCode } from '../../components/studentsInSession';
import LogoSvg from '../../../../../assets/test.svg';

export default function StudentsInSession() {
  const [students, setStudents] = useState([]);
  const [fetchFromBackend, setFetchFromBackend] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isOverlayActive, setIsOverlayActive] = useState(false);

  const studentDetails = getStudentByCode();

  function getStudentInfo(studentCode) {
    const matchedStudent = studentDetails.find(
      student => student.user_code === studentCode
    );
    console.log(studentCode);
    
    return {
      username : matchedStudent ? matchedStudent.username : studentCode,
      name : matchedStudent ? 
        `${matchedStudent?.first_name || ''} ${matchedStudent?.last_name || ''}`.trim() : 
        studentCode,
      email:   matchedStudent ? matchedStudent.email : '',
      phone:  matchedStudent ? matchedStudent.profile?.phone : '',
      pic: matchedStudent ? 
        matchedStudent.profile?.profile_picture?.slice(13) || '' : 
        ''
    };
  }
  

  useEffect(() => {
    if (fetchFromBackend) {
      fetchStudentsData();
      setFetchFromBackend(false);
    }
  }, [fetchFromBackend]);

  async function fetchStudentsData() {
    setLoading(true);
    const session_data = getSessionData();
    try {
      const url = API_BASE_URLS['Session_Service'];
      const qury_data = { session_code: session_data.sessions.session_code };
      console.log('QURY ', qury_data);

      const response = await api.get(TutorEndPoints.StudentsInSession, {
        baseURL: url,
        params: qury_data,
      });
      setStudents(response.data);
      console.log('RESPONSE BRUT', response.data);
    } catch (e) {
      setError(e);
      console.error('Error :', e);
    } finally {
      setLoading(false);
    }
  }

  const handleApproveStudent = async (studentId) => {
    setLoading(true);
    try {
      console.log('STUDENT ID', studentId);

      const url = API_BASE_URLS['Session_Service'];
      const dummy_data = { dummy: 'data' };
      const response = await api.patch(
        `${TutorEndPoints.ApproveStudentInSession}${studentId}/`,
        studentId,
        {
          baseURL: url,
        },
      );
      setStudents(response.data);
      setLoading(false);
      toast.success('sucessfully approved student');
      console.log('RESPONSE BRUT', response.data);
      setFetchFromBackend(true);
    } catch (e) {
      setError(e);
      setLoading(false);
      console.error('Error :', e);
    }
  };

  const confirmationToast = (e, studentId) => {
    e.preventDefault();
    setIsOverlayActive(true);
    toast(
      ({ closeToast }) => (
        <div>
          <p>Are you sure you want to Approve this Student?</p>
          <div className="flex justify-between">
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
              className="rounded bg-red-500 text-white px-4 py-2 mt-2 cursor-pointer"
              onClick={() => {
                setIsOverlayActive(false);
                closeToast();
              }}
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
        position: 'top-center',
        onClose: () => setIsOverlayActive(false),
      },
    );
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-0 md:p-3">
      <div className="grid auto-rows-min gap-5 md:grid-cols-4 h-[550px] overflow-y-scroll">
      {students && Array.isArray(students) && students.length > 0 ? (
          <>
            {students.map((student, index) => {
              const studentInfo = getStudentInfo(student.student_code);
              return (
              <div
                key={student.id}
                className={`aspect-video rounded-xl flex flex-col items-center p-4 
                student-card text`}
              >
                <h4 className="space-x-2 font-semibold">
                  {studentInfo.username} {/* Username */}
                </h4>
                <p className="txt-sm text-emerald-100">Name : <span className="text-md text-emerald-400">{studentInfo.name}</span></p>
                <p className="text-sm text-emerald-100">Email : <span className="text-md text-emerald-400">{studentInfo.email}</span></p>
                {/* <p className="text-sm text-emerald-100">Phone : <span className="text-md text-emerald-400">{studentInfo.phone || 'not available'}</span></p> */}
                
                <div className="w-14 h-14 mt-2 bg-[#e0eaff] rounded-full flex items-center justify-center text-[#5682a3] font-bold">
                {studentInfo.pic ? 
                  <img
                    className="rounded-full"
                    src={studentInfo.pic}
                    alt={student.student_code.charAt(0)}
                  />
                  :
                  <h5>
                    {student.student_code.charAt(0)}
                  </h5>
                }
                </div>
                <p className="text-sm text-gray-400">Applied on : {student.joined_on}</p>
                {!student.is_allowded ? (
                  <button
                    className="rounded bg-slate-400 hover:bg-green-500 mt-4 p-2 cursor-pointer"
                    onClick={(e) => confirmationToast(e, student.id)}
                  >
                    Approve Student
                  </button>
                ) : (
                  <div className="rounded bg-green-500 mt-4 p-2">Approved</div>
                )}
              </div>
              )
            })}

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
            {loading && (
              <div className="fixed inset-0 flex items-center justify-center bg-gray-900/75 z-50">
                <img
                  src={LogoSvg}
                  alt="Loading"
                  className="w-64 h-64 animate-pulse"
                />
              </div>
            )}
    </div>
  );
}
