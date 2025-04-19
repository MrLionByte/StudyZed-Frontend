import api, { API_BASE_URLS } from '../../../../../api/axios_api_call';
import { studentEndPoints } from '../../../../../api/endpoints/userEndPoints';
import { getSessionData } from '../../components/currentSession';
import { toast } from 'react-toastify';

export const GetTasksForStudent = async (setTasks, setLoading) => {
    setLoading(true)
  const session = getSessionData();
  try {
    const url = API_BASE_URLS['Session_Service'];
    const response = await api.get(
      `${studentEndPoints.GetTasksForStudent}?session_code=${session.sessions.session_code}`,
      { baseURL: url }
    );
    setTasks(response.data);
  } catch (error) {
    toast.error('Failed to fetch tasks');
  } finally{
    setLoading(false)
  }
};

export const submitAnswer = async (taskId, answer, setSubmitted, setAnswer) => {
  try {
    const url = API_BASE_URLS['Session_Service'];
    const response = await api.post(
      'task-student/task-submit-answer/',
      {
        task_id: taskId,
        answer,
      },
      { baseURL: url }
    );

    if (response.status === 200) {
      toast.warning('Already attended task for the day');
    } else if (response.status === 201) {
      toast.success('Task submitted successfully');
    }

    setSubmitted(taskId);
    setAnswer('');
    localStorage.setItem('submitted', taskId);
  } catch (error) {
    toast.error('Failed to submit task');
  }
};

export const getTaskStatus = (taskDate) => {
  const today = new Date();
  const taskDue = new Date(taskDate);

  const todayUTC = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
  const taskDueUTC = new Date(Date.UTC(taskDue.getUTCFullYear(), taskDue.getUTCMonth(), taskDue.getUTCDate()));

  if (taskDueUTC.getTime() === todayUTC.getTime()) return 'today';
  return taskDueUTC < todayUTC ? 'past' : 'upcoming';
};

export const formatDate = (dateString) => {
  const date = new Date(dateString).toUTCString();
  return date.slice(0, 22);
};

export const getStatusColor = (status) => {
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

