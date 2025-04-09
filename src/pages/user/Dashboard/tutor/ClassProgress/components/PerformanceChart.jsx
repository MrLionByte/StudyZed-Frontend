import { LucideSquareArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { getStudentByCode } from '../../../components/studentsInSession';

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
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
      },
      xaxis: {
        type: 'category',
        categories: [],
      },
      yaxis: {
        min: 0,
        max: undefined,
        labels: {
          formatter: function (value) {
            return value.toFixed(0);
          },
        },
      },
      tooltip: {
        x: {
          format: 'MMMM dd, yyyy',
        },
      },
      colors: [
        '#FF4560',
        '#008FFB',
        '#00E396',
        '#775DD0',
        '#FEB019',
        '#FF6384',
        '#36A2EB',
        '#4BC0C0',
        '#9966FF',
        '#FF9F40',
        '#FFCD56',
        '#4D4D4D',
        '#F7464A',
        '#46BFBD',
        '#FDB45C',
        '#949FB1',
        '#8A2BE2',
        '#A52A2A',
        '#DEB887',
        '#5F9EA0',
        '#7FFF00',
        '#D2691E',
        '#FF7F50',
        '#6495ED',
        '#DC143C',
        '#00FFFF',
        '#00008B',
        '#008B8B',
        '#B8860B',
        '#A9A9A9',
        '#006400',
        '#BDB76B',
        '#8B008B',
        '#556B2F',
        '#FF8C00',
        '#9932CC',
        '#8B0000',
        '#E9967A',
        '#8FBC8F',
        '#483D8B',
        '#2F4F4F',
        '#00CED1',
        '#9400D3',
        '#FF1493',
        '#00BFFF',
        '#696969',
        '#1E90FF',
        '#B22222',
        '#228B22',
        '#FFD700',
        '#DAA520',
        '#808080',
        '#008000',
        '#ADFF2F',
        '#FF69B4',
        '#CD5C5C',
        '#4B0082',
        '#F0E68C',
        '#E6E6FA',
        '#7CFC00',
        '#FFFACD',
        '#ADD8E6',
        '#F08080',
        '#E0FFFF',
        '#FAFAD2',
        '#D3D3D3',
        '#90EE90',
        '#FFB6C1',
        '#FFA07A',
        '#20B2AA',
        '#87CEFA',
        '#778899',
        '#B0C4DE',
        '#FFFFE0',
        '#00FF00',
      ],
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
    setFetchFromBackend(true);
  };

  return (
    <div className="p-4 bg-gray-300 bg-opacity-80 text-white shadow-md rounded-lg">
      <div className="flex items-center justify-start">
        <button
          onClick={handleLastMonth}
          className="text-black mr-2 hover:text-red-500"
        >
          <LucideSquareArrowLeft />
        </button>
        <h5 className="text-lg text-black ">
          month of
          <span className="text-black font-semibold ml-2">
            {Months[assessmentPerformance.month]}-{assessmentPerformance.year}
          </span>
        </h5>
      </div>
      <h2 className="text-lg font-semibold text-center">
        Assessment Performance
      </h2>
      {chartData.series.length > 0 ? (
        <Chart
          options={chartData.options}
          series={chartData.series}
          type="area"
          height={350}
          className="text-black"
        />
      ) : (
        <p className="text-black">No data available.</p>
      )}
    </div>
  );
};

export default StudentPerformanceChart;
