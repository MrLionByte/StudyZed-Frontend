// _lib.js

import { useEffect, useState } from 'react';
import api, { API_BASE_URLS } from '../../../../../api/axios_api_call';
import { getSavedAuthData } from '../../../../../utils/Localstorage';
import { getSessionData } from '../../components/currentSession';
import { getStudentByCode } from '../../components/studentsInSession';

export function useDashboardData() {
  const [fetchFromBackend, setFetchFromBackend] = useState(true);
  const [studentProgress, setStudentProgress] = useState({});
  const [studentTableLeaderBoard, setStudentTableLeaderBoard] = useState({});

  const user = getSavedAuthData();
  const session = getSessionData();
  const students = getStudentByCode();
  const url = API_BASE_URLS['Session_Service'];

  function getStudentNameByCode(studentCode) {
    const matchedStudent = students.find(
      (student) => student.user_code === studentCode,
    );
    return matchedStudent ? matchedStudent.username : studentCode;
  }

  const getStudentProgressCardData = async () => {
    try {
      const response = await api.get('dashboard-tutor/data/', {
        baseURL: url,
        params: { session_code: session?.sessions?.session_code },
      });

      const values = {
        completion_rate: response.data.completion_rate,
        on_time_rate: response.data.on_time_rate,
        no_of_students: response.data.no_of_students,
        total_tasks_scheduled: response.data.total_tasks_scheduled,
        late_submission_count: response.data.late_submission_count,
        no_of_materials: response.data.no_of_materials,
      };

      setStudentProgress(values);
    } catch (err) {
      console.error(err);
    }
  };

  const getStudentTableAndLeaderBoard = async () => {
    try {
      const response = await api.get('dashboard-tutor/table-view/', {
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
      console.error(err);
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
    setFetchFromBackend,
    setStudentProgress,
    setStudentTableLeaderBoard,
    fetchFromBackend,
    studentProgress,
    studentTableLeaderBoard,
    url,
    user,
    session,
    students,
    getStudentProgressCardData,
    getStudentTableAndLeaderBoard,
    getStudentNameByCode,
  };
}
