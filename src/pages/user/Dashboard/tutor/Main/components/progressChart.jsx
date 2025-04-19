// import React from 'react';
// import {
//   CheckCircle,
//   Clock,
//   Award,
//   XCircle,
//   TrendingUp,
//   Book,
//   Users,
// } from 'lucide-react';

// const StudentProgressCard = ({ studentProgress }) => {
//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-black">
//       <div className="bg-white p-4 rounded-lg shadow-md">
//         <div className="flex items-center gap-3">
//           <CheckCircle className="h-8 w-8 text-green-500" />
//           <div>
//             <p className="text-sm text-gray-600">Completion Rate</p>
//             <p className="text-2xl font-bold">
//               {studentProgress?.completion_rate}
//             </p>
//           </div>
//         </div>
//       </div>

//       <div className="bg-white p-4 rounded-lg shadow-md">
//         <div className="flex items-center gap-3">
//           <Clock className="h-8 w-8 text-blue-500" />
//           <div>
//             <p className="text-sm text-gray-600">On-time submission Rate</p>
//             <p className="text-2xl font-bold">
//               {studentProgress?.on_time_rate}
//             </p>
//           </div>
//         </div>
//       </div>

//       <div className="bg-white p-4 rounded-lg shadow-md">
//         <div className="flex items-center gap-3">
//           <Users className="h-8 w-8 text-purple-500" />
//           <div>
//             <p className="text-sm text-gray-600">Number of users</p>
//             <p className="text-2xl font-bold">
//               {studentProgress?.no_of_students}
//             </p>
//           </div>
//         </div>
//       </div>

//       <div className="bg-white p-4 rounded-lg shadow-md">
//         <div className="flex items-center gap-3">
//           <XCircle className="h-8 w-8 text-red-500" />
//           <div>
//             <p className="text-sm text-gray-600">Late Submissions</p>
//             <p className="text-2xl font-bold">
//               {studentProgress?.late_submission_count}
//             </p>
//           </div>
//         </div>
//       </div>

//       <div className="bg-white p-4 rounded-lg shadow-md">
//         <div className="flex items-center gap-3">
//           <TrendingUp className="h-8 w-8 text-emerald-500" />
//           <div>
//             <p className="text-sm text-gray-600">Total activities</p>
//             <p className="text-2xl font-bold">
//               {studentProgress?.total_tasks_scheduled}
//             </p>
//           </div>
//         </div>
//       </div>

//       <div className="bg-white p-4 rounded-lg shadow-md">
//         <div className="flex items-center gap-3">
//           <Book className="h-8 w-8 text-emerald-500" />
//           <div>
//             <p className="text-sm text-gray-600">Study Materials Shared</p>
//             <p className="text-2xl font-bold">
//               {studentProgress?.no_of_materials}
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StudentProgressCard;

import React from 'react';
import {
  CheckCircle,
  Clock,
  XCircle,
  TrendingUp,
  Book,
  Users,
} from 'lucide-react';

const StudentProgressCard = ({ studentProgress }) => {
  const progressItems = [
    {
      icon: CheckCircle,
      color: 'text-green-500',
      label: 'Completion Rate',
      value: studentProgress?.completion_rate || '0%',
    },
    {
      icon: Clock,
      color: 'text-blue-500',
      label: 'On-time submission Rate',
      value: studentProgress?.on_time_rate || '0%',
    },
    {
      icon: Users,
      color: 'text-purple-500',
      label: 'Number of users',
      value: studentProgress?.no_of_students || '0',
    },
    {
      icon: XCircle,
      color: 'text-red-500',
      label: 'Late Submissions',
      value: studentProgress?.late_submission_count || '0',
    },
    {
      icon: TrendingUp,
      color: 'text-emerald-500',
      label: 'Total activities',
      value: studentProgress?.total_tasks_scheduled || '0',
    },
    {
      icon: Book,
      color: 'text-emerald-500',
      label: 'Study Materials Shared',
      value: studentProgress?.no_of_materials || '0',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 text-black">
      {progressItems.map((item, index) => (
        <div key={index} className="bg-white p-3 md:p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-2 md:gap-3">
            <item.icon className={`h-6 w-6 md:h-8 md:w-8 ${item.color}`} />
            <div>
              <p className="text-xs md:text-sm text-gray-600">{item.label}</p>
              <p className="text-lg md:text-2xl font-bold">{item.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StudentProgressCard;