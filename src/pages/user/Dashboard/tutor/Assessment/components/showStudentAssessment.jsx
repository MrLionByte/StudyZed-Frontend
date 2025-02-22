import { button } from '@heroui/theme';
import { Plus, X } from 'lucide-react';
import { useState } from 'react';
import api, { API_BASE_URLS } from '../../../../../../api/axios_api_call';
import {TutorEndPoints} from '../../../../../../api/endpoints/userEndPoints';

const StudentAssessmentModal = ({ assessmentData, handleClose }) => {

    const [tempMarks, setTempMarks] = useState({});
    console.log("TEMP MARKS :",tempMarks);
    
    const handleChangeMark = (value, id, question) => {

      let mark = value 
      if (question.max_score < mark){
        mark = question.max_score
      } else if (mark < 0) {
        mark = 0
      }

        setTempMarks((prev) => ({
            ...prev,
            [id]: mark,
        }));
    };

    const handleSubmitFinialMark = async () => {
      try {
        const url = API_BASE_URLS["Session_Service"]
        const response =await api.patch(TutorEndPoints.UpdateAssessmentMark, tempMarks,{
          baseURL: url,
        })
        console.log(response);
        handleClose()
      } catch(error){
        console.log(error);        
      }
    }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex 
        items-center justify-center z-20">
      <div className="bg-gray-900/95 border border-teal-800/30 rounded-lg 
        w-full max-w-screen-xl max-h-[90vh] overflow-y-auto m-4">
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-teal-400">
              {assessmentData ? 'Assessment Details' : 'Create Assessment'}
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
      {assessmentData.map((assessment, index) => (
        <div key={index} className="bg-gray-800 p-4 rounded-lg shadow-lg">
          {/* Assessment Details */}
          <h3 className="text-lg text-white font-bold">
            {assessment.assessment_title}
          </h3>
          <p className="text-gray-400">Score: {assessment.score}</p>
          {/* <p className="text-gray-400">
            Status: {assessment.is_completed ? "Completed" : "Incomplete"}
          </p> */}
          <p className="text-gray-400">
            Late Submission: {assessment.is_late_submission ? "Yes" : "No"}
          </p>
          <p className="text-gray-400">
            Started: {new Date(assessment.started_on).toLocaleString()}
          </p>
          <p className="text-gray-400">
            Completed: {new Date(assessment.completed_on).toLocaleString()}
          </p>

          {/* Questions and Responses */}
          <div className="mt-4 space-y-6">
            {assessment.responses.map((response, responseIndex) => (
              <div
                key={responseIndex}
                className="bg-black/20 p-4 rounded-lg"
              >
                {/* Question Details */}
                <p className="text-white font-bold">
                  {responseIndex + 1}. {response.question.question}
                </p>
                <p className="text-gray-400">
                  Type: {response.question.question_type}
                </p>
                <p className="text-gray-400">
                  Max Score: {response.question.max_score}
                </p>

                {/* MLC Options */}
                {response.question.question_type === "MLC" && (
                  <div className="mt-2 space-y-2">
                    <p className="text-gray-400 font-semibold">Ans :</p>
                    {response.question.options.map((option, optionIndex) => (
                    <>
                      {option.is_correct &&
                      <div
                        key={option.id}
                        className={`bg-black/30 p-2 rounded-lg ${
                          option.is_correct ? "border-l-4 border-teal-400" : ""
                        }`}
                      >
                            <p className="text-white">
                                {option.option_no} - {option.option} 
                            </p>
                      </div>
                        }
                    </>
                    ))}
                    {/* Selected Option */}
                    <p className="mt-2 text-gray-400 font-semibold">
                      Selected Option:{" "}
                      <span
                        className={`${
                          response.selected_option?.is_correct
                            ? "text-teal-400"
                            : "text-red-400"
                        }`}
                      >
                        {response.selected_option
                          ? `Option ${response.selected_option.option_no} - ${response.selected_option.option}`
                          : "None"}
                      </span>
                    </p>
                  </div>
                )}

                {/* Open-Ended Response */}
                {response.question.question_type === "OPEN" && (
                <div className="mt-2 flex justify-between">
                    <div>
                    <p className="text-gray-400 font-semibold">Response:</p>
                    <p className="text-white">{response.open_response || "No response provided"}</p>
                  
                    </div>
                    <div>
                    {response?.mark ?
                    <p>Mark :{response?.mark}</p>
                    :
                    <>
                        <input type="number" 
                            maxLength={3}
                            max={100}
                            value={tempMarks[response.id] || ""}
                            onChange={(e) => handleChangeMark(e.target.value, response.id, response.question)}
                            className='w-16 rounded-full text-black text-center' />
                   
                    </>
                    }
                    </div>
                </div>
                )}

                {/* Correctness */}
                <p
                  className={`mt-2 font-semibold ${
                    response.is_correct
                      ? "text-teal-400"
                      : response.is_correct === false
                      ? "text-red-400"
                      : "text-gray-400"
                  }`}
                >
                  {response.is_correct === null
                    ? "Not graded yet"
                    : response.is_correct
                    ? "Correct"
                    : "Incorrect"}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
    <div className='flex justify-end'>
      <button className='text-center bg-emerald-400 hover:bg-emerald-700 hover:text-emerald-300 p-2 rounded-full
        font-semibold' onClick={handleSubmitFinialMark}>FINALIZE MARK</button>
    </div>
        </div>
      </div>
    </div>
  );
};

export default StudentAssessmentModal;
