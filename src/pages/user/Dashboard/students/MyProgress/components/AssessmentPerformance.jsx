import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactApexChart from 'react-apexcharts';

const AssessmentPerformance = ({ assessmentData }) => {
  const state = {
    series: [
      { name: 'Marks Obtained', data: assessmentData.marksObtained },
      { name: 'Marks Lost', data: assessmentData.marksLost },
    ],
    options: {
      chart: { type: 'bar', height: 350, stacked: true },
      xaxis: { categories: assessmentData.categories },
      legend: { position: 'right' },
      fill: { opacity: 1 },
    },
  };

  return (
    <div className=" rounded-lg bg-gray-300/70 p-4">
      <h1 className="text-center font-semibold hover:text-emerald-700">
        Assessments Performance
      </h1>
      <ReactApexChart
        className="text-black"
        options={state.options}
        series={state.series}
        type="bar"
        height={350}
      />
    </div>
  );
};

export default AssessmentPerformance;
