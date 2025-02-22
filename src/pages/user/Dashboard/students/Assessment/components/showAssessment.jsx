import { X } from 'lucide-react';

const AssessmentModal = ({ assessmentData, handleClose }) => {
  console.log("XXX :", assessmentData);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-20">
      <div className="bg-gray-900/95 border border-teal-800/30 rounded-lg w-full max-w-3xl max-h-[80vh] overflow-y-auto m-4">
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-teal-400">
              {assessmentData ? 'Assessment Details' : 'Create Assessment'}
            </h2>
            <button onClick={handleClose} className="text-gray-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>

          {assessmentData ? (
            <>
              <h3 className="text-lg text-white font-bold">
                {assessmentData.Assessment.assessment_title}
              </h3>
              <p className="text-gray-400">{assessmentData.Assessment.assessment_description}</p>
              <p className="text-gray-400">
                Date: {new Date(assessmentData.Attempted.started_on).toLocaleString()}
              </p>
              <p className="text-gray-400">
                SCORE TOTAL: {assessmentData.Attempted.score || "To Check"}
              </p>

              <div className="space-y-4 mb-4">
                {assessmentData.Assessment.questions?.map((q, index) => {
                  const userResponse = assessmentData.Attempted.responses.find(
                    (r) => r.question === q.id
                  );
                  const selectedOptionId = userResponse?.selected_option;
                  const selectedOption = q.options?.find((o) => o.id === selectedOptionId);
                  const correctOption = q.options?.find((o) => o.is_correct);

                  return (
                    <div key={q.id} className="bg-black/20 p-3 rounded-lg">
                      <p className="text-white font-bold">
                        {index + 1} - {q.question}
                      </p>
                      <p className="text-gray-400">Type: {q.question_type}</p>
                      <p className="text-gray-400">Max Score: {q.max_score}</p>

                      {q.question_type === 'OPEN' ? (
                        <div className="mt-2">
                          <p className="text-gray-400 font-semibold">Your Answer:</p>
                          <p className="text-white">{userResponse?.open_response || "No Answer"}</p>
                          <p className="text-gray-400">Mark Obtained: {userResponse?.mark ?? "Not Graded"}</p>
                        </div>
                      ) : (
                        <div className="space-y-2 mt-2">

                          <div className="mt-2 ">
                            <div className='flex gap-3'>
                            <p className="text-gray-400 font-semibold">Your Answer:</p>
                            <p className={` ${selectedOption?.is_correct ? 'text-green-400' : 'text-red-400'}`}>
                              {selectedOption ? selectedOption.option : "No Answer"}
                            </p>
                           
                            </div>
                            {!selectedOption?.is_correct && correctOption && (
                              <p className="text-teal-400 font-semibold">
                                Correct Answer: {correctOption.option}
                              </p>
                            )}
                            <p className="text-gray-400">Mark Obtained: {userResponse?.mark ?? "Not Graded"}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <p className="text-gray-400">No Assessment Data Available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssessmentModal;
