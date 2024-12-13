import React from 'react';

const SessionPage = () => {
  return (
    <div className="min-h-screen text-white">
      <nav className="flex justify-between items-center px-8 py-4">
        <div className="text-lg font-bold">StudyZen</div>
        <ul className="flex space-x-8">
          <li><a href="#" className="hover:text-teal-300">Home</a></li>
          <li><a href="#" className="hover:text-teal-300">About Us</a></li>
          <li><a href="#" className="hover:text-teal-300">FAQ</a></li>
        </ul>
        <div className="space-y-1">
          <span className="block w-6 h-0.5 bg-white"></span>
          <span className="block w-6 h-0.5 bg-white"></span>
          <span className="block w-6 h-0.5 bg-white"></span>
        </div>
      </nav>

      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="border border-teal-500 p-6 rounded-md bg-black/80 shadow-md">
          <p className="text-xl font-semibold">Session By:</p>
          <p className="text-lg">Farhan</p>
          <p className="text-xl font-semibold mt-4">Session:</p>
          <p className="text-lg">EEE</p>
        </div>
      </div>
    </div>
  );
};

export default SessionPage;
