import { useEffect, useState } from "react";
import { getSavedAuthData } from "../../../../../utils/Localstorage";
import StudentProgressCard from './components/progressChart';
import api,{API_BASE_URLS} from '../../../../../api/axios_api_call';
import { getSessionData } from "../../components/currentSession";
import { getStudentByCode } from "../../components/studentsInSession";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Dashboard() {
  const [fetchFromBackend, setFetchFromBackend] = useState(true)
  const [studentProgress, setStudentProgress] = useState({})
  const [studentTableLeaderBoard, setStudentTableLeaderBoard] = useState({})

  const user = getSavedAuthData()
  const url = API_BASE_URLS['Session_Service']
  const session = getSessionData();

  const students = getStudentByCode();

  function getStudentNameByCode(studentCode) {
    const matchedStudent = students.find(
      (student) => student.user_code === studentCode,
    );
    return matchedStudent ? matchedStudent.username : studentCode;
  }

  const getStudentProgressCardData = async() =>{
    try{
      const response = await api.get('/dashboard-student/data/',{
        baseURL: url,
        params : {session_code: session?.sessions?.session_code}
      })
      console.log("AS ",response);
      const values = {
        "completion_rate": response.data.completion_rate,
        "on_time_rate": response.data.on_time_rate,
        "average_score": response.data.average_score,
        "total_tasks_scheduled": response.data.total_tasks_scheduled,
        "late_submission_count": response.data.late_submission_count,
        "performance": response.data.performance
      }

      setStudentProgress(values)
    } catch (err){
      console.error(err);
      
    }
  }

  const getStudentTableAndLeaderBoard = async() =>{
    try{
      const response = await api.get('/dashboard-student/table-view/',{
        baseURL: url,
        params : {session_code: session?.sessions?.session_code}
      })
      console.log("AsxS ",response);
      const values = {
        leaderboard: response.data.leaderboard.map(([id, scores]) => ({
          name: id, 
          score: scores.total_score,
        })),
        recent_assessments: response.data.recent_assessments,
        recent_tasks: response.data.recent_tasks,
      };

      setStudentTableLeaderBoard(values)
    } catch (err){
      console.error(err);
      
    }
  }

  useEffect(()=>{
    if (fetchFromBackend){
      getStudentProgressCardData()
      getStudentTableAndLeaderBoard()
      setFetchFromBackend(false)
    }
  },[fetchFromBackend])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-y-auto max-h-[860px]">
      
      <div className="col-span-2 lg:col-span-7 bg-gradient-to-r from-gray-600 to-gray-900 rounded-xl p-8">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Welcome back, <span className="text-teal-200">{user?.user?.username.toUpperCase()}!</span></h1>
                  <p className="text-gray-400">Ready to continue your learning journey?</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-[#156f4e]">{studentProgress?.performance} %</p>
                  <p className="text-sm text-[#156f4e]">Weekly Progress</p>
                </div>
              </div>
      </div>

      <div className="col-span-2 lg:col-span-7 bg-gradient-to-r from-gray-600 to-gray-900 rounded-xl p-8">
        <StudentProgressCard studentProgress={studentProgress} />
      </div>

      <div className="col-span-5 rounded-lg flex flex-1 justify-between 
        gap-4 bg-gradient-to-r from-gray-600 to-gray-900 p-2">
      <div className="col-span-2 space-y-4 w-1/2 rounded-xl p-4 border">
      <h3 className="font-bold text-xl text-center text-white">
        Assessment Score
      </h3>
      <Table>
        <TableCaption>Recent Assessments & Scores</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Assessment Title</TableHead>
            <TableHead className="text-right">Score</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {studentTableLeaderBoard?.recent_assessments?.map((assessment, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">
                {assessment.assessment__assessment_title}
              </TableCell>
              <TableCell className="text-right">{assessment.score}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
    <div className="col-span-2 space-y-4 w-1/2 rounded-xl p-4 border">
      <h3 className="font-bold text-xl text-center text-white">
        Task Score
      </h3>
      <Table>
        <TableCaption>Recent Tasks & Scores</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Task Title</TableHead>
            <TableHead className="text-right">Score</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {studentTableLeaderBoard?.recent_tasks?.map((task, index) => (
            <TableRow key={task}>
              <TableCell className="font-medium">
                {task.task__title}
              </TableCell>
              <TableCell className="text-right">{task.score || 'to be checked'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
      </div>

      <div className="col-span-2 w-72 bg-gradient-to-r from-gray-600 to-gray-900  rounded-lg p-3">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Leaderboard
        </h2>
        <div className="space-y-3">
          {studentTableLeaderBoard?.leaderboard?.map((user, index) => (
            <div
              key={user.name}
              className="flex items-center justify-between bg-teal-900/50 p-3 rounded"
            >
              <div className="flex items-center space-x-3">
                <span className="text-emerald-400">#{index + 1}</span>
                <span>{getStudentNameByCode(user.name)}</span>
              </div>
              <span className="font-semibold">{user.score}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
