// import { useEffect, useState } from 'react';
// import { getSavedAuthData } from '../../../../../utils/Localstorage';
// import ClassProgressCard from './components/progressChart';
// import api, { API_BASE_URLS } from '../../../../../api/axios_api_call';
// import { getSessionData } from '../../components/currentSession';
// import { getStudentByCode } from '../../components/studentsInSession';
// import {
//   Table,
//   TableBody,
//   TableCaption,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table';
// import {useDashboardData} from './_lib';

// export default function Dashboard() {
//   const {
//     setFetchFromBackend,
//     setStudentProgress,
//     setStudentTableLeaderBoard,
//     fetchFromBackend,
//     studentProgress,
//     studentTableLeaderBoard,
//     url,
//     user,
//     session,
//     students,
//     getStudentProgressCardData,
//     getStudentTableAndLeaderBoard,
//     getStudentNameByCode,
//   } = useDashboardData();

//   return (
//     <div className="grid grid-cols-1 xl:grid-cols-12 gap-3 p-3 lg:grid-cols-3 overflow-y-auto max-h-[860px]">
//       <div className="col-span-1 xl:col-span-4 student-card rounded-xl p-6">
//         <div className="flex flex-col justify-between h-full">
//           <div>
//             <h1 className="text-2xl md:text-3xl font-bold mb-2">
//               Welcome back,{' '}
//               <span className="text-teal-200">
//                 {user?.user?.username.toUpperCase()}!
//               </span>
//             </h1>
//             <p className="text-gray-400">Ready to assess your students?</p>
//           </div>
//         </div>
//       </div>

//       <div className="col-span-1 xl:col-span-8 student-card rounded-xl p-6">
//         <ClassProgressCard studentProgress={studentProgress} />
//       </div>

//       <div className="col-span-1 xl:col-span-8 student-card rounded-xl p-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="space-y-4 bg-gray-100 bg-opacity-15 rounded-lg p-1">
//             <h3 className="font-bold text-xl text-center text-white">
//               Assessment Score
//             </h3>
//             <div className="overflow-x-auto">
//               <Table>
//                 <TableCaption className="text-gray-500">
//                   Recent Assessments & Scores
//                 </TableCaption>
//                 <TableHeader>
//                   <TableRow className="font-medium text-medium">
//                     <TableHead className="w-[40%] text-gray-400">
//                       Assessment Title
//                     </TableHead>
//                     <TableHead className="text-center text-gray-400">
//                       Top Scorer
//                     </TableHead>
//                     <TableHead className="text-right text-gray-400">
//                       Score
//                     </TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {studentTableLeaderBoard?.recent_assessments?.map(
//                     (assessment, index) => (
//                       <TableRow key={index} className="font-medium text-medium">
//                         <TableCell className="font-medium">
//                           {assessment.assessment_title}
//                         </TableCell>
//                         <TableCell className="text-center">
//                           {getStudentNameByCode(assessment.top_scorer)}
//                         </TableCell>
//                         <TableCell className="text-right">
//                           {assessment.score}
//                         </TableCell>
//                       </TableRow>
//                     ),
//                   )}
//                 </TableBody>
//               </Table>
//             </div>
//           </div>

//           <div className="space-y-4 bg-gray-100 bg-opacity-15 rounded-lg p-1">
//             <h3 className="font-bold text-xl text-center text-white">
//               Task Score
//             </h3>
//             <div className="overflow-x-auto">
//               <Table>
//                 <TableCaption className="text-gray-400">
//                   Recent Tasks & Scores
//                 </TableCaption>
//                 <TableHeader>
//                   <TableRow className="font-medium text-medium">
//                     <TableHead className="w-[40%] text-gray-400">
//                       Task Title
//                     </TableHead>
//                     <TableHead className="text-center text-gray-400">
//                       Top Scorer
//                     </TableHead>
//                     <TableHead className="text-right text-gray-400">
//                       Score
//                     </TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {studentTableLeaderBoard?.recent_tasks?.map((task, index) => (
//                     <TableRow key={index} className="font-medium text-medium">
//                       <TableCell>{task.task_title}</TableCell>
//                       <TableCell className="text-center">
//                         {getStudentNameByCode(task.top_scorer)}
//                       </TableCell>
//                       <TableCell className="text-right">
//                         {task.score || 'To be checked'}
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="col-span-1 xl:col-span-4 student-card rounded-xl p-6">
//         <h2 className="text-xl font-semibold mb-6 text-center">Leaderboard</h2>
//         <div className="space-y-3">
//           {studentTableLeaderBoard?.leaderboard?.map((user, index) => (
//             <div
//               key={user.name}
//               className="flex items-center justify-between bg-teal-500/50 p-3 rounded hover:bg-teal-900/60 transition-colors"
//             >
//               <div className="flex items-center space-x-3">
//                 <span className="text-emerald-400 font-semibold">
//                   {index + 1}
//                 </span>
//                 <span className="truncate">
//                   {getStudentNameByCode(user.name)}
//                 </span>
//               </div>
//               <span className="font-semibold">{user.score}</span>
//             </div>
//           ))}
//         </div>
//       </div>

