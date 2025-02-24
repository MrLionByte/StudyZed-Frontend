import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Calendar, Clock, CheckCircle2, AlertCircle, ArrowRight, CalendarClock } from 'lucide-react';
import api, { API_BASE_URLS } from '../../../../../api/axios_api_call';
import { studentEndPoints } from '../../../../../api/endpoints/userEndPoints';
import { getSessionData } from '../../components/currentSession';
import { toast, ToastContainer } from 'react-toastify';

const StudentTask = () => {
  const [fetchFromBackend, setFetchFromBackend] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState([]);

  const GetTasksForStudent = async () => {
    const session = getSessionData();
    try {
      const url = API_BASE_URLS['Session_Service'];
      const response = await api.get(
        `${studentEndPoints.GetTasksForStudent}?session_code=${session.sessions.session_code}`,
        { baseURL: url },
      );
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to fetch tasks');
    }
  };

  useEffect(() => {
    if (fetchFromBackend) {
      GetTasksForStudent();
      setFetchFromBackend(false);
    }
  }, [fetchFromBackend]);

  const getTaskStatus = (taskDate) => {
    const today = new Date();
    taskDate = new Date(taskDate);
    
    if (
      taskDate.getDate() === today.getDate() &&
      taskDate.getMonth() === today.getMonth() &&
      taskDate.getFullYear() === today.getFullYear()
    ) {
      return 'today';
    }
    return taskDate < today ? 'past' : 'upcoming';
  };

  const submitAnswer = async (taskId) => {
    try {
      const url = API_BASE_URLS['Session_Service'];
      const response = await api.post(
        'task-student/task-submit-answer/',
        {
          task_id: taskId,
          answer,
        },
        { baseURL: url },
      );

      if (response.status === 200) {
        toast.warning('Already attended task for the day');
      } else if (response.status === 201) {
        toast.success('Task submitted successfully');
      }
      setSubmitted([...submitted, taskId]);
      setAnswer('');
    } catch (error) {
      toast.error('Failed to submit task');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'today':
        return 'bg-emerald-50 border-emerald-200 text-emerald-700';
      case 'past':
        return 'bg-red-50 border-red-200 text-red-700';
      case 'upcoming':
        return 'bg-blue-50 border-blue-200 text-blue-700';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'today':
        return <Clock className="w-4 h-4" />;
      case 'past':
        return <AlertCircle className="w-4 h-4" />;
      case 'upcoming':
        return <ArrowRight className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const TaskCard = ({ task, status }) => (
    
    <Card
      className={`relative overflow-hidden bg-slate-200 transition-all duration-300 hover:shadow-lg ${
        status === 'today' ? 'ring-2 ring-emerald-500 ring-opacity-50' : ''
      }`}
    >
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
            {task.title}
          </h3>
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
            {getStatusIcon(status)}
            <span className="capitalize">{status}</span>
          </div>
        </div>
        
        <div className="space-y-4">
          <p className="text-gray-600 text-sm line-clamp-3">
            {task.description}
          </p>
          
          <div className="flex items-center text-gray-500 text-xs gap-2">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(task.due_date)}</span>
          </div>

          {status === 'today' && (
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={() => setSelectedTask(task)}
                >
                  Open Task
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold">
                    {selectedTask?.title}
                  </DialogTitle>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>Due: {formatDate(selectedTask?.due_date)}</span>
                  </div>
                </DialogHeader>
                
                <div className="mt-4 space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Task Description</h4>
                    <p className="text-gray-700">{selectedTask?.description}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="font-medium text-gray-900">Your Answer</label>
                    <Textarea
                      placeholder="Write your answer here..."
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      className="min-h-[150px] resize-y"
                    />
                  </div>
                </div>

                <DialogFooter className="mt-6">
                  <Button
                    onClick={() => submitAnswer(task.id)}
                    className="bg-emerald-600 hover:bg-emerald-700"
                    disabled={submitted.includes(task.id)}
                  >
                    {submitted.includes(task.id) ? (
                      <span className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        Submitted
                      </span>
                    ) : (
                      'Submit Answer'
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </Card>
  );

  const sortedTasks = tasks.sort((a, b) => {
    const statusA = getTaskStatus(a.due_date);
    const statusB = getTaskStatus(b.due_date);
    
    const priority = { today: 0, upcoming: 1, past: 2 };
    return priority[statusA] - priority[statusB];
  });

  const groupedTasks = {
    today: sortedTasks.filter(task => getTaskStatus(task.due_date) === 'today'),
    upcoming: sortedTasks.filter(task => getTaskStatus(task.due_date) === 'upcoming'),
    past: sortedTasks.filter(task => getTaskStatus(task.due_date) === 'past')
  };
  
  return (
    <div className="h-screen flex flex-col bg-transparent">
      {/* Fixed Header */}
      <div className="p-6 pb-0">
        <h1 className="text-2xl font-bold text-emerald-400 mb-2">Tasks</h1>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-auto p-6 pt-4">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Today's Tasks */}
          {groupedTasks.today.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4 sticky top-0 py-2">
                <Clock className="w-5 h-5 text-emerald-600" />
                <h2 className="text-lg font-semibold text-gray-400">Today's Tasks</h2>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {groupedTasks.today.map((task, index) => (
                  <TaskCard key={`today-${index}`} task={task} status="today" />
                ))}
              </div>
            </div>
          )}

          {/* Upcoming Tasks */}
          {groupedTasks.upcoming.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4 sticky top-0 py-2">
                <CalendarClock className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-400">Upcoming Tasks</h2>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {groupedTasks.upcoming.map((task, index) => (
                  <TaskCard key={`upcoming-${index}`} task={task} status="upcoming" />
                ))}
              </div>
            </div>
          )}

          {/* Past Tasks */}
          {groupedTasks.past.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4 sticky top-0 py-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <h2 className="text-lg font-semibold text-gray-400">Past Tasks</h2>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {groupedTasks.past.map((task, index) => (
                  <TaskCard key={`past-${index}`} task={task} status="past" />
                ))}
              </div>
            </div>
          )}

          {tasks.length === 0 && (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="bg-white rounded-lg p-8 max-w-md text-center">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Tasks Available</h3>
                <p className="text-gray-600">There are no tasks assigned at the moment.</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default StudentTask;