import { useEffect, useState } from 'react';
import CreateAssessment from './createAssessment.jsx';
import AssessmentModal from './showAssessment.jsx';
import { Plus, X, Search } from 'lucide-react';
import { useAssessments } from './_lib.js';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import DatePickerWithRange from './components/dateRangePicker.jsx';

export default function ReviewAssessment({ session_data }) {
  const {
    assessments,
    loading,
    isCreatingAssessment,
    scheduled,
    ongoing,
    completed,
    setIsCreatingAssessment,
    setFetchFromBackend,
  } = useAssessments();

  const [searchValue, setSearchValue] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState('');
  const closeModal = () => {
    setIsCreatingAssessment(false);
  };

  const handleAssessmentView = (assessment, typeSelected) => {
    if (typeSelected === 'DETAILS') {
      setSelectedAssessment(assessment);
      setShowModal(true);
    }
  };

  const fetchFromBackend = () => {
    setFetchFromBackend(true);
  };

  const handleSearch = (e) => {
    e.preventDefault();
  };
  return (
    <>
      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        <div className="flex-1 space-y-8 ">
          <div className="bg-black/20 backdrop-blur-sm border border-teal-800/30 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-teal-400">
                REVIEW ASSESSMENT
              </h2>
              <div className="flex gap-3 items-center h-9">
                <form
                  action={handleSearch}
                  className="w-full flex items-center justify-end"
                >
                  <input
                    className="p-2 rounded-md md:min-w-[350px] 
                md:max-w-[400px] text-md text-black"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="Search using assessment or student name.."
                  />
                  <button className="absolute text-black p-2">
                    <Search className="size-5" />
                  </button>
                </form>
                <DropdownMenu>
                  <DropdownMenuTrigger className="border border-emerald-500 hover:bg-emerald-500 rounded-md p-2 border-opacity-60 font-bold w-28">
                    All <span className="ml-4">↓</span>
                  </DropdownMenuTrigger>
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
                  className="flex items-center space-x-4 p-3 bg-gray-800/50 rounded-lg"
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
                        handleAssessmentView(assessment, 'SUBMITTED')
                      }
                      className="cursor-pointer rounded-badge bg-emerald-500 p-2 h-7 w-7 transition-all delay-150 duration-300 ease-in-out hover:w-20 overflow-hidden flex items-center"
                    >
                      <span className="text-white text-sm whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity duration-300">
                        Submitted
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
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
        />
      )}
    </>
  );
}
