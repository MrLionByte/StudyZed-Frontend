import { useEffect, useState } from 'react';
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import {
  Calendar, Clock, CheckCircle2, AlertCircle, ArrowRight, CalendarClock,
} from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import LogoSvg from '../../../../../assets/test.svg';

import {
  GetTasksForStudent,
  submitAnswer,
  getTaskStatus,
  formatDate,
  getStatusColor,
} from './_lib';

const StudentTask = () => {
  const [fetchFromBackend, setFetchFromBackend] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (fetchFromBackend) {
      GetTasksForStudent(setTasks, setLoading);
      setFetchFromBackend(false);
      const sub = localStorage.getItem('submitted');
      setSubmitted(sub);
    }
  }, [fetchFromBackend]);

  const handleOpenDialog = (task) => {
    setSelectedTask(task);
    setIsDialogOpen(true);
  };

  const getStatusIcon = (status, icons) => {
    const { Clock, AlertCircle, ArrowRight } = icons;
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
  }

  const TaskCard = ({ task, status }) => (
    <Card
      className={`relative overflow-y-scroll student-card transition-all 
        max-h-52 duration-300 hover:shadow-lg ${
          status === 'today' ? 'ring-2 ring-emerald-500 ring-opacity-50' : ''
        }`}
    >
      <div>
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg text-gray-400 line-clamp-2">
            {task.title}
          </h3>
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
            {getStatusIcon(status, { Clock, AlertCircle, ArrowRight })}
            <span className="capitalize">{status}</span>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-gray-50 text-sm break-words">{task.description}</p>
          <div className="flex items-center text-gray-300 text-xs gap-2">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(task.due_date)}</span>
          </div>

          {status === 'today' && submitted != task.id && (
            <Button
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={() => handleOpenDialog(task)}
            >
              Open Task
            </Button>
          )}
        </div>
      </div>
    </Card>
  );

  const seen = new Set();
  const deduplicatedTasks = tasks.filter(task => {
    const key = task.id; 
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  
  const sortedTasks = deduplicatedTasks.sort((a, b) => {
    const priority = { today: 0, upcoming: 1, past: 2 };
    return priority[getTaskStatus(a.due_date)] - priority[getTaskStatus(b.due_date)];
  });

  const groupedTasks = {
    today: sortedTasks.filter((task) => getTaskStatus(task.due_date) === 'today'),
    upcoming: sortedTasks.filter((task) => getTaskStatus(task.due_date) === 'upcoming'),
    past: sortedTasks.filter((task) => getTaskStatus(task.due_date) === 'past'),
  };

  return (
    <div className="max-h-[80dvh] flex flex-col bg-transparent overflow-auto">
      <div className="p-6 pb-0">
        <h1 className="text-2xl font-bold text-emerald-400 mb-2">Tasks</h1>
      </div>

      <div className="flex-1 p-6 pt-4">
        <div className="max-w-7xl mx-auto space-y-6">
          {['today', 'upcoming', 'past'].map((status) =>
            groupedTasks[status].length > 0 && (
              <div key={status}>
                <div className="flex items-center gap-2 mb-4 sticky top-0 py-2">
                  {status === 'today' && <Clock className="w-5 h-5 text-emerald-600" />}
                  {status === 'upcoming' && <CalendarClock className="w-5 h-5 text-blue-600" />}
                  {status === 'past' && <AlertCircle className="w-5 h-5 text-red-600" />}
                  <h2 className="text-lg font-semibold text-gray-400">
                    {status.charAt(0).toUpperCase() + status.slice(1)} Tasks
                  </h2>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {groupedTasks[status].map((task, index) => (
                    <TaskCard key={`${status}-${index}`} task={task} status={status} />
                  ))}
                </div>
              </div>
            )
          )}

          {tasks.length === 0 && (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="bg-white rounded-lg p-8 max-w-md text-center">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Tasks Available
                </h3>
                <p className="text-gray-600">
                  There are no tasks assigned at the moment.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {selectedTask?.title}
            </DialogTitle>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>Due: {selectedTask ? formatDate(selectedTask.due_date) : ''}</span>
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
                className="min-h-[150px] resize-y text-emerald-800"
              />
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button
              onClick={() => selectedTask && submitAnswer(selectedTask.id, answer, setSubmitted, setAnswer)}
              className="bg-emerald-600 hover:bg-emerald-700"
              disabled={selectedTask && submitted == selectedTask.id}
            >
              {selectedTask && submitted == selectedTask.id ? (
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

      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900/75 z-50">
          <img
            src={LogoSvg}
            alt="Loading"
            className="w-64 h-64 animate-pulse"
          />
        </div>
      )}
    </div>
  );
};

export default StudentTask;
