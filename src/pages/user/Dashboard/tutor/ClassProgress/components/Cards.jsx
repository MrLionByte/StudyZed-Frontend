import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import Chart from 'react-apexcharts';

const ProgressCardDashboard = ({ studentTasks }) => {
  const calculateMetrics = (tasks) => {
    const completed = tasks?.filter((t) => t.score !== null);
    const total = tasks?.length;
    const late = tasks?.filter((t) => t.is_late_submission);
    const avgScore =
      completed?.length > 0
        ? (
            completed?.reduce((sum, t) => sum + (t.score || 0), 0) /
            completed?.length
          ).toFixed(2)
        : '0';

    return {
      completionRate: ((completed?.length / total) * 100).toFixed(1),
      averageScore: avgScore,
      lateSubmissions: ((late?.length / total) * 100).toFixed(1),
    };
  };

  const groupedData = {
    high: studentTasks?.filter(
      (student) => calculateMetrics(student.tasks).completionRate >= 80,
    ),
    medium: studentTasks?.filter(
      (student) =>
        calculateMetrics(student.tasks).completionRate >= 50 &&
        calculateMetrics(student.tasks).completionRate < 80,
    ),
    low: studentTasks?.filter(
      (student) => calculateMetrics(student.tasks).completionRate < 50,
    ),
  };

  const chartData = {
    series: [
      {
        name: 'High Performers',
        data: [
          groupedData?.high?.reduce(
            (sum, student) =>
              sum + Number(calculateMetrics(student.tasks).completionRate),
            0,
          ) / groupedData?.high?.length || 0,
          groupedData?.high?.reduce(
            (sum, student) =>
              sum + Number(calculateMetrics(student.tasks).averageScore),
            0,
          ) / groupedData?.high?.length || 0,
          groupedData?.high?.reduce(
            (sum, student) =>
              sum + Number(calculateMetrics(student.tasks).lateSubmissions),
            0,
          ) / groupedData?.high?.length || 0,
        ],
      },
      {
        name: 'Medium Performers',
        data: [
          groupedData?.medium?.reduce(
            (sum, student) =>
              sum + Number(calculateMetrics(student.tasks).completionRate),
            0,
          ) / groupedData?.medium?.length || 0,
          groupedData?.medium?.reduce(
            (sum, student) =>
              sum + Number(calculateMetrics(student.tasks).averageScore),
            0,
          ) / groupedData?.medium?.length || 0,
          groupedData?.medium?.reduce(
            (sum, student) =>
              sum + Number(calculateMetrics(student.tasks).lateSubmissions),
            0,
          ) / groupedData?.medium?.length || 0,
        ],
      },
      {
        name: 'Low Performers',
        data: [
          groupedData?.low?.reduce(
            (sum, student) =>
              sum + Number(calculateMetrics(student.tasks).completionRate),
            0,
          ) / groupedData?.low?.length || 0,
          groupedData?.low?.reduce(
            (sum, student) =>
              sum + Number(calculateMetrics(student.tasks).averageScore),
            0,
          ) / groupedData?.low?.length || 0,
          groupedData?.low?.reduce(
            (sum, student) =>
              sum + Number(calculateMetrics(student.tasks).lateSubmissions),
            0,
          ) / groupedData?.low?.length || 0,
        ],
      },
    ],
    options: {
      chart: {
        height: 350,
        type: 'bar',
        background: '#2d2d2d',
        foreColor: '#e0e0e0',
      },
      xaxis: {
        categories: ['Completion Rate', 'Average Score', 'Late Submissions'],
      },
      yaxis: {
        min: 0,
        max: 100,
        title: {
          text: 'Percentage',
          style: {
            color: '#e0e0e0',
          },
        },
      },
      colors: ['#00E396', '#FFB019', '#FF4560'],
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
      theme: {
        mode: 'dark',
      },
    },
  };

  return (
    <div className="space-y-8 p-4 bg-[#1a1a1a] rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {studentTasks?.map((student, index) => {
          const metrics = calculateMetrics(student.tasks);
          const trendIcon =
            Number(metrics.completionRate) > 80 ? TrendingUp : TrendingDown;
          const trendColor =
            Number(metrics.completionRate) > 80
              ? 'text-[#4CAF50]'
              : 'text-[#FF5252]';

          return (
            <Card
              key={index}
              className="bg-[#2d2d2d] border-[#404040] shadow-none"
            >
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-[#e0e0e0]">
                  {student.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="border-[#666666] text-[#e0e0e0] bg-transparent"
                      >
                        Completion
                      </Badge>
                      <span className="text-sm font-medium text-[#e0e0e0]">
                        {metrics.completionRate}%
                      </span>
                    </div>
                    <Progress
                      value={Number(metrics.completionRate)}
                      className="w-1/2 h-2 bg-[#404040]"
                    />
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#b3b3b3]">
                    {Number(metrics.completionRate) > 80 ? (
                      <TrendingUp className={trendColor} size={16} />
                    ) : (
                      <TrendingDown className={trendColor} size={16} />
                    )}
                    <span>Trend</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="border-[#666666] text-[#e0e0e0] bg-transparent"
                      >
                        Average Score
                      </Badge>
                      <span className="text-sm font-medium text-[#e0e0e0]">
                        {metrics.averageScore}
                      </span>
                    </div>
                    <AlertCircle className="text-[#ffb74d] size-16" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="border-[#666666] text-[#e0e0e0] bg-transparent"
                      >
                        Late Submissions
                      </Badge>
                      <span className="text-sm font-medium text-[#e0e0e0]">
                        {metrics.lateSubmissions}%
                      </span>
                    </div>
                    <Progress
                      value={Number(metrics.lateSubmissions)}
                      className="w-1/2 h-2 bg-[#404040]"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="bg-[#2d2d2d] p-4 rounded-lg">
        <h2 className="text-xl font-semibold text-[#e0e0e0] mb-4">
          Performance Overview by Group
        </h2>
        <Chart
          options={chartData.options}
          series={chartData.series}
          type="bar"
          height={350}
        />
      </div>
    </div>
  );
};

export default ProgressCardDashboard;
