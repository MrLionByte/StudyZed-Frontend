import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AssessmentPerformance = ({ assessmentData }) => {
  const state = {
    series: [
      { name: 'Marks Obtained', data: assessmentData.marksObtained },
      { name: 'Marks Lost', data: assessmentData.marksLost },
    ],
    options: {
      chart: { 
        type: 'bar', 
        height: 350, 
        stacked: true,
        background: 'transparent',
        foreColor: '#ffffff',
      },
      xaxis: { 
        categories: assessmentData.categories,
        labels: {
          style: {
            colors: '#ffffff',
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: '#ffffff',
          }
        }
      },
      legend: { 
        position: 'right',
        labels: {
          colors: '#ffffff',
        }
      },
      fill: { 
        opacity: 1 
      },
      colors: ['#00E396', '#FF4560'],
      grid: {
        borderColor: 'rgba(255, 255, 255, 0.1)',
      },
      tooltip: {
        theme: 'dark',
      },
    },
  };

  return (
    <Card className="shadow-md bg-[#002020] border-[#00E396] border">
      <CardHeader>
        <CardTitle className="text-white text-center hover:text-[#00E396] transition-colors">
          Assessments Performance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ReactApexChart
          className="text-black"
          options={state.options}
          series={state.series}
          type="bar"
          height={350}
        />
      </CardContent>
    </Card>
  );
};

export default AssessmentPerformance;