//       <div className="col-span-1 xl:col-span-4 student-card frounded-xl p-6">
//         <div className="flex flex-col justify-between h-full">
//           <div>
//             <h1 className="text-2xl md:text-3xl font-bold mb-2">
//               SESSION REMAINING, <br />
//               <span className="text-teal-200">{session?.sessions?.days_left} days</span>
//             </h1>
//             <p className="text-gray-400">
//               {/* Buy more time and keep up your good work! */}
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useEffect } from 'react';
import ClassProgressCard from './components/progressChart';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useDashboardData } from './_lib';

export default function Dashboard() {
  const {
    studentProgress,
    studentTableLeaderBoard,
    user,
    session,
    getStudentNameByCode,
  } = useDashboardData();

  return (
    <div className="flex flex-col w-full h-full p-2 overflow-y-auto">
      {/* Welcome and Session Cards - Mobile-first approach */}
      <div className="w-full grid grid-cols-1 gap-3 mb-3">
        
        {/* Welcome Card - Full width on mobile */}
        <div className="student-card p-4 rounded-xl bg-opacity-20 w-full">
          <div className="h-full flex flex-col justify-center">
            <h1 className="text-xl sm:text-2xl font-bold mb-1">
              Welcome back,{' '}
              <span className="text-teal-200">
                {user?.user?.username?.toUpperCase() || 'Student'}!
              </span>
            </h1>
            <p className="text-gray-400 text-sm">
              Ready to continue your learning journey?
            </p>
          </div>
        </div>

        {/* Session Card - Full width on mobile */}
        <div className="student-card p-4 rounded-xl bg-opacity-20 w-full">
          <div className="h-full flex flex-col justify-center">
            <h1 className="text-xl sm:text-2xl font-bold mb-1">
              SESSION REMAINING
              <span className="block text-teal-200 mt-1">
                {session?.sessions?.days_left || 0} days
              </span>
            </h1>
          </div>
        </div>
      </div>

      {/* Progress Cards - Full width with responsive grid */}
      <div className="w-full p-4 rounded-xl mb-3">
        <h2 className="text-lg font-bold mb-3">Progress Overview</h2>
        <div className="w-full">
          <ClassProgressCard studentProgress={studentProgress} />
        </div>
      </div>

      {/* Tables Section - Responsive grid */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {/* Assessment Score */}
        <div className="student-card p-4 rounded-xl">
          <h3 className="font-bold text-lg mb-3">Assessment Score</h3>
          <div className="bg-white bg-opacity-10 rounded-lg p-2 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-gray-300">Title</TableHead>
                  <TableHead className="text-gray-300 text-center">Top Scorer</TableHead>
                  <TableHead className="text-gray-300 text-right">Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentTableLeaderBoard?.recent_assessments?.length > 0 ? (
                  studentTableLeaderBoard.recent_assessments.map(
                    (assessment, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium truncate">
                          {assessment.assessment_title}
                        </TableCell>
                        <TableCell className="text-center truncate">
                          {getStudentNameByCode(assessment.top_scorer)}
                        </TableCell>
                        <TableCell className="text-right">
                          {assessment.score}
                        </TableCell>
                      </TableRow>
                    )
                  )
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-gray-400">
                      No assessments available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Task Score */}
        <div className="student-card p-4 rounded-xl">
          <h3 className="font-bold text-lg mb-3">Task Score</h3>
          <div className="bg-white bg-opacity-10 rounded-lg p-2 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-gray-300">Title</TableHead>
                  <TableHead className="text-gray-300 text-center">Top Scorer</TableHead>
                  <TableHead className="text-gray-300 text-right">Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentTableLeaderBoard?.recent_tasks?.length > 0 ? (
                  studentTableLeaderBoard.recent_tasks.map((task, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium truncate">
                        {task.task_title}
                      </TableCell>
                      <TableCell className="text-center truncate">
                        {getStudentNameByCode(task.top_scorer)}
                      </TableCell>
                      <TableCell className="text-right">
                        {task.score || 'Pending'}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-gray-400">
                      No tasks available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="student-card p-4 rounded-xl">
          <h3 className="font-bold text-lg mb-3">Leaderboard</h3>
          <div className="space-y-2 bg-white bg-opacity-10 rounded-lg p-3 max-h-[300px] overflow-y-auto">
            {studentTableLeaderBoard?.leaderboard?.length > 0 ? (
              studentTableLeaderBoard.leaderboard.map((user, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-teal-500/30 p-2 rounded hover:bg-teal-600/40 transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 flex items-center justify-center rounded-full bg-teal-700 text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <span className="truncate max-w-[120px] text-white text-sm">
                      {getStudentNameByCode(user.name)}
                    </span>
                  </div>
                  <span className="font-bold text-teal-200">{user.score}</span>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-400 py-4">
                No leaderboard data available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}