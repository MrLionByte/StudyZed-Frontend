import { useState, useEffect } from 'react';
import StudentPerformanceChart from './components/PerformanceChart';
import DailyTaskChart from './components/DailyTaskChart';
import Skeleton from '../../components/skelton';
import { getSessionData } from '../../components/currentSession';
import api, { API_BASE_URLS } from '../../../../../api/axios_api_call';

export default function ClassProgress() {
  const [fetchFromBackend, setFetchFromBackend] = useState(true);
  const [assessmentPerformance, setAssessmentPerformance] = useState([]);
  const [taskPerformance, setTaskPerformance] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const session = getSessionData().sessions?.session_code;
  const url = API_BASE_URLS['Session_Service'];

  const getDataForAssessmentCharts = async () => {
    const response = await api.get('progress/assessment-performance-graph/', {
      params: {
        session_code: session,
      },
      baseURL: url,
    });
    setAssessmentPerformance(response.data);
  };

  const getDataForDailyTaskCharts = async () => {
    const response = await api.get('progress/daily-performance-graph/', {
      params: {
        session_code: session,
      },
      baseURL: url,
    });
    
    setTaskPerformance(response.data);
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
        }, 1000);
      });
    }
  }, [fetchFromBackend]);

  return (
    <div className="grid grid-cols-1 md:h-[830px] overflow-y-auto gap-2 p-4 ">
      <div className="">
        {isLoading ? (
          <Skeleton className="h-96 w-full" />
        ) : (
          <StudentPerformanceChart
            assessmentPerformance={assessmentPerformance}
          />
        )}
      </div>
      <div>
        {isLoading ? (
          <Skeleton className="h-96 w-full" />
        ) : (
          <DailyTaskChart taskPerformance={taskPerformance} />
        )}
      </div>
      <div>
        {/* {isLoading ? <Skeleton className="h-48 w-full" /> : <CardWithForm />} */}
      </div>
    </div>
  );
}
