import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const DailyTaskPerformance = ({ attendedTask, totalTask, taskScoreRatio }) => {
  const [attended, setAttended] = useState({
    series: attendedTask,
    options: {
      chart: {
        type: 'donut',
        background: 'transparent',
        foreColor: '#ffffff',
      },
      labels: ['Missed tasks', 'Submitted tasks'],
      colors: ['#FF4560', '#00E396'],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
      dataLabels: {
        style: {
          colors: ['#000000'],
        }
      },
      legend: {
        labels: {
          colors: '#ffffff',
        }
      },
      tooltip: {
        theme: 'dark',
      },
    },
  });

  const [total, setTotal] = useState({
    series: totalTask,
    options: {
      chart: {
        type: 'donut',
        background: 'transparent',
        foreColor: '#ffffff',
      },
      labels: ['No task days', 'Assigned days'],
      colors: ['#FF9F40', '#00E396'],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
      dataLabels: {
        style: {
          colors: ['#000000'],
        }
      },
      legend: {
        labels: {
          colors: '#ffffff',
        }
      },
      tooltip: {
        theme: 'dark',
      },
    },
  });

  const [scoreRatio, setScoreRatio] = useState({
    series: taskScoreRatio,
    options: {
      chart: {
        type: 'donut',
        background: 'transparent',
        foreColor: '#ffffff',
      },
      labels: ['Lost score', 'My score'],
      colors: ['#FF4560', '#00E396'],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
      dataLabels: {
        style: {
          colors: ['#000000'],
        }
      },
      legend: {
        labels: {
          colors: '#ffffff',
        }
      },
      tooltip: {
        theme: 'dark',
      },
    },
  });

  useEffect(() => {
    if (attendedTask) {
      setAttended(prev => ({
        ...prev,
        series: attendedTask
      }));
    }
    if (totalTask) {
      setTotal(prev => ({
        ...prev,
        series: totalTask
      }));
    }
    if (taskScoreRatio) {
      setScoreRatio(prev => ({
        ...prev,
        series: taskScoreRatio
      }));
    }
  }, [attendedTask, totalTask, taskScoreRatio]);

  return (
    <Card className="shadow-md bg-[#002020] border-[#00E396] border p-4">
      <CardHeader>
        <CardTitle className="text-white text-center">
          Task Performance Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#001516] rounded-lg shadow-md p-2">
          <p className="text-white text-center text-sm mb-2">Task Assignment</p>
          <ReactApexChart
            options={total.options}
            series={total.series}
            type="donut"
            height={250}
          />
        </div>
        
        <div className="bg-[#001516] rounded-lg shadow-md p-2">
          <p className="text-white text-center text-sm mb-2">Task Submission</p>
          <ReactApexChart
            options={attended.options}
            series={attended.series}
            type="donut"
            height={250}
          />
        </div>
        
        <div className="bg-[#001516] rounded-lg shadow-md p-2">
          <p className="text-white text-center text-sm mb-2">Score Distribution</p>
          <ReactApexChart
            options={scoreRatio.options}
            series={scoreRatio.series}
            type="donut"
            height={250}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyTaskPerformance;