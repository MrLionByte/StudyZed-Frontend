import React from 'react';
import AssessmentPerformance from './components/AssessmentPerformance';
import DailyTaskPerformance from './components/DailyTaskPerformance';
import Skeleton from '../../components/skelton';
import { useMyProgressLogic } from './_lib';

const MyProgress = () => {
  const {
    isLoading,
    assessmentData,
    attendedTask,
    totalTask,
    taskScoreRatio,
  } = useMyProgressLogic();

  return (
    <div className="grid grid-cols-1 md:h-[610px] 2xl:h-full overflow-y-auto gap-2">
      <div className="">
        {isLoading ? (
          <Skeleton className="h-96 w-full" />
        ) : (
          <AssessmentPerformance assessmentData={assessmentData} />
        )}
      </div>
      <div className="">
        {isLoading ? (
          <Skeleton className="h-96 w-full" />
        ) : (
          <DailyTaskPerformance
            attendedTask={attendedTask}
            totalTask={totalTask}
            taskScoreRatio={taskScoreRatio}
          />
        )}
      </div>
    </div>
  );
};

export default MyProgress;
