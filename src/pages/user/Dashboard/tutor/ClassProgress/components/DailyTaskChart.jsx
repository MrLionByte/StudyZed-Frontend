import React, { useState } from 'react';
import Chart from 'react-apexcharts';
import { getStudentByCode } from '../../../components/studentsInSession';

const StudentTaskPerformanceChart = ({ taskPerformance }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const dummyData = [
    {
      student_code: 'STU001',
      completion_rate: 85,
      on_time_rate: 78,
      average_score: 91
    },
    {
      student_code: 'STU002',
      completion_rate: 60,
      on_time_rate: 72,
      average_score: 75
    },
    {
      student_code: 'STU003',
      completion_rate: 95,
      on_time_rate: 90,
      average_score: 88
    }
  ];

  const performanceData = taskPerformance?.length ? taskPerformance : dummyData;

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
      },
      xaxis: {
        categories: filteredStudents.map((student) =>
          getStudentNameByCode(student.student_code),
        ),
        labels: {
          rotate: -45,
          style: {
            fontSize: '12px',
          },
        },
      },
      yaxis: {
        min: 0,
        max: 100,
        title: {
          text: 'Percentage',
        },
      },
      colors: ['#008FFB', '#00E396', '#FF4560'],
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
      },
    },
  };

  return (
    <div className="p-4 bg-gray-300 bg-opacity-80 text-black shadow-md rounded-lg">
      <h2 className="text-lg font-semibold text-black mb-4">
        Student Task Performance
      </h2>
      <input
        type="text"
        placeholder="Search by student code..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded"
      />
      {filteredStudents.length > 0 ? (
        <div className="overflow-x-auto">
          <div style={{ minWidth: `${filteredStudents.length * 70}px` }}>
            <Chart
              options={chartData.options}
              series={chartData.series}
              type="bar"
              height={350}
              className="text-black"
            />
          </div>
        </div>
      ) : (
        <p className="text-black">No matching students found.</p>
      )}
    </div>
  );
};

export default StudentTaskPerformanceChart;
