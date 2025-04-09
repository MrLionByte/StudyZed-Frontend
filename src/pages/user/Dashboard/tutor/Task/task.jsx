import { useEffect, useState } from 'react';
import { SquarePen, XIcon, SquareCheck } from 'lucide-react';
import TaskCalendar from './components/TaskCalendar';
import TaskForm from './components/TaskForm';
import api, { API_BASE_URLS } from '../../../../../api/axios_api_call';
import { TutorEndPoints } from '../../../../../api/endpoints/userEndPoints';
import { getSessionData } from '../../components/currentSession';
import { getStudentByCode } from '../../components/studentsInSession';
import TaskSubmittedModal from './components/showTasks.jsx';
import { Textarea } from '@/components/ui/textarea';
import LogoSvg from '../../../../../assets/test.svg';
import { toast, ToastContainer } from 'react-toastify';

export default function TutorTask() {
  const [tasks, setTasks] = useState([]);

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const [beforeEditTask, setBeforeEditTask] = useState(false);
  const [fetchFromBackend, setFetchFromBackend] = useState(true);
  const [submittedStudents, setSubmittedStudents] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedSubmittedTask, setSelectedSubmittedTask] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);

  const studentDetails = getStudentByCode();

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  let selectedDateToCompare = new Date(selectedTask?.date);

  const handleCreateTask = (date) => {
    setSelectedDate(date);
    setSelectedTask(null);
  };

  const handleTaskSubmit = async (taskData) => {
    const session_data = getSessionData();

    const newTask = {
      ...taskData,
      session: session_data?.sessions,
    };

    try {
      const url = API_BASE_URLS['Session_Service'];

      const response = await api.post(TutorEndPoints.CreateNewTask, newTask, {
        baseURL: url,
      });
      toast.success("Successfully created new task")
      setTasks([...tasks, response.data]);
    } catch (error) {
      toast.error("Error occurred while submitting, please try again after a refresh")
    }

    setSelectedDate(null);
  };

  const handleTaskClick = (task, x, y) => {
    setSelectedTask(task);
    setSubmittedStudents(task.attended);
    setSelectedDate(null);
  };

  const GetAllTasks = async () => {
    setLoading(true);
    const session_data = getSessionData();
    try {
      const url = API_BASE_URLS['Session_Service'];
      const response = await api.get(TutorEndPoints.GetAllTasks, {
        baseURL: url,
        params: {
          session_code: session_data.sessions.session_code,
        },
      });
      setTasks(response.data);
    } catch (error) {
      toast.error("Failed to fetch data,Something happened, refresh the page")
    } finally{
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fetchFromBackend) {
      GetAllTasks();
      setFetchFromBackend(false);
    }
  }, [fetchFromBackend]);

  const handleSubmittedUsers = (e, student) => {
    e.preventDefault();
    setSelectedSubmittedTask(student);
    setIsSubmitted(true);
  };

  const handleEditTaskButton = () => {
    setIsEdit(!isEdit);
    setBeforeEditTask(selectedTask);
  };

  const handleTitleChange = (value) => {
    setSelectedTask({
      ...selectedTask,
      title: value,
    });
  };

  const handleEditDescription = (value) => {
    setSelectedTask({
      ...selectedTask,
      description: value,
    });
  };

  const handleEditTimeChange = (value) => {
    const datePortion = selectedTask.date.slice(0, 10);
    const defaultTime = `${datePortion}T${'12:00'}`;
    const updatedDateTime = `${datePortion}T${value}`;

    if (updatedDateTime < defaultTime) {
      setSelectedTask({
        ...selectedTask,
        date: defaultTime,
      });
    } else {
      setSelectedTask({
        ...selectedTask,
        date: updatedDateTime,
      });
    }
  };

  const submitEditTask = async (e, taskId) => {
    e.preventDefault();
    if (beforeEditTask == selectedTask) {
      return;
    }
    try {
      const url = API_BASE_URLS['Session_Service'];
      const response = await api.patch(
        `${TutorEndPoints.EditTask}${taskId}/`,
        selectedTask,
        {
          baseURL: url,
        },
      );
      setBeforeEditTask(selectedTask);
      setIsEdit(false);
      toast.success("Edited successfully")
    } catch (error) {
      toast.error("Failed to submit, try again after refresh")
    }
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
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 p-4 h-full">
      <main className="w-full md:w-1/2 space-y-4">
        <section className="border border-emerald-800/50 rounded-lg p-3 h-auto md:h-2/5">
          <h2 className="text-xl font-bold text-center text-emerald-400">
            {isEdit && 'EDIT'} TASK
          </h2>
          {selectedTask ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold flex items-center">
                  <span className="text-emerald-400">Title: </span>
                  {isEdit ? (
                    <input
                      type="text"
                      className="bg-slate-800 text-white rounded-md ml-2 pl-2 w-full md:w-auto"
                      onChange={(e) => handleTitleChange(e.target.value)}
                      value={selectedTask.title}
                    />
                  ) : (
                    <p className="ml-2">{selectedTask.title}</p>
                  )}
                </h3>
              </div>

              <div className="pl-1">
                <p className="text-emerald-400 mb-1">Description:</p>
                {isEdit ? (
                  <Textarea
                    className="bg-slate-600 text-white w-full"
                    onChange={(e) => handleEditDescription(e.target.value)}
                    value={selectedTask.description}
                  />
                ) : (
                  <Textarea
                    className="bg-transparent text-white w-full"
                    value={selectedTask.description}
                    disabled
                  />
                )}
              </div>

              <div className="flex flex-col md:flex-row justify-between">
                <div className="text-sm text-emerald-400 flex items-center">
                  <span>Due:</span>
                  <p className="text-slate-500 ml-2">
                    {selectedTask.date.slice(0, 10)}
                  </p>
                  <span className="ml-4">Time:</span>
                  {isEdit ? (
                    <input
                      type="time"
                      id="dueTime"
                      value={selectedTask.date.slice(11, 16)}
                      onChange={(e) => handleEditTimeChange(e.target.value)}
                      className="ml-2 pl-2 rounded bg-emerald-900/30 border border-emerald-800 
                  text-white placeholder-emerald-700 focus:border-emerald-600 
                  focus:ring focus:ring-emerald-600/50"
                    />
                  ) : (
                    <p className="text-slate-500 ml-2">
                      {selectedTask.date.slice(11, 16)}
                    </p>
                  )}
                </div>
                <div className="flex-1 text-end space-x-5">
                  {isEdit && (
                    <button
                      onClick={(e) => submitEditTask(e, selectedTask.id)}
                      className="rounded bg-emerald-500 hover:bg-emerald-700 transition-colors"
                    >
                      <SquareCheck className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    disabled={selectedDateToCompare <= tomorrow}
                    onClick={(e) => handleEditTaskButton(e, selectedTask.id)}
                    className="rounded bg-emerald-500 hover:bg-emerald-700 transition-colors"
                  >
                    {isEdit ? (
                      <XIcon className="w-5 h-5 p-1 bg-red-400 rounded hover:bg-red-800" />
                    ) : (
                      <SquarePen className="w-5 h-5 p-1" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="min-h-[200px] flex items-center justify-center text-emerald-600">
              Select a task to view details
            </div>
          )}
        </section>

        <section className="border border-emerald-800/50 rounded-lg h-auto md:h-3/6 p-3 overflow-y-auto">
          <h2 className="text-xl font-bold text-center text-emerald-400 mb-4">
            SUBMITTED STUDENTS
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {submittedStudents?.map((student) => (
              <div
                key={student.id}
                role="button"
                onClick={(e) => handleSubmittedUsers(e, student)}
                className="flex items-center rounded-md p-3 transition-all hover:bg-slate-600 focus:bg-slate-100 active:bg-slate-100"
              >
                <img
                  alt={student.student_code}
                  src={
                    getStudentProfile(student.student_code) ||
                    'https://via.placeholder.com/150'
                  }
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div className="p-2 bg-white/10 rounded-lg w-full">
                  <h6 className="text-slate-100 font-medium text-center md:text-left">
                    {getStudentNameByCode(student.student_code)}
                  </h6>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <aside className="w-full md:w-1/2 space-y-4">
        <div className="border border-emerald-800/50 rounded-lg p-3 h-auto">
          <h2 className="text-xl font-bold mb-4 text-center text-emerald-400">
            {selectedDate ? 'CREATE TASK' : 'TASK CREATION'}
          </h2>
          {selectedDate ? (
            <TaskForm
              selectedDate={selectedDate}
              onSubmit={handleTaskSubmit}
              onCancel={() => setSelectedDate(null)}
            />
          ) : (
            <div className="min-h-[150px] flex items-center justify-center text-emerald-600">
              Click on a future date to create a task
            </div>
          )}
        </div>

        <div className="border border-emerald-800/50 rounded-lg p-4 mt-3 ">
          {!selectedDate && (
            <>
              <h3 className="text-lg font-bold mb-4 text-center text-emerald-400">
                SCHEDULED TASKS
              </h3>
              <TaskCalendar
                tasks={tasks}
                onCreateTask={handleCreateTask}
                onTaskClick={handleTaskClick}
              />
            </>
          )}
        </div>
      </aside>
      {isSubmitted && (
        <TaskSubmittedModal
          taskData={selectedSubmittedTask}
          handleClose={() => setIsSubmitted(false)}
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
      <ToastContainer
        position="bottom-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        className="toast-center"
      />
    </div>
  );
}
