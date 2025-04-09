import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TaskData({ taskData }) {
  const donutOptions = {
    chart: {
      type: 'donut',
    },
    labels: ['Completed', 'Overdue', 'Upcoming'],
    colors: ['#10B981', '#EF4444', '#F59E0B'],
    legend: {
      position: 'bottom'
    },
    plotOptions: {
      pie: {
        donut: {
          size: '50%'
        }
      }
    }
  };

  const donutSeries = taskData ? [
    taskData.stats.completed,
    taskData.stats.overdue,
    taskData.stats.upcoming
  ] : [0, 0, 0];

  const upcomingTasks = taskData?.tasks?.filter(task => {
    const dueDate = new Date(task.due_date);
    const today = new Date();
    return !task.is_overdue && !task.notified && dueDate >= today;
  }) || [];

  const sortedUpcomingTasks = [...upcomingTasks].sort((a, b) => 
    new Date(a.due_date) - new Date(b.due_date)
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Task Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div id="task-chart" className="flex justify-center">
            <div style={{ width: '100%', maxWidth: '300px' }}>
              <ReactApexChart
                options={donutOptions}
                series={donutSeries}
                type="donut"
                height={300}
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center mt-4">
            <div>
              <p className="text-sm text-gray-500">Completed</p>
              <p className="font-bold text-green-600">{taskData?.stats?.completed || 0}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Overdue</p>
              <p className="font-bold text-red-600">{taskData?.stats?.overdue || 0}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Upcoming</p>
              <p className="font-bold text-amber-600">{taskData?.stats?.upcoming || 0}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Upcoming Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          {sortedUpcomingTasks.length === 0 ? (
            <p className="text-gray-500">No upcoming tasks</p>
          ) : (
            <ul className="space-y-3">
              {sortedUpcomingTasks.slice(0, 5).map((task) => (
                <li key={task.id} className="border-b pb-2">
                  <p className="font-medium">{task.title}</p>
                  <div className="flex justify-between text-sm">
                    <span>Session: {task.session_code}</span>
                    <span className={task.is_overdue ? "text-red-500" : "text-amber-500"}>
                      Due: {new Date(task.due_date).toLocaleDateString()}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {sortedUpcomingTasks.length > 5 && (
            <p className="text-right text-sm mt-2 text-blue-600">
              + {sortedUpcomingTasks.length - 5} more tasks
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}