import React from 'react';
import { CheckCircle, Clock, Award, XCircle, TrendingUp } from 'lucide-react';


const StudentProgressCard = ({ studentProgress }) => {

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 text-black">
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex items-center gap-3">
          <CheckCircle className="h-8 w-8 text-green-500" />
          <div>
            <p className="text-sm text-gray-600">Completion Rate</p>
            <p className="text-2xl font-bold">{studentProgress?.completion_rate}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex items-center gap-3">
          <Clock className="h-8 w-8 text-blue-500" />
          <div>
            <p className="text-sm text-gray-600">On-time Rate</p>
            <p className="text-2xl font-bold">{studentProgress?.on_time_rate}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex items-center gap-3">
          <Award className="h-8 w-8 text-purple-500" />
          <div>
            <p className="text-sm text-gray-600">Average Score</p>
            <p className="text-2xl font-bold">{studentProgress?.average_score}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex items-center gap-3">
          <XCircle className="h-8 w-8 text-red-500" />
          <div>
            <p className="text-sm text-gray-600">Late Submissions</p>
            <p className="text-2xl font-bold">{studentProgress?.late_submission_count}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex items-center gap-3">
          <TrendingUp className="h-8 w-8 text-emerald-500" />
          <div>
            <p className="text-sm text-gray-600">Total Tasks</p>
            <p className="text-2xl font-bold">{studentProgress?.total_tasks_scheduled}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentProgressCard;