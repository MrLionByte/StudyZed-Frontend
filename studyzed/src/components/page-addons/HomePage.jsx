import React from "react";
import Landingpageimage from '../../assets/landingpageimage.png'

const Hero = () => {

  

  return (
    <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-7xl  px-9 py-5 ">
      <div>
        <h1 className="text-6xl font-bold leading-tight">
          Learn,
          <br /> Grow,
          <br /> Succeed.
        </h1>
        <p className="mt-6 text-lg text-gray-400">
          Learn from the best tutors, Teach with the best tools—
          <br /> StudyZen is here to support your journey.
        </p>
        <div className="mt-8 flex gap-4">
        <button className="px-6 py-3 bg-teal-400 text-black rounded-md border border-teal-400 hover:bg-transparent hover:text-teal-400">
    Start Learning
  </button>
          <button className="px-6 py-3 border rounded-md border-teal-400 hover:bg-teal-400 hover:text-black">
            I'm a Tutor
          </button>
        </div>
      </div>
      <div className="hidden md:block">
        <img
          src={Landingpageimage}
          alt="StudyZen Character Loading"
          className="max-w-sm"
        />
      </div>
    </div>
  );
};

export default Hero;
