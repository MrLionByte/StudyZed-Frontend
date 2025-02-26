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
import { isToday } from 'date-fns';

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
    console.log(newTask);
    console.log(taskData);

    try {
      const url = API_BASE_URLS['Session_Service'];

      const response = await api.post(TutorEndPoints.CreateNewTask, newTask, {
        baseURL: url,
      });
      console.log(response);
      setTasks([...tasks, response.data]);
    } catch (error) {
      console.log(error);
    }

    setSelectedDate(null);
  };

  const handleTaskClick = (task, x, y) => {
    setSelectedTask(task);
    setSubmittedStudents(task.attended);
    console.log('task', task);
    console.log('task x :', x);
    console.log('task y :', y);

    setSelectedDate(null);
  };

  const toggleTaskCompletion = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  const GetAllTasks = async () => {
    const session_data = getSessionData();
    try {
      const url = API_BASE_URLS['Session_Service'];
      const response = await api.get(TutorEndPoints.GetAllTasks, {
        baseURL: url,
        params: {
          session_code: session_data.sessions.session_code,
          // month: '',
        },
      });
      console.log(response);
      setTasks(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (fetchFromBackend) {
      GetAllTasks();
      setFetchFromBackend(false);
    }
  }, []);

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

    console.log(selectedTask);
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
      console.log('TASk EDIT :', response);
      setBeforeEditTask(selectedTask);
      setIsEdit(false)
    } catch (error) {
      console.log(error);
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
    <div className="max-w-7xl mx-auto flex gap-4 p-4 h-full">
      <main className="w-1/2 space-y-4">
        <section className="border border-emerald-800/50 rounded-lg p-3 h-2/5">
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
                      className="bg-slate-800 text-white rounded-md ml-2 pl-2"
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
                {
                  isEdit ? (
                    <Textarea
                      className="bg-slate-600 text-white"
                      onChange={(e) => handleEditDescription(e.target.value)}
                      value={selectedTask.description}
                    />
                  ) : (
                    // <textarea
                    //   type="textarea"
                    //   className="bg-slate-600 w-[540px] p-1 text-white rounded-md
                    //   ml-2 max-h-28 pl-2"
                    //   value={selectedTask.description}
                    // />
                    <Textarea
                      className="bg-transparent text-white"
                      value={selectedTask.description}
                      disabled
                    />
                  )
                  // <p className="text-slate-300 overflow-y-auto p-1 w-[550px]
                  // max-h-20 border border-emerald-300 rounded-md break-words">
                  //   {selectedTask.description}
                  // </p>
                }
              </div>

              <div className="flex ">
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

                <div className="flex-1  text-end space-x-5">
                  {isEdit && (
                    <button
                      onClick={(e) => submitEditTask(e, selectedTask.id)}
                      className=" rounded bg-emerald-500 hover:bg-emerald-700 transition-colors"
                    >
                      <SquareCheck className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    disabled={selectedDateToCompare <= tomorrow}
                    onClick={(e) => handleEditTaskButton(e, selectedTask.id)}
                    className=" rounded bg-emerald-500 hover:bg-emerald-700 transition-colors"
                  >
                    {isEdit ? (
                      <XIcon className="w-5 h-5 p-1  bg-red-400 rounded hover:bg-red-800" />
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

        <section className="border border-emerald-800/50 rounded-lg h-3/5 p-3">
          <h2 className="text-xl font-bold text-center text-emerald-400 mb-4">
            SUBMITTED STUDENTS
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {submittedStudents &&
              submittedStudents.map((student) => (
                <div
                  key={student.id}
                  role="button"
                  onClick={(e) => handleSubmittedUsers(e, student)}
                  className="flex items-center rounded-md p-3 transition-all hover:bg-slate-600 focus:bg-slate-100 active:bg-slate-100"
                >
                  <div className="mr-4">
                    <img
                      alt={student.student_code}
                      src={
                        getStudentProfile(student.student_code) ||
                        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZ1iAWsH72RCWQeckHI1LVBeV5UpKzwPisN3pXH48_BsLZjU0JvQNownk2-RRiA2BJWyw&usqp=CAU'
                      }
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  </div>

                  <div className="p-2 bg-white/10 rounded-lg">
                    <h6 className="text-slate-100 font-medium">
                      {getStudentNameByCode(student.student_code)}
                    </h6>
                  </div>
                </div>
              ))}
          </div>
        </section>
      </main>

      <aside className="w-1/2">
        <div className="border border-emerald-800/50 rounded-lg p-3 h-5/5">
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

        <div className="border border-emerald-800/50 rounded-lg p-4 mt-3">
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
    </div>
  );
}
