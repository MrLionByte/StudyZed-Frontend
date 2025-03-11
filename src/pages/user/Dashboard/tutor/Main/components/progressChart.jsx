import React from 'react';
import { CheckCircle, Clock, Award, 
  XCircle, TrendingUp,Book,Users } from 'lucide-react';


const StudentProgressCard = ({ studentProgress }) => {

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-black">
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
            <p className="text-sm text-gray-600">On-time submission Rate</p>
            <p className="text-2xl font-bold">{studentProgress?.on_time_rate}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex items-center gap-3">
          <Users className="h-8 w-8 text-purple-500" />
          <div>
            <p className="text-sm text-gray-600">Number of users</p>
            <p className="text-2xl font-bold">{studentProgress?.no_of_students}</p>
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
            <p className="text-sm text-gray-600">Total activities</p>
            <p className="text-2xl font-bold">{studentProgress?.total_tasks_scheduled}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex items-center gap-3">
          
          <Book className="h-8 w-8 text-emerald-500" />
          <div>
            <p className="text-sm text-gray-600">Study Materials Shared</p>
            <p className="text-2xl font-bold">{studentProgress?.no_of_materials}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentProgressCard;