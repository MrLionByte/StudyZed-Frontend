import { useEffect, useState } from 'react';
import { Bounce, toast, ToastContainer } from 'react-toastify';
import { TutorEndPoints } from '../../../../../api/endpoints/userEndPoints';
import api, { API_BASE_URLS } from '../../../../../api/axios_api_call.js';
import CreateAssessment from './components/createAssessment';
import AssessmentModal from './components/showAssessment.jsx';
import StudentAssessmentModal from './components/showStudentAssessment.jsx';
import { Plus, X, Search } from 'lucide-react';
import { useAssessments } from './_lib.js';
import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
} from "lucide-react"
 
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


import DatePickerWithRange from "./components/dateRangePicker.jsx";
import { getStudentByCode } from '../../components/studentsInSession.js';


export default function Assessment({ session_data }) {
  const {
    assessments,
    attendedStudents,
    studentAttendedAssessment,
    loading,
    isCreatingAssessment,
    scheduled,
    ongoing,
    completed,
    setIsCreatingAssessment,
    setFetchFromBackend,
    handleAttendedAssessmentView,
    handleStudentAssessment,
  } = useAssessments();

  const [searchValue,setSearchValue] = useState('');
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

  const handleStudentAttendedAssessment = async(student) => {
    await handleStudentAssessment(student)
    setShowStudentModal(true)
  }

  const fetchFromBackend = () => {
    setFetchFromBackend(true);
  };

  const handleSearch = (e) =>{
    e.preventDefault();
  }

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

          <div className="bg-black/20 backdrop-blur-sm border border-teal-800/30 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-teal-400">
                REVIEW ASSESSMENT
              </h2>
              <div className='flex gap-3 items-center h-9'>
                <form onSubmit={handleSearch} className='w-full flex items-center justify-end'>
                <input className="p-2 rounded-md md:min-w-[350px] 
                md:max-w-[400px] text-md text-black"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Search using assessment or student name.." />
                    <button className='absolute text-black p-2'>
                      <Search className='size-5'/>
                    </button>
                  </form>
                <DropdownMenu>
                  <DropdownMenuTrigger 
                    className="border border-emerald-500 hover:bg-emerald-500 rounded-md p-2 border-opacity-60 font-bold w-28">
                      All <span className='ml-4'>↓</span></DropdownMenuTrigger>
                  <DropdownMenuContent className="z-20">
                    <DropdownMenuLabel>
                      <DatePickerWithRange />
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>
                    {/* <form onSubmit={handleSubmit} className="w-full">
                      <input className='w-full p-2 text-sm font-normal opacity-75 border-1 border-gray-300 rounded-md' 
                      type="text"
                      onChange={()=> setI}
                      placeholder='Student name' />
                    </form> */}
                    </DropdownMenuLabel>
                  </DropdownMenuContent>
                </DropdownMenu>
                
              </div>
              <button
                onClick={() => setIsCreatingAssessment(true)}
                className="flex items-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>Create Assessment</span>
              </button>
            </div>
            <div className="space-y-2">
              {assessments.map((assessment, index) => (
                <div
                  key={assessment.id}
                  className="flex items-center space-x-4 p-2 bg-gray-800/50 rounded-lg"
                >
                  <span className="text-gray-400">{index + 1}</span>
                  <div className='w-full flex justify-between'>
                  <p className="text-white cursor-pointer" 
                    onClick={() => handleAssessmentView(assessment, "DETAILS")}
                    >
                    {assessment.assessment_title}
                  </p>
                  <p
                    onClick={() => handleAttendedAssessmentView(assessment, "SUBMITTED")}
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
       
  <div className="mt-2 grid grid-cols-1">
  <div className="grid grid-cols-1 bg-black/20 backdrop-blur-sm border border-teal-800/30 rounded-lg p-3">
  <h2 className="text-xl text-center p-1 underline underline-offset-4 font-bold text-teal-400">
    STUDENTS ATTENDED ASSESSMENT
    </h2>
    {attendedStudents.length>0 ?
    <div className="grid grid-cols-6 gap-2">
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
            className='rounded-full w-10 h-10' alt="" />
          <div>
          <p
            className="text-white text-center"
          >
           {getStudentNameByCode(student.student_code)}
          </p>
          {student?.is_late_submission ? 
            <p className='text-sm w-1/2 h-5 bg-yellow-700 rounded-full text-center'>Late</p>
            :
            <p className='w-1/2 h-5 bg-emerald-400 rounded-full'></p>
          }
          </div>
        </div>
      ))}
    </div>
    :
    <h4 className='text-red-400'>No one Attended</h4>
    }
  </div>
</div>

      </div>

      {/* Create Assessment Modal */}
      {isCreatingAssessment && (
        <CreateAssessment
          handleClose={closeModal}
          fetchFromBackend={fetchFromBackend}
        />
      )}

      {/* Assessment Details Modal */}
      {showModal && (
        <AssessmentModal
          assessmentData={selectedAssessment}
          handleClose={() => setShowModal(false)}
        />
      )}

      {showStudentModal && (
        <StudentAssessmentModal 
        assessmentData={studentAttendedAssessment}
        handleClose={() => setShowStudentModal(false)} />
      )}
    </>
  );
}
