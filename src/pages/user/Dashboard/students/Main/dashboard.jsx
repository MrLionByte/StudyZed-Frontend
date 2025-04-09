import StudentProgressCard from './components/progressChart';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import LogoSvg from '../../../../../assets/test.svg';
import {useDashboardData} from "./_lib";

export default function Dashboard() {
  const {
    user,
    loading,
    studentProgress,
    studentTableLeaderBoard,
    getStudentNameByCode,
  } = useDashboardData();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-y-auto max-h-[860px]">
      <div className="col-span-2 lg:col-span-7 student-card rounded-xl p-8">
        <div className="flex justify-between items-center p-5">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back,{' '}
              <span className="text-teal-200">
                {user?.user?.username.toUpperCase()}!
              </span>
            </h1>
            <p className="text-gray-400">
              Ready to continue your learning journey?
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-[#509c80]">
              {studentProgress?.performance} %
            </p>
            <p className="text-sm text-[#51806f]">Weekly Progress</p>
          </div>
        </div>
      </div>

      <div className="col-span-2 lg:col-span-7 student-card rounded-xl p-8">
        <StudentProgressCard studentProgress={studentProgress} />
      </div>

      <div
        className="col-span-5 rounded-lg flex flex-1 justify-between 
        gap-4 student-card p-2"
      >
        <div className="col-span-2 space-y-4 w-1/2 rounded-xl p-4 bg-gray-400/10">
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
              {studentTableLeaderBoard?.recent_assessments?.map(
                (assessment, index) => (
                  <TableRow key={assessment.id}>
                    <TableCell className="font-medium">
                      {assessment.assessment__assessment_title}
                    </TableCell>
                    <p>{}</p>
                    <TableCell className="text-right">
                      {assessment.score}
                    </TableCell>
                  </TableRow>
                ),
              )}
            </TableBody>
          </Table>
        </div>
        <div className="col-span-2 space-y-4 w-1/2 rounded-xl p-4 bg-gray-400/10">
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
                  <TableCell className="text-right">
                    {task.score || 'to be checked'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="col-span-2 w-72 student-card rounded-lg p-3">
        <h2 className="text-xl font-semibold mb-4 text-center">Leaderboard</h2>
        <div className="space-y-3">
          {studentTableLeaderBoard?.leaderboard?.map((user, index) => (
            <div
              key={user.name}
              className="flex items-center justify-between bg-teal-500/70 hover:bg-teal-700/50  p-3 rounded-lg cursor-pointer"
            >
              <div className="flex items-center space-x-2 ">
                <span className="text-emerald-400">{index + 1}-</span>
                <span>{getStudentNameByCode(user.name)}</span>
              </div>
              <span className="font-semibold">{user.score}</span>
            </div>
          ))}
        </div>
      </div>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900/75 z-50">
          <img
            src={LogoSvg}
            alt="Loading"
            className="w-64 h-64 animate-pulse"
          />
        </div>
      )}
    </div>
  );
}
