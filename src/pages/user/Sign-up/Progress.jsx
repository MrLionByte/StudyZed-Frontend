import React, { useEffect, useState } from 'react';
import 'react-step-progress-bar/styles.css';
import { ProgressBar, Step } from 'react-step-progress-bar';
import { Progress } from '@/components/ui/progress';

const StepProgressBar = ({ progress }) => {
  const [progress, setProgress] = useState(0);


  useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500);
    return () => clearTimeout(timer);
  }, []);

  return (

    <Progress value={progress} className="w-[60%]" />
  );
};

export default StepProgressBar;
