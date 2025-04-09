import { useEffect, useState } from 'react';
import { getSavedAuthData } from '../../../../../utils/Localstorage';
import ClassProgressCard from './components/progressChart';
import api, { API_BASE_URLS } from '../../../../../api/axios_api_call';
import { getSessionData } from '../../components/currentSession';
import { getStudentByCode } from '../../components/studentsInSession';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {useDashboardData} from './_lib';

export default function Dashboard() {
  const {
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
  } = useDashboardData();

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-3 p-3 lg:grid-cols-3 overflow-y-auto max-h-[860px]">
      <div className="col-span-1 xl:col-span-4 student-card rounded-xl p-6">
        <div className="flex flex-col justify-between h-full">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              Welcome back,{' '}
              <span className="text-teal-200">
                {user?.user?.username.toUpperCase()}!
              </span>
            </h1>
            <p className="text-gray-400">Ready to assess your students?</p>
          </div>
        </div>
      </div>

      <div className="col-span-1 xl:col-span-8 student-card rounded-xl p-6">
        <ClassProgressCard studentProgress={studentProgress} />
      </div>

      <div className="col-span-1 xl:col-span-8 student-card rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4 bg-gray-100 bg-opacity-15 rounded-lg p-1">
            <h3 className="font-bold text-xl text-center text-white">
              Assessment Score
            </h3>
            <div className="overflow-x-auto">
              <Table>
                <TableCaption className="text-gray-500">
                  Recent Assessments & Scores
                </TableCaption>
                <TableHeader>
                  <TableRow className="font-medium text-medium">
                    <TableHead className="w-[40%] text-gray-400">
                      Assessment Title
                    </TableHead>
                    <TableHead className="text-center text-gray-400">
                      Top Scorer
                    </TableHead>
                    <TableHead className="text-right text-gray-400">
                      Score
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studentTableLeaderBoard?.recent_assessments?.map(
                    (assessment, index) => (
                      <TableRow key={index} className="font-medium text-medium">
                        <TableCell className="font-medium">
                          {assessment.assessment_title}
                        </TableCell>
                        <TableCell className="text-center">
                          {getStudentNameByCode(assessment.top_scorer)}
                        </TableCell>
                        <TableCell className="text-right">
                          {assessment.score}
                        </TableCell>
                      </TableRow>
                    ),
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="space-y-4 bg-gray-100 bg-opacity-15 rounded-lg p-1">
            <h3 className="font-bold text-xl text-center text-white">
              Task Score
            </h3>
            <div className="overflow-x-auto">
              <Table>
                <TableCaption className="text-gray-400">
                  Recent Tasks & Scores
                </TableCaption>
                <TableHeader>
                  <TableRow className="font-medium text-medium">
                    <TableHead className="w-[40%] text-gray-400">
                      Task Title
                    </TableHead>
                    <TableHead className="text-center text-gray-400">
                      Top Scorer
                    </TableHead>
                    <TableHead className="text-right text-gray-400">
                      Score
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studentTableLeaderBoard?.recent_tasks?.map((task, index) => (
                    <TableRow key={index} className="font-medium text-medium">
                      <TableCell>{task.task_title}</TableCell>
                      <TableCell className="text-center">
                        {getStudentNameByCode(task.top_scorer)}
                      </TableCell>
                      <TableCell className="text-right">
                        {task.score || 'To be checked'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>

      <div className="col-span-1 xl:col-span-4 student-card rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-6 text-center">Leaderboard</h2>
        <div className="space-y-3">
          {studentTableLeaderBoard?.leaderboard?.map((user, index) => (
            <div
              key={user.name}
              className="flex items-center justify-between bg-teal-500/50 p-3 rounded hover:bg-teal-900/60 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <span className="text-emerald-400 font-semibold">
                  {index + 1}
                </span>
                <span className="truncate">
                  {getStudentNameByCode(user.name)}
                </span>
              </div>
              <span className="font-semibold">{user.score}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="col-span-1 xl:col-span-4 student-card frounded-xl p-6">
        <div className="flex flex-col justify-between h-full">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              SESSION REMAINING, <br />
              <span className="text-teal-200">{session?.sessions?.days_left} days</span>
            </h1>
            <p className="text-gray-400">
              {/* Buy more time and keep up your good work! */}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
