import { useEffect, useState } from 'react';
import { Bounce, toast, ToastContainer } from 'react-toastify';
import { TutorEndPoints } from '../../../../../api/endpoints/userEndPoints';
import api, { API_BASE_URLS } from '../../../../../api/axios_api_call.js';
import { Plus, X } from 'lucide-react';
import { useAssessments } from './_lib.js';
import AttendAssessmentModal from './components/AttendAssessment.jsx';
import ShowAssessmentModal from './components/showAssessment.jsx';
import { getSessionData } from '../../components/currentSession.js';
import { attempt } from 'lodash';
import LogoSvg from '../../../../../assets/test.svg';

export default function Assessment({ session_data }) {
  const {
    assessments,
    loading,
    attemptedAssessments,
    selectedAssessment,
    attemptedAssessment,
    setFetchFromBackend,
    setSelectedAssessment,
    setAttemptedAssessment,
    setIsCreatingAssessment,
  } = useAssessments();

  const isAfterToday = (dateString) => {
    if (!dateString) return false;
    const today = new Date().toISOString().split('T')[0];
    const givenDate = dateString.slice(0, 10);
    return givenDate > today;
  };

  const [showAssessment, setShowAssessment] = useState(false);
  const [showAttemptedAssessment, setShowAttemptedAssessment] = useState(false);

  const closeModal = () => {
    setIsCreatingAssessment(false);
  };

  const handleAssessmentView = (assessment) => {
    const check = isAfterToday(assessment.start_time);
    if (check) {
      return;
    }
    setSelectedAssessment(assessment);
    setShowAssessment(true);
  };

  const handleAttemptedAssessmentView = (attemptedAssessment, assessment) => {
    const matchingAssessment = attemptedAssessment.find(
      (item) => item.assessment === assessment.id,
    );
    const check = isAfterToday(assessment.start_time);
    if (check) {
      return;
    }
    setAttemptedAssessment({
      Attempted: matchingAssessment,
      Assessment: assessment,
    });
    setShowAttemptedAssessment(true);
  };

  const today = new Date().toISOString().slice(0, 10);

  return (
    <>
      <div className="container mx-auto py-4 flex flex-col md:flex-row gap-8">
        <div className="flex-1 space-y-8">
          <div
            className="student-card backdrop-blur-sm rounded-lg p-6 h-[800px]"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-teal-400">
                REVIEW ASSESSMENT
              </h2>
            </div>
            <div className="space-y-2">
              {assessments.map((assessment, index) => {
                const isAttempted = attemptedAssessments.some(
                  (attempt) => attempt.assessment == assessment.id,
                );

                const isLate = attemptedAssessments.some(
                  (attempt) =>
                    attempt.assessment == assessment.id &&
                    attempt.is_late_submission,
                );

                return (
                  <div
                    key={assessment.id}
                    onClick={
                      !isAttempted
                        ? () => handleAssessmentView(assessment)
                        : () =>
                            handleAttemptedAssessmentView(
                              attemptedAssessments,
                              assessment,
                            )
                    }
                    className={`flex items-center space-x-4 p-3 rounded-lg  
                      ${isAttempted ? 'bg-green-600/50' : 'bg-gray-800/50 cursor-pointer'}`}
                  >
                    <span className={` ${isAttempted ? 'text-gray-200': 'text-gray-400'}`}>{index + 1}</span>
                    <span className="text-white">
                      {assessment.assessment_title}
                    </span>
                    {isAttempted && !isLate && (
                      <span className="ml-auto text-sm text-green-400 bg-green-900/50 px-2 py-1 rounded">
                        Attempted
                      </span>
                    )}
                    {isLate && (
                      <span className="ml-auto text-sm text-red-300 bg-red-900/50 px-2 py-1 rounded">
                        Late Submission
                      </span>
                    )}
                    {assessment.end_time.slice(0, 10) === today && (
                      <span
                        className="ml-auto text-sm text-teal-200 bg-emerald-900 
                        px-2 py-1 rounded"
                      >
                        Live Today
                      </span>
                    )}
                    {assessment.end_time.slice(0, 10) > today && (
                      <span
                        className="ml-auto text-sm text-indigo-300 font-semibold 
                        px-2 py-1 rounded"
                      >
                        Will active on : {assessment.start_time.slice(0, 10)}
                      </span>
                    )}
                  </div>
                );
              })}
              
            </div>
          </div>
        </div>
      </div>

      {showAssessment && (
        <div className="z-10">
          <AttendAssessmentModal
            assessmentData={selectedAssessment}
            handleClose={() => setShowAssessment(false)}
            handleFetchAgain={() => setFetchFromBackend(true)}
          />
        </div>
      )}

      {showAttemptedAssessment && (
        <div className="z-10">
          <ShowAssessmentModal
            assessmentData={attemptedAssessment}
            handleClose={() => setShowAttemptedAssessment(false)}
          />
        </div>
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
