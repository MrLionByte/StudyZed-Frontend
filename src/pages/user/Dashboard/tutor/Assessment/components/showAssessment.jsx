import { useState, useEffect } from 'react';
import { Plus, X, Save, Trash, PlusCircle } from 'lucide-react';

const AssessmentModal = ({ assessmentData, handleClose, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    assessment_title: '',
    assessment_description: '',
    start_time: '',
    end_time: '',
    questions: [],
  });

  useEffect(() => {
    if (assessmentData) {
      setFormData({
        ...assessmentData,
        start_time: formatDateForInput(assessmentData.start_time),
        end_time: formatDateForInput(assessmentData.end_time),
      });
    }
  }, [assessmentData]);

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  };

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString();
  };

  const isFuture = (dateString) => {
    if (!dateString) return false;
    const givenDate = new Date(dateString);
    const today = new Date();
    return givenDate.getTime() > today.getTime();
  };

  const canEdit = isFuture(assessmentData?.start_time);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [field]: value,
    };
    setFormData((prev) => ({
      ...prev,
      questions: updatedQuestions,
    }));
  };

  const handleOptionChange = (questionIndex, optionIndex, field, value) => {
    const updatedQuestions = [...formData.questions];
    const updatedOptions = [...updatedQuestions[questionIndex].options];

    if (field === 'is_correct') {
      value = value === 'true';
    }

    updatedOptions[optionIndex] = {
      ...updatedOptions[optionIndex],
      [field]: value,
    };

    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      options: updatedOptions,
    };

    setFormData((prev) => ({
      ...prev,
      questions: updatedQuestions,
    }));
  };

  const addOption = (questionIndex) => {
    const updatedQuestions = [...formData.questions];
    const currentOptions = updatedQuestions[questionIndex].options || [];
    const newOptionNo =
      currentOptions.length > 0
        ? Math.max(...currentOptions.map((o) => o.option_no)) + 1
        : 1;

    updatedQuestions[questionIndex].options = [
      ...currentOptions,
      { option_no: newOptionNo, option: '', is_correct: false },
    ];

    setFormData((prev) => ({
      ...prev,
      questions: updatedQuestions,
    }));
  };

  const addQuestion = () => {
    const newQuestion = {
      id: `temp_${Date.now()}`,
      question: '',
      question_type: 'MCQ',
      max_score: 1,
      options: [
        { option_no: 1, option: '', is_correct: false },
        { option_no: 2, option: '', is_correct: false },
      ],
    };

    setFormData((prev) => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
    }));
  };

  const removeQuestion = (index) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions.splice(index, 1);
    setFormData((prev) => ({
      ...prev,
      questions: updatedQuestions,
    }));
  };

  const removeOption = (questionIndex, optionIndex) => {
    const updatedQuestions = [...formData.questions];
    const updatedOptions = [...updatedQuestions[questionIndex].options];
    updatedOptions.splice(optionIndex, 1);

    updatedOptions.forEach((opt, idx) => {
      opt.option_no = idx + 1;
    });

    updatedQuestions[questionIndex].options = updatedOptions;
    setFormData((prev) => ({
      ...prev,
      questions: updatedQuestions,
    }));
  };

  const handleSubmit = () => {
    const submissionData = {
      ...formData,
      start_time: new Date(formData.start_time).toISOString(),
      end_time: new Date(formData.end_time).toISOString(),
    };

    onSave(submissionData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (assessmentData) {
      setFormData({
        ...assessmentData,
        start_time: formatDateForInput(assessmentData.start_time),
        end_time: formatDateForInput(assessmentData.end_time),
      });
    }
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-20">
      <div className="bg-gray-900/95 border border-teal-800/30 rounded-lg w-full max-w-3xl max-h-[80vh] overflow-y-auto m-4">
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-teal-400">
              {assessmentData
                ? isEditing
                  ? 'Edit Assessment'
                  : 'Assessment Details'
                : 'Create Assessment'}
            </h2>

            <div className="flex gap-2">
              {!isEditing && canEdit && (
                <button
                  onClick={handleEditClick}
                  className="px-3 py-2 bg-gray-700 rounded-md hover:bg-emerald-600 text-white transition-colors"
                >
                  EDIT
                </button>
              )}

              {isEditing && (
                <>
                  <button
                    onClick={handleCancel}
                    className="px-3 py-2 bg-gray-700 rounded-md hover:bg-red-600 text-white transition-colors"
                  >
                    CANCEL
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="px-3 py-2 bg-emerald-700 rounded-md hover:bg-emerald-600 text-white transition-colors flex items-center gap-1"
                  >
                    <Save className="w-4 h-4" /> SAVE
                  </button>
                </>
              )}

              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {assessmentData && !isEditing ? (
            <>
              <h3 className="text-lg text-white font-bold">
                {assessmentData.assessment_title}
              </h3>
              <p className="text-gray-400">
                {assessmentData.assessment_description}
              </p>
              <p className="text-gray-400">
                Start: {formatDateForDisplay(assessmentData.start_time)}
              </p>
              <p className="text-gray-400">
                End: {formatDateForDisplay(assessmentData.end_time)}
              </p>

              <div className="space-y-4 mb-4">
                {assessmentData.questions?.map((q, index) => (
                  <div key={q.id} className="bg-black/20 p-3 rounded-lg">
                    <p className="text-white font-bold">
                      {index + 1} - {q.question}
                    </p>
                    <p className="text-gray-400">Type: {q.question_type}</p>
                    <p className="text-gray-400">Max Score: {q.max_score}</p>

                    {q.question_type !== 'OPEN' && (
                      <div className="space-y-2 mt-2">
                        <p className="text-gray-400 font-semibold">Options:</p>
                        {q.options?.map((option) => (
                          <div
                            key={option.option_no}
                            className="bg-black/30 p-2 rounded-lg"
                          >
                            <p className="text-white">
                              Option {option.option_no}: {option.option}
                            </p>
                            <p
                              className={`${option.is_correct ? 'text-teal-400' : 'text-gray-400'}`}
                            >
                              {option.is_correct ? 'Correct' : 'Incorrect'}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <form className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-1">Title</label>
                  <input
                    type="text"
                    name="assessment_title"
                    value={formData.assessment_title}
                    onChange={handleChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    name="assessment_description"
                    value={formData.assessment_description}
                    onChange={handleChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 text-white resize-y min-h-[80px]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-1">
                      Start Time
                    </label>
                    <input
                      type="datetime-local"
                      name="start_time"
                      value={formData.start_time}
                      onChange={handleChange}
                      className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-1">End Time</label>
                    <input
                      type="datetime-local"
                      name="end_time"
                      value={formData.end_time}
                      onChange={handleChange}
                      className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 text-white"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg text-white font-bold">Questions</h3>
                  <button
                    type="button"
                    onClick={addQuestion}
                    className="bg-emerald-700 hover:bg-emerald-600 text-white p-2 rounded-md flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> Add Question
                  </button>
                </div>

                <div className="space-y-6">
                  {formData.questions.map((question, qIndex) => (
                    <div
                      key={question.id || qIndex}
                      className="bg-black/20 p-4 rounded-lg relative"
                    >
                      <button
                        type="button"
                        onClick={() => removeQuestion(qIndex)}
                        className="absolute top-2 right-2 text-red-400 hover:text-red-500"
                      >
                        <Trash className="w-5 h-5" />
                      </button>

                      <div className="space-y-4 mt-2">
                        <div>
                          <label className="block text-gray-300 mb-1">
                            Question {qIndex + 1}
                          </label>
                          <input
                            type="text"
                            value={question.question}
                            onChange={(e) =>
                              handleQuestionChange(
                                qIndex,
                                'question',
                                e.target.value,
                              )
                            }
                            className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 text-white"
                            required
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-gray-300 mb-1">
                              Question Type
                            </label>
                            <select
                              value={question.question_type}
                              onChange={(e) =>
                                handleQuestionChange(
                                  qIndex,
                                  'question_type',
                                  e.target.value,
                                )
                              }
                              className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 text-white"
                            >
                              <option value="MCQ">Multiple Choice</option>
                              <option value="OPEN">Open Answer</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-gray-300 mb-1">
                              Max Score
                            </label>
                            <input
                              type="number"
                              value={question.max_score}
                              onChange={(e) =>
                                handleQuestionChange(
                                  qIndex,
                                  'max_score',
                                  parseInt(e.target.value),
                                )
                              }
                              className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 text-white"
                              min="1"
                              required
                            />
                          </div>
                        </div>

                        {question.question_type !== 'OPEN' && (
                          <div className="mt-4">
                            <div className="flex justify-between items-center mb-2">
                              <label className="text-gray-300 font-semibold">
                                Options
                              </label>
                              <button
                                type="button"
                                onClick={() => addOption(qIndex)}
                                className="text-emerald-500 hover:text-emerald-400 flex items-center gap-1 text-sm"
                              >
                                <PlusCircle className="w-4 h-4" /> Add Option
                              </button>
                            </div>

                            {question.options?.map((option, optIndex) => (
                              <div
                                key={option.option_no}
                                className="bg-black/30 p-3 rounded-lg mb-2 relative"
                              >
                                <button
                                  type="button"
                                  onClick={() => removeOption(qIndex, optIndex)}
                                  className="absolute top-2 right-2 text-red-400 hover:text-red-500"
                                  disabled={question.options.length <= 2}
                                >
                                  <Trash className="w-4 h-4" />
                                </button>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-2 items-center">
                                  <div className="md:col-span-3">
                                    <label className="text-xs text-gray-400 mb-1 block">
                                      Option {option.option_no}
                                    </label>
                                    <input
                                      type="text"
                                      value={option.option}
                                      onChange={(e) =>
                                        handleOptionChange(
                                          qIndex,
                                          optIndex,
                                          'option',
                                          e.target.value,
                                        )
                                      }
                                      className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 text-white"
                                      required
                                    />
                                  </div>

                                  <div>
                                    <label className="text-xs text-gray-400 mb-1 block">
                                      Correct?
                                    </label>
                                    <select
                                      value={option.is_correct.toString()}
                                      onChange={(e) =>
                                        handleOptionChange(
                                          qIndex,
                                          optIndex,
                                          'is_correct',
                                          e.target.value,
                                        )
                                      }
                                      className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 text-white"
                                    >
                                      <option value="true">Yes</option>
                                      <option value="false">No</option>
                                    </select>
                                  </div>
                                </div>
                              </div>
                            ))}

                            {question.options?.length < 2 && (
                              <p className="text-red-400 text-sm">
                                At least 2 options are required.
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {formData.questions.length === 0 && (
                    <div className="text-center py-6 bg-black/20 rounded-lg">
                      <p className="text-gray-400">
                        No questions yet. Click "Add Question" to begin.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssessmentModal;
