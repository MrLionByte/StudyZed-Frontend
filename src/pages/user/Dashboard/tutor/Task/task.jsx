import { useEffect, useState } from 'react';
import { BookOpen, MessageSquare, Wallet, User, School, LayoutDashboard } from 'lucide-react';
import TaskCalendar from './components/TaskCalendar';
import TaskForm from './components/TaskForm';
import api, { api_dictatory } from '../../../../../api/axios_api_call';
import { TutorEndPoints } from '../../../../../api/endpoints/userEndPoints';
import { getSessionData } from "../../components/currentSession";
import { getStudentByCode } from "../../components/studentsInSession";
import TaskSubmittedModal from './components/showTasks.jsx';

export default function TutorTask() {
  const [tasks, setTasks] = useState([]);
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTask, setSelectedTask] = useState(null);
  const [createTask, setCreateTask] = useState(false);
  const [fetchFromBackend, setFetchFromBackend] = useState(true);
  const [submittedStudents, setSubmittedStudents] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedSubmittedTask, setSelectedSubmittedTask] = useState('') 

  const studentDetails = getStudentByCode()


  const handleCreateTask = (date) => {
    setSelectedDate(date);
    setSelectedTask(null);
  };

  const handleTaskSubmit = async (taskData) => {
    const session_data = getSessionData()
    
    const newTask = {
      ...taskData,
      session: session_data?.sessions
    };

    try{
      const url = api_dictatory["Session_Service"]
      
        const response = await api.post(TutorEndPoints.CreateNewTask, newTask,{
          baseURL: url,
        })
        console.log(response);
        setTasks([...tasks, response.data]);
    } catch (error){
      console.log(error);
    }
    
    
    setSelectedDate(null);
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setSubmittedStudents(task.attended)
    console.log(task);
    
    setSelectedDate(null);
  };

  const toggleTaskCompletion = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, completed: !task.completed }
        : task
    ));
  };

  const GetAllTasks = async () => {
    const session_data = getSessionData()
    try {

      const url = api_dictatory["Session_Service"]
      const response = await api.get(TutorEndPoints.GetAllTasks, {
        baseURL: url,
        params : {session_code :session_data.sessions.session_code},
      })
      console.log(response);
      setTasks(response.data)
    } catch (error) {
      console.log(error);
    }
  }

  useEffect (()=>{
    if(fetchFromBackend){
      GetAllTasks();
      setFetchFromBackend(false)
      
      
    }
  }, [])

  const handleSubmittedUsers =  (e, student) => {
    e.preventDefault();
    setSelectedSubmittedTask(student)
    console.log(student);
    setIsSubmitted(true);
  }

  function getStudentNameByCode(studentCode) {
    const matchedStudent =   studentDetails.find(student => student.user_code === studentCode);
    return matchedStudent ? matchedStudent.username : "Student not found";
  }

  function getStudentProfile(studentCode) {
    const matchedStudent =   studentDetails.find(student => student.user_code === studentCode);
    return matchedStudent ? matchedStudent.profile?.profile_picture?.slice(13) : '';
  }


  return (

      <div className="max-w-7xl mx-auto flex gap-6 p-4 h-full">

      
        <main className="w-1/2 space-y-5">
          
          <section className="border border-emerald-800/50 rounded-lg p-4 h-1/3">
            <h2 className="text-xl font-bold mb-4 text-center text-emerald-400">CREATED TASK</h2>
            {selectedTask ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">{selectedTask.title}</h3>
                  {/* <button
                    onClick={() => toggleTaskCompletion(selectedTask.id)}
                    className={`px-4 py-2 rounded ${
                      selectedTask.completed
                        ? 'bg-emerald-600 hover:bg-emerald-700'
                        : 'bg-emerald-800 hover:bg-emerald-900'
                    } transition-colors`}
                  >
                    {selectedTask.completed ? 'Completed' : 'Mark Complete'}
                  </button> */}
                </div>
                <p className="text-emerald-300">{selectedTask.description}</p>
                <div className="text-sm text-emerald-400 flex">
                  Due: <p className='text-slate-500 ml-2 mr-2'> {selectedTask.date.slice(0,10)} </p> Time: <p className='text-slate-500 ml-2 mr-2'> {selectedTask.date.slice(11,16)} </p>
                  {selectedTask.dueTime && ` at ${selectedTask.dueTime}`}
                </div>
              </div>
            ) : (
              <div className="min-h-[200px] flex items-center justify-center text-emerald-600">
                Select a task to view details
              </div>
            )}
          </section>

          <section className="border border-emerald-800/50 rounded-lg h-1/2">
          <h2 className="text-xl sm:p-2 md:p-5 font-bold mb-4 text-center text-emerald-400">
            SUBMITTED STUDENTS</h2>
            <div className='grid grid-cols-2'> 
            {submittedStudents &&
            (submittedStudents.map((student, index)=> 
            <div key={student.id}
                role="button" onClick={(e)=> handleSubmittedUsers (e,student)}
                className="text-slate-800 flex items-center rounded-md p-3 transition-all hover:bg-slate-600 focus:bg-slate-100 active:bg-slate-100"
              > 
              <div className="mr-4 grid place-items-center">
                <img
                  alt="candice"
                  src={getStudentProfile(student.student_code) || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZ1iAWsH72RCWQeckHI1LVBeV5UpKzwPisN3pXH48_BsLZjU0JvQNownk2-RRiA2BJWyw&usqp=CAU"}
                  className="relative inline-block h-12 w-12 !rounded-full  object-cover object-center"
                />
              </div>

              <div className='p-2 opacity-75 rounded-lg border-white border-2'>
                <h6 className="text-slate-100 font-medium">
                
                {getStudentNameByCode(student.student_code)}
                </h6>
              </div>
              
            </div>
            ))
            }
            </div>
          </section>

          
        </main>

       
        <aside className="w-1/2">
       
        
            <div className="border border-emerald-800/50 rounded-lg p-3">
            
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

          <div className="border border-emerald-800/50 rounded-lg p-4 ">
          {!selectedDate &&
          <>
              <h3 className="text-lg font-bold mb-4 text-center text-emerald-400">SCHEDULED TASKS</h3>
              <TaskCalendar 
                tasks={tasks} 
                onCreateTask={handleCreateTask}
                onTaskClick={handleTaskClick}
              />
            </>
          }
            </div>

        </aside>
        {isSubmitted && 
          <TaskSubmittedModal 
          taskData={selectedSubmittedTask}
          handleClose={()=>setIsSubmitted(false)} />
        }
      </div>

  );
};