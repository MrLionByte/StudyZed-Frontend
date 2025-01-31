import { useEffect, useState } from "react"
import { Bounce, toast, ToastContainer } from "react-toastify"
import {TutorEndPoints} from "../../../../../api/endpoints/userEndPoints";
import api,{api_dictatory} from "../../../../../api/axios_api_call.js";
import CreateAssessment from "./components/createAssessment";
import AssessmentModal from "./components/showAssessment.jsx";
import { Plus, X } from "lucide-react";
import {useAssessments} from "./_lib.js";


export default function Assessment({session_data}) {
  const { assessments, loading, isCreatingAssessment, 
    setIsCreatingAssessment } = useAssessments();

    const [showModal, setShowModal] = useState(false)
    const [selectedAssessment, setSelectedAssessment] = useState('')
    const closeModal = () => {
      setIsCreatingAssessment(false);
    };

    const handleAssessmentView = (assessment) => {
      setSelectedAssessment(assessment)
      setShowModal(true);
    }
    

    return (
      <>
      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        

        <div className="flex-1 space-y-8 ">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-black/20 backdrop-blur-sm border border-teal-800/30 rounded-lg p-6">
              <h3 className="text-teal-400 font-bold mb-2">SCHEDULED ASSESSMENT</h3>
            </div>
            <div className="bg-black/20 backdrop-blur-sm border border-teal-800/30 rounded-lg p-6">
              <h3 className="text-teal-400 font-bold mb-2">ONGOING ASSESSMENT</h3>
            </div>
            <div className="bg-black/20 backdrop-blur-sm border border-teal-800/30 rounded-lg p-6">
              <h3 className="text-teal-400 font-bold mb-2">COMPLETED ASSESSMENT</h3>
            </div>
          </div>

          {/* Assessment List */}
          <div className="bg-black/20 backdrop-blur-sm border border-teal-800/30 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-teal-400">REVIEW ASSESSMENT</h2>
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
                <div key={assessment.id} 
                  onClick={() => handleAssessmentView(assessment)}
                  className="flex items-center space-x-4 p-3 bg-gray-800/50 rounded-lg">
                  <span className="text-gray-400">{index + 1}</span>
                  <span className="text-white">{assessment.assessment_title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Create Assessment Modal */}
      {isCreatingAssessment && (
        < CreateAssessment handleClose={closeModal} session_data={session_data} />
      )}

      {showModal && (
        <AssessmentModal
          assessmentData={selectedAssessment}
          handleClose={() => setShowModal(false)}
        />
      )}
     </>
    );
  };
  