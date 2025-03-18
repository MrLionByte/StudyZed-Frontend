import { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';

const DailyTaskPerformance = ({ attendedTask, totalTask, taskScoreRatio }) => {
  console.log(attendedTask, totalTask, taskScoreRatio);

  // useEffect(()=>{
  //     if (attendedTask){
  //         setAttended(attendedTask)
  //     }
  //     if (totalTask){
  //         setTotal(totalTask)
  //     }
  //     if (taskScoreRatio){
  //         setScoreRatio(taskScoreRatio)
  //     }
  // }, [])

  const [attended, setAttended] = useState({
    series: attendedTask,
    options: {
      chart: {
        type: 'donut',
      },
      labels: ['Missed tasks', 'submitted tasks'],
      colors: ['#144eca', '#14ca90'],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: 'middle',
            },
          },
        },
      ],
    },
  });

  const [total, setTotal] = useState({
    series: totalTask,
    options: {
      chart: {
        type: 'donut',
      },
      labels: ['No task days', 'Assigned days'],
      colors: ['#e30f56', '#14ca90'],
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
    },
  });

  const [scoreRatio, setScoreRatio] = useState({
    series: taskScoreRatio,
    options: {
      chart: {
        type: 'donut',
      },
      labels: ['Lost score', 'My score'],
      colors: ['#e30f56', '#14ca90'],
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
    },
  });

  return (
    <div className="grid grid-cols-3 gap-3 p-2 bg-slate-800 rounded-lg overflow-x-auto overflow-y-auto">
      <div
        id="chart"
        className="text-black 
            rounded-lg shadow-md bg-slate-400"
      >
        <ReactApexChart
          className="text-black"
          options={total.options}
          series={total.series}
          type="donut"
        />
      </div>

      <div
        id="chart"
        className="bg-slate-400
            rounded-lg shadow-md"
      >
        <ReactApexChart
          className="text-black"
          options={attended.options}
          series={attended.series}
          type="donut"
        />
      </div>

      <div
        id="chart"
        className="bg-slate-400
            rounded-lg shadow-md"
      >
        <ReactApexChart
          className="text-black"
          options={scoreRatio.options}
          series={scoreRatio.series}
          type="donut"
        />
      </div>
      <div id="html-dist"></div>
    </div>
  );
};

export default DailyTaskPerformance;
