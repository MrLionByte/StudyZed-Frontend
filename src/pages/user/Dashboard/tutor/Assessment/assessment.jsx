import { useState } from 'react';
import CreateAssessment from './components/createAssessment';
import AssessmentModal from './components/showAssessment.jsx';
import StudentAssessmentModal from './components/showStudentAssessment.jsx';
import { Plus } from 'lucide-react';
import { useAssessments } from './_lib.js';
import LogoSvg from '../../../../../assets/test.svg';
import { getStudentByCode } from '../../components/studentsInSession.js';

export default function Assessment({ session_data }) {
  const {
    assessments,
    attendedStudents,
    studentAttendedAssessment,
    loading,
    isCreatingAssessment,
    setIsCreatingAssessment,
    setFetchFromBackend,
    handleAttendedAssessmentView,
    handleStudentAssessment,
  } = useAssessments();

  const [searchValue, setSearchValue] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState('');
  const studentDetails = getStudentByCode();

  const closeModal = () => {
    setIsCreatingAssessment(false);
  };

  const handleAssessmentView = (assessment) => {
    setSelectedAssessment(assessment);
    setShowModal(true);
  };

  const handleStudentAttendedAssessment = async (student) => {
    await handleStudentAssessment(student);
    setShowStudentModal(true);
  };

  const fetchFromBackend = () => {
    setFetchFromBackend(true);
  };

  const handleSearch = (e) => {
    e.preventDefault();
  };

  function getStudentNameByCode(studentCode) {
    const matchedStudent = studentDetails.find(
      (student) => student.user_code === studentCode,
    );
    return matchedStudent ? matchedStudent.username : 'Student not found';
  }

  function getStudentProfile(studentCode) {
    const matchedStudent = studentDetails.find(
      (student) => student.user_code === studentCode,
    );
    return matchedStudent
      ? matchedStudent.profile?.profile_picture?.slice(13)
      : '';
  }

  return (
    <>
      <div className="container w-full mx-auto px-2 py-4 md:flex-row gap-8 h-full">
        <div className="space-y-8 w-full h-3/5">
          <div
            className="student-card backdrop-blur-sm border 
            border-teal-800/30 rounded-lg p-4"
          >
            {/* <button >
                <ChevronsLeft />
              </button> */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-teal-400">
                REVIEW ASSESSMENT
              </h2>
              <button
                onClick={() => setIsCreatingAssessment(true)}
                className="flex items-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 
                  rounded-lg transition-colors sm:size-5/12 md:size-fit"
              >
                <Plus className="w-5 h-5" />
                <span>Create Assessment</span>
              </button>
            </div>
            <div className="h-96 overflow-y-scroll space-y-2">
              {assessments?.map((assessment, index) => (
                <div
                  key={assessment.id}
                  className="flex items-center space-x-4 p-2 bg-gray-800/50 rounded-lg"
                >
                  <span className="text-gray-400">{index + 1}</span>
                  <div className="w-full flex justify-between">
                    <p
                      className="text-white cursor-pointer"
                      onClick={() =>
                        handleAssessmentView(assessment, 'DETAILS')
                      }
                    >
                      {assessment.assessment_title}
                    </p>
                    <p
                      onClick={() =>
                        handleAttendedAssessmentView(assessment, 'SUBMITTED')
                      }
                      className="cursor-pointer rounded-badge bg-emerald-500 p-2 h-7 w-7 transition-all delay-150 duration-300 ease-in-out hover:w-24 overflow-hidden flex items-center justify-start"
                    >
                      <span className="text-white text-sm font-semibold whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity duration-300">
                        Submitted
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 h-80 t-5 overflow-scroll">
          <div
            className="grid grid-cols-1 student-card backdrop-blur-sm border 
    border-teal-800/30 rounded-lg p-3 "
          >
            <h2 className="text-xl text-center p-1 underline underline-offset-4 font-bold text-teal-400">
              STUDENTS ATTENDED ASSESSMENT
            </h2>
            {attendedStudents.length > 0 ? (
              <div className="grid sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 ">
                {attendedStudents.map((student, index) => (
                  <div
                    key={student.id}
                    className="flex items-center p-2 bg-gray-800/50 rounded-lg 
           gap-3 cursor-pointer"
                    onClick={() => handleStudentAttendedAssessment(student)}
                  >
                    <img
                      src={
                        getStudentProfile(student.student_code) ||
                        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZ1iAWsH72RCWQeckHI1LVBeV5UpKzwPisN3pXH48_BsLZjU0JvQNownk2-RRiA2BJWyw&usqp=CAU'
                      }
                      className="rounded-full w-10 h-10"
                      alt=""
                    />
                    <div>
                      <p className="text-white text-center">
                        {getStudentNameByCode(student.student_code)}
                      </p>
                      {student?.is_late_submission ? (
                        <p className="text-sm w-1/2 h-5 bg-yellow-700 rounded-full text-center">
                          Late
                        </p>
                      ) : (
                        <p className="w-1/2 h-5 bg-emerald-400 rounded-full"></p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <h4 className="text-red-400 text-center text-wrap mt-6">
                No one Attended yet
              </h4>
            )}
          </div>
        </div>
      </div>

      {isCreatingAssessment && (
        <CreateAssessment
          handleClose={closeModal}
          fetchFromBackend={fetchFromBackend}
        />
      )}

      {showModal && (
        <AssessmentModal
          assessmentData={selectedAssessment}
          handleClose={() => setShowModal(false)}
          onSave=""
        />
      )}

      {showStudentModal && (
        <StudentAssessmentModal
          assessmentData={studentAttendedAssessment}
          handleClose={() => setShowStudentModal(false)}
        />
      )}

      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900/75 z-50">
          <img
            src={LogoSvg}
            alt="Loading"
            className="w-64 h-64 animate-pulse"
          />
        </div>
      )}
    </>
  );
}
