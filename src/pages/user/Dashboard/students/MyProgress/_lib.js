// MyProgress_lib.js
import { useEffect, useState } from 'react';
import api, { API_BASE_URLS } from '../../../../../api/axios_api_call';
import { getSessionData } from '../../components/currentSession';

export const useMyProgressLogic = () => {
  const [fetchFromBackend, setFetchFromBackend] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const [assessmentData, setAssessmentData] = useState({
    categories: [],
    marksObtained: [],
    marksLost: [],
  });

  const [attendedTask, setAttendedTask] = useState([]);
  const [totalTask, setTotalTask] = useState([]);
  const [taskScoreRatio, setTaskScoreRatio] = useState([]);

  const url = API_BASE_URLS['Session_Service'];
  const session = getSessionData();

  const getDataForAssessmentCharts = async () => {
    try {
      const response = await api.get(
        'student-progress/assessment-performance-graph/',
        {
          params: {
            session_code: session.sessions.session_code,
          },
          baseURL: url,
        }
      );
      const { categories, marks_obtained, marks_lost } = response.data.data;
      setAssessmentData({
        categories,
        marksObtained: marks_obtained,
        marksLost: marks_lost,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const getDataForDailyTaskCharts = async () => {
    try {
      const response = await api.get(
        'student-progress/daily-performance-graph/',
        {
          params: {
            session_code: session.sessions.session_code,
          },
          baseURL: url,
        }
      );
      setAttendedTask(response.data.attended_task);
      setTotalTask(response.data.total_task);
      setTaskScoreRatio(response.data.task_score_ratio);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (fetchFromBackend) {
      Promise.all([
        getDataForAssessmentCharts(),
        getDataForDailyTaskCharts(),
      ]).finally(() => {
        setTimeout(() => {
          setIsLoading(false);
          setFetchFromBackend(false);
        }, 3000);
      });
    }
  }, [fetchFromBackend]);

  return {
    isLoading,
    assessmentData,
    attendedTask,
    totalTask,
    taskScoreRatio,
  };
};
