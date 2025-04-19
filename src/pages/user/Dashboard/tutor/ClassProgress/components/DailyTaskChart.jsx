import React, { useState } from 'react';
import Chart from 'react-apexcharts';
import { getStudentByCode } from '../../../components/studentsInSession';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const StudentTaskPerformanceChart = ({ taskPerformance }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // const dummyData = [
  //   {
  //     student_code: 'STU001',
  //     completion_rate: 85,
  //     on_time_rate: 78,
  //     average_score: 91
  //   },
  //   {
  //     student_code: 'STU002',
  //     completion_rate: 60,
  //     on_time_rate: 72,
  //     average_score: 75
  //   },
  //   {
  //     student_code: 'STU003',
  //     completion_rate: 95,
  //     on_time_rate: 90,
  //     average_score: 88
  //   }
  // ];

  // const performanceData = taskPerformance?.length ? taskPerformance : dummyData;
  const performanceData = taskPerformance;

  const filteredStudents = performanceData.filter((student) =>
    student.student_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const studentDetails = getStudentByCode();

  function getStudentNameByCode(studentCode) {
    const matchedStudent = studentDetails.find(
      (student) => student.user_code === studentCode,
    );
    return matchedStudent ? matchedStudent.username : studentCode;
  }

  const chartData = {
    series: [
      {
        name: 'Completion Rate',
        data: filteredStudents.map((student) => student.completion_rate),
      },
      {
        name: 'On-Time Submission Rate',
        data: filteredStudents.map((student) => student.on_time_rate),
      },
      {
        name: 'Average Score',
        data: filteredStudents.map((student) => student.average_score),
      },
    ],
    options: {
      chart: {
        height: 350,
        type: 'bar',
        toolbar: {
          show: true,
        },
        background: 'transparent',
        foreColor: '#ffffff',
      },
      xaxis: {
        categories: filteredStudents.map((student) =>
          getStudentNameByCode(student.student_code),
        ),
        labels: {
          rotate: -45,
          style: {
            fontSize: '12px',
            colors: '#ffffff',
          },
        },
      },
      yaxis: {
        min: 0,
        max: 100,
        title: {
          text: 'Percentage',
          style: {
            color: '#ffffff',
          },
        },
        labels: {
          style: {
            colors: '#ffffff',
          },
        },
      },
      colors: ['#00E396', '#008FFB', '#FF4560'],
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          endingShape: 'rounded',
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent'],
      },
      tooltip: {
        y: {
          formatter: function (value) {
            return `${value.toFixed(2)}%`;
          },
        },
        theme: 'dark',
      },
      grid: {
        borderColor: 'rgba(255, 255, 255, 0.1)',
      },
      legend: {
        labels: {
          colors: '#ffffff',
        },
      },
    },
  };

  return (
    <Card className="shadow-md bg-[#002020] border-[#00E396] border">
      <CardHeader>
        <CardTitle className="text-white">Student Task Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <Input
          type="text"
          placeholder="Search by student code..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4 bg-[#001516] border-[#00E396]/50 text-white placeholder:text-white/60"
        />
        {filteredStudents.length > 0 ? (
          <div className="overflow-x-auto">
            <div style={{ minWidth: `${Math.max(300, filteredStudents.length * 70)}px` }}>
              <Chart
                options={chartData.options}
                series={chartData.series}
                type="bar"
                height={350}
              />
            </div>
          </div>
        ) : (
          <p className="text-white/80">No matching students found.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default StudentTaskPerformanceChart;