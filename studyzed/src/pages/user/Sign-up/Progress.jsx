import { useEffect, useState } from "react";
import "react-step-progress-bar/styles.css";
import { ProgressBar, Step } from "react-step-progress-bar";

const StepProgressBar = ({progress}) => {
  const [value, setValue] = useState(0);
  
  useEffect (() => {
    if (progress === 1){
        setValue(1);
    } else if (progress === 2){
      setValue(50);
    } else if (progress === 3){
      setValue(100);
    } else {
      setValue(0);
    } }, [progress]);
  
 
  return (
    <ProgressBar
      percent={value}
      filledBackground="gray-300"
      unfilledBackground="#e5e7eb"
      
    >
      <Step transition="scale">
        {({ accomplished }) => (
          <div className="flex flex-col items-center">
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center ${
                accomplished ? "bg-blue-500" : "bg-gray-300"
              }`}
            >
             
            </div>
          </div>
        )}
      </Step>
      <Step transition="scale" >
        {({ accomplished }) => (
          <div className="flex flex-col items-center">
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center ${
                accomplished ? "bg-blue-500" : "bg-gray-300"
              }`}
            >
            
            </div>
          </div>
        )}
      </Step>
      <Step transition="scale">
        {({ accomplished }) => (
          <div className="flex flex-col items-center">
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center ${
                accomplished ? "bg-blue-500" : "bg-gray-300"
              }`}
            >
            
            </div>
          </div>
        )}
      </Step>
    </ProgressBar>
  );
};

export default StepProgressBar;
