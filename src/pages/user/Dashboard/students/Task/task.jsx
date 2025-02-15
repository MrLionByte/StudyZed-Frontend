import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import api, { api_dictatory } from "../../../../../api/axios_api_call";
import { studentEndPoints } from "../../../../../api/endpoints/userEndPoints";
import { getSessionData } from "../../components/currentSession";
import { toast, ToastContainer } from "react-toastify";

const StudentTask = () => {
  const [fetchFromBackend, setFetchFromBackend] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState([])

  const GetTasksForStudent = async () => {
    const session = getSessionData();
    try {
      const url = api_dictatory["Session_Service"];
      const response = await api.get(`${studentEndPoints.GetTasksForStudent}?session_code=${
        session.sessions.session_code}`, 
        {baseURL: url,
      });
      console.log("All tasks:", response.data);
      setTasks(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (fetchFromBackend) {
      GetTasksForStudent();
      setFetchFromBackend(false);
    }
  }, [fetchFromBackend]);

  const isToday = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };
  
  const submitAnswer = async (taskId) => {
    try {
      const url = api_dictatory["Session_Service"];
      const response = await api.post(
        "task-student/task-submit-answer/",
        {
          task_id: taskId,
          answer,
        },
        { baseURL: url }
      );
      console.log("Response:", response.data);
      if (response.status === 200 ){
        setSubmitted([...submitted, response.data.task_id]);
        toast.warning("Already attended task for the day")
      } else if (response.status === 201 ){
        toast.success("Submitted task for the day")
        setSubmitted([...submitted, response.data.task_id]);
      }
      setSubmitted(response.task_id)
    } catch (error) {
      console.error("Error submitting answer:", error);
    }
  };
  
  return (
    <div className="p-5">
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {tasks.map((task, index) => {
          const taskDate = new Date(task.due_date);
          const today = new Date();
          const isTaskToday =
            taskDate.getDate() === today.getDate() &&
            taskDate.getMonth() === today.getMonth() &&
            taskDate.getFullYear() === today.getFullYear();
          const isPast = taskDate < today && !isTaskToday;
          // const isThisDay = taskDate == today
          const isUpcoming = taskDate > today && !isTaskToday;

          return (
            <Card
              key={index}
              className="p-4 shadow-md rounded-lg border flex flex-col justify-between"
            >
              <h3 className="font-bold text-lg text-gray-800">{task.title}</h3>
              <p className="text-gray-600 text-sm">{task.description}</p>
              <p className="text-gray-500 text-xs">Due: {taskDate.toLocaleString()}</p>

              {isTaskToday && (
                <Dialog>
                 
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedTask(task)}
                      className="mt-2"
                    >
                      Open Task
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>{selectedTask?.title}</DialogTitle>
                      <p className="text-sm text-gray-600">
                        Due: {new Date(selectedTask?.due_date).toLocaleString()}
                      </p>
                    </DialogHeader>
                    <p className="text-gray-800">{selectedTask?.description}</p>
                    <Textarea
                      placeholder="Write your answer here..."
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      className="mt-4 text-black"
                    />
                    <DialogFooter>
                      <Button
                        onClick={() => submitAnswer(task.id)}
                      >
                        Submit Answer
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
              {isPast && <p className="text-red-500 text-xs mt-2">Past</p>}
              {isTaskToday && <p className="text-emerald-500 text-xs mt-2">Task for the day</p>}
              {isUpcoming && <p className="text-blue-500 text-xs mt-2">Upcoming</p>}
            </Card>
          );
        })}
      </div>

      {tasks.filter((task) => isToday(task.due_date)).length === 0 && (
        <div className="text-center text-gray-600 mt-4">
          <p>No tasks for today.</p>
        </div>
      )}
     < ToastContainer  />
    </div>
  );
};

export default StudentTask;
