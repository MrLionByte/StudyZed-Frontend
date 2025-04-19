import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { getStudentByCode } from '../../../components/studentsInSession';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const StudentPerformanceChart = ({ assessmentPerformance = [] }) => {
  const studentDetails = getStudentByCode();

  function getStudentNameByCode(studentCode) {
    const matchedStudent = studentDetails.find(
      (student) => student.user_code === studentCode,
    );
    return matchedStudent ? matchedStudent.username : studentCode;
  }

  const [chartData, setChartData] = useState({
    series: [],
    options: {
      chart: {
        height: 350,
        type: 'area',
        background: 'transparent',
        foreColor: '#ffffff',
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
        width: 2,
      },
      xaxis: {
        type: 'category',
        categories: [],
        labels: {
          style: {
            colors: '#ffffff',
          },
        },
      },
      yaxis: {
        min: 0,
        max: undefined,
        labels: {
          formatter: function (value) {
            return value.toFixed(0);
          },
          style: {
            colors: '#ffffff',
          },
        },
      },
      tooltip: {
        x: {
          format: 'MMMM dd, yyyy',
        },
        theme: 'dark',
      },
      grid: {
        borderColor: 'rgba(255, 255, 255, 0.1)',
        row: {
          colors: ['transparent', 'rgba(255, 255, 255, 0.03)'],
        },
      },
      colors: [
        '#00E396', '#00D4FF', '#FF9F40', '#775DD0', '#FEB019', 
        '#FF6384', '#36A2EB', '#4BC0C0', '#9966FF', '#FF4560'
      ],
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.3,
        }
      },
      legend: {
        labels: {
          colors: '#ffffff',
        },
      },
    },
  });

  const Months = {
    1: 'January',
    2: 'February',
    3: 'March',
    4: 'April',
    5: 'May',
    6: 'June',
    7: 'July',
    8: 'August',
    9: 'September',
    10: 'October',
    11: 'November',
    12: 'December',
  };

  const transformData = (data) => {
    return data.map((student) => ({
      name: getStudentNameByCode(student.name),
      data: student.data,
    }));
  };

  useEffect(() => {
    const dummyAssessmentPerformance = {
      month: 4,
      year: 2025,
      data: [
        {
          name: 'STU001',
          data: [78, 82, 91, 85],
        },
        {
          name: 'STU002',
          data: [65, 74, 69, 73],
        },
        {
          name: 'STU003',
          data: [88, 90, 86, 92],
        },
      ],
    };
  
    const finalPerformance = assessmentPerformance.data?.length
      ? assessmentPerformance
      : dummyAssessmentPerformance;
  
    const transformedData = transformData(finalPerformance.data);
    const uniqueAssessments = finalPerformance.data[0]?.data.map((_, index) => `Assessment ${index + 1}`) || [];

    setChartData((prev) => ({
      ...prev,
      series: transformedData,
      options: {
        ...prev.options,
        xaxis: {
          ...prev.options.xaxis,
          categories: uniqueAssessments,
        },
      },
    }));
  }, [assessmentPerformance.data]);

  const handleLastMonth = () => {
    const currentMonth = parseInt(assessmentPerformance.month);
    const newMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    // setFetchFromBackend(true); // This function seems to be missing from original code
  };

  return (
    <Card className="shadow-md bg-[#002020] border-[#00E396] border">
      <CardHeader className="flex flex-row items-center space-y-0 pb-2">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleLastMonth}
            className="mr-2 hover:text-[#00E396] text-white"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <CardTitle className="text-white">
            Assessment Performance 
            <span className="font-medium text-white/60 ml-2">
              {Months[assessmentPerformance.month]}-{assessmentPerformance.year}
            </span>
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {chartData.series.length > 0 ? (
          <Chart
            options={chartData.options}
            series={chartData.series}
            type="area"
            height={350}
          />
        ) : (
          <p className="text-white/80">No data available.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default StudentPerformanceChart;