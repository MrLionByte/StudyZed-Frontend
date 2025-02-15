
import { X } from "lucide-react";
import { useState } from "react";
import DateTimePicker from 'react-datetime-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import { getSessionData } from "../../../components/currentSession";
import api, { api_dictatory } from "../../../../../../api/axios_api_call";
import { TutorEndPoints } from "../../../../../../api/endpoints/userEndPoints";

export default function CreateAssessment({ handleClose, fetchFromBackend }) {
  const [assessment, setAssessment] = useState(false); 
  const [error, setError] = useState("");

  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());

  const handleFetchFromBackend = () => {
    fetchFromBackend();
  }

  const handleCloseButton = () => {
    handleClose();
  };

  const [newQuestion, setNewQuestion] = useState({
    text: "",
    type: "multiple-choice",
    choices: [""],
  });

  const [newAssessment, setNewAssessment] = useState({
    title: "",
    description: "",
    start_time: "",
    end_time: "",
    questions: [],
  });

  const addChoice = () => {
    setNewQuestion((prev) => ({
      ...prev,
      choices: [...(prev.choices || []), ""],
    }));
  };

  const updateChoice = (index, value) => {
    setNewQuestion((prev) => ({
      ...prev,
      choices: prev.choices?.map((choice, i) => (i === index ? value : choice)),
    }));
  };

  const addQuestion = () => {
    if (!newQuestion.text) {
      setError("Question text is required.");
      return;
    }

    if (newQuestion.type === "multiple-choice" && !newQuestion.answer) {
      setError("Answer is required for multiple-choice questions.");
      return;
    }

    setError("");

    setNewAssessment((prev) => ({
      ...prev,
      start_time: startTime,
      end_time: endTime,
      questions: [
        ...(prev.questions || []),
        {
          id: (prev.questions?.length || 0) + 1,
          question: newQuestion.text,
          question_type: newQuestion.type === "multiple-choice" ? "MLC" : "OPEN",
          max_score: newQuestion.maxScore || 5,
          options:
            newQuestion.type === "multiple-choice"
              ? newQuestion.choices.map((choice, index) => ({
                  option_no: index + 1,
                  option: choice,
                  is_correct: newQuestion.answer === choice,
                }))
              : undefined,
        },
      ],
    }));
    console.log("NEXt Q :",newAssessment);
    
    setNewQuestion({
      text: "",
      type: "multiple-choice",
      choices: [""],
    });
  };

  const saveAssessment = async () => {
    if (!newAssessment.title || !newAssessment.start_time || !newAssessment.end_time || !newAssessment.questions?.length) {
      setError("All fields including title, time, and at least one question are required.");
      return;
    }
    const session_data = getSessionData();
    
    const finalAssessment = {
      session_code: session_data?.sessions?.session_code,
      assessment_title: newAssessment.title,
      assessment_description: newAssessment.description || "No description provided",
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      questions: newAssessment.questions.map((q) => ({
        question: q.question,
        max_score: q.max_score,
        question_type: q.question_type,
        options: q.options,
      })),
    };

    console.log("FINAL ASSESSMENT:", finalAssessment);

    try {
      const url = api_dictatory["Session_Service"]
      const response = await api.post(TutorEndPoints.CreateNewAssessment, finalAssessment,
        {
        baseURL:url
      })
      console.log("NEW ASSESSMENT :",response);
      handleFetchFromBackend();
      handleCloseButton();
      
    } catch (e) {
      console.log(e);
      
    }

    
    setNewAssessment({ title: "", description: "", start_time: "", end_time: "", questions: [] });
    setAssessment(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-20">
      <div className="bg-gray-900/95 border border-teal-800/30 rounded-lg w-full h-full overflow-y-auto m-4">
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-teal-400">
              {assessment ? "Add Questions" : "Create Assessment"}
            </h2>
            <button onClick={handleClose} className="text-gray-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>

          {!assessment ? (
            <>
            
              <input
                type="text"
                placeholder="Assessment Title"
                value={newAssessment.title}
                onChange={(e) =>
                  setNewAssessment((prev) => ({ ...prev, title: e.target.value }))
                }
                className="w-full bg-black/20 border border-teal-800/30 rounded-lg p-2 text-white"
              />
              <textarea
                placeholder="Description"
                value={newAssessment.description}
                onChange={(e) =>
                  setNewAssessment((prev) => ({ ...prev, description: e.target.value }))
                }
                className="w-full bg-black/20 border border-teal-800/30 rounded-lg p-2 text-white"
                rows="4"
              />
                <label className="block text-white font-bold mb-2">
                    Select Start Date & Time :</label>
                <DateTimePicker format="y-MM-dd HH:mm"
                    disableClock
                    onChange={setStartTime} value={startTime}
                    className="bg-slate-200 text-black w-full" 
                />

                <label className="block text-white font-bold mb-2">
                Select End Date & Time :</label>
                <DateTimePicker format="y-MM-dd HH:mm"
                    disableClock
                    onChange={setEndTime} value={endTime}
                    className="bg-slate-200 text-black w-full" 
                />
              <button
                onClick={() => setAssessment(true)}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-lg"
              >
                Next: Add Questions
              </button>
            </>
          ) : (
            <>
              <div className="space-y-4 mb-4">
                {newAssessment.questions?.map((q, index) => (
                  <div key={index} className="bg-black/20 p-3 rounded-lg">
                    <p className="text-white font-bold">{q.question}</p>
                    <p className="text-gray-400">Type: {q.question_type}</p>
                    {q.options &&
                      q.options.map((opt, i) => (
                        <p key={i} className="text-gray-400 ml-4">
                          • {opt.option} {opt.is_correct && "(Correct)"}
                        </p>
                      ))}
                  </div>
                ))}
              </div>

              <div className="space-y-4 bg-black/20 p-4 rounded-lg">
                <input
                  type="text"
                  placeholder="Question Text"
                  value={newQuestion.text}
                  onChange={(e) =>
                    setNewQuestion((prev) => ({ ...prev, text: e.target.value }))
                  }
                  className="w-full bg-black/20 border border-teal-800/30 rounded-lg p-2 text-white"
                />
                <select
                  value={newQuestion.type}
                  onChange={(e) =>
                    setNewQuestion((prev) => ({
                      ...prev,
                      type: e.target.value,
                      choices: e.target.value === "multiple-choice" ? [""] : undefined,
                    }))
                  }
                  className="w-full bg-black/20 border border-teal-800/30 rounded-lg p-2 text-white"
                >
                  <option value="multiple-choice">Multiple Choice</option>
                  <option value="paragraph">Paragraph</option>
                </select>
                {newQuestion.type === "multiple-choice" && (
                  <div className="space-y-2">
                    {newQuestion.choices?.map((choice, index) => (
                      <input
                        key={index}
                        type="text"
                        placeholder={`Choice ${index + 1}`}
                        value={choice}
                        onChange={(e) => updateChoice(index, e.target.value)}
                        className="w-full bg-black/20 border border-teal-800/30 rounded-lg p-2 text-white"
                      />
                    ))}
                    <button
                      onClick={addChoice}
                      className="w-full border border-teal-800/30 rounded-lg p-2 text-teal-400 hover:bg-teal-400/10"
                    >
                      Add Choice
                    </button>
                  </div>
                )}
                {newQuestion.type === "multiple-choice" && (
                  <select
                    value={newQuestion.answer}
                    onChange={(e) =>
                      setNewQuestion((prev) => ({ ...prev, answer: e.target.value }))
                    }
                    className="w-full bg-black/20 border border-teal-800/30 rounded-lg p-2 text-white"
                  >
                    <option value="">Select Correct Answer</option>
                    {newQuestion.choices?.map((choice, index) => (
                      <option key={index} value={choice}>
                        {choice}
                      </option>
                    ))}
                  </select>
                )}
                <button
                  onClick={addQuestion}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-lg"
                >
                  Add Question
                </button>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={saveAssessment}
                  className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-lg"
                >
                  Save Assessment
                </button>
                <button
                  onClick={handleCloseButton}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg"
                >
                  Cancel
                </button>
                <p className="text-red-500">{error}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
