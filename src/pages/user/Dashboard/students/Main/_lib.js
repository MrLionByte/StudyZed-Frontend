import { useEffect, useState } from 'react';
import { getSavedAuthData } from '../../../../../utils/Localstorage';
import { getSessionData } from '../../components/currentSession';
import { getStudentByCode } from '../../components/studentsInSession';
import api, { API_BASE_URLS } from '../../../../../api/axios_api_call';

export const useDashboardData = () => {
  const [fetchFromBackend, setFetchFromBackend] = useState(true);
  const [studentProgress, setStudentProgress] = useState({});
  const [studentTableLeaderBoard, setStudentTableLeaderBoard] = useState({});
  const [loading, setLoading] = useState(false);

  const user = getSavedAuthData();
  const session = getSessionData();
  const students = getStudentByCode();
  const url = API_BASE_URLS['Session_Service'];

  const getStudentNameByCode = (studentCode) => {
    const matchedStudent = students.find((student) => student.user_code === studentCode);
    return matchedStudent ? matchedStudent.username : studentCode;
  };

  const getStudentProgressCardData = async () => {
    setLoading(true);
    try {
      const response = await api.get('/dashboard-student/data/', {
        baseURL: url,
        params: { session_code: session?.sessions?.session_code },
      });

      const values = {
        completion_rate: response.data.completion_rate,
        on_time_rate: response.data.on_time_rate,
        average_score: response.data.average_score,
        total_tasks_scheduled: response.data.total_tasks_scheduled,
        late_submission_count: response.data.late_submission_count,
        performance: response.data.performance,
      };

      setStudentProgress(values);
    } catch (err) {
      // console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStudentTableAndLeaderBoard = async () => {
    setLoading(true);
    try {
      const response = await api.get('/dashboard-student/table-view/', {
        baseURL: url,
        params: { session_code: session?.sessions?.session_code },
      });

      const values = {
        leaderboard: response.data.leaderboard.map(([id, scores]) => ({
          name: id,
          score: scores.total_score,
        })),
        recent_assessments: response.data.recent_assessments,
        recent_tasks: response.data.recent_tasks,
      };

      setStudentTableLeaderBoard(values);
    } catch (err) {
      // console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fetchFromBackend) {
      getStudentProgressCardData();
      getStudentTableAndLeaderBoard();
      setFetchFromBackend(false);
    }
  }, [fetchFromBackend]);

  return {
    user,
    loading,
    studentProgress,
    studentTableLeaderBoard,
    getStudentNameByCode,
  };
};
