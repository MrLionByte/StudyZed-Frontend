import React, { useState, useEffect } from 'react';

const NotFound = () => {
  const [excuse, setExcuse] = useState(0);
  const [bounce, setBounce] = useState(false);
  const [characterMood, setCharacterMood] = useState('pleading');
  
  const excuses = [
    "This page is playing hide and seek (and winning)",
  ];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setBounce(true);
      setTimeout(() => setBounce(false), 500);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b to-black text-white p-4 overflow-hidden">
      <div className="text-center relative z-10">
        <h1 
          className={`text-9xl font-bold text-red-500 mb-2 transition-all duration-500 ${bounce ? 'animate-bounce' : ''}`}
          style={{ textShadow: '4px 4px 0px rgba(0,0,0,0.5)' }}
        >
          404
        </h1>
        
        <p className="text-xl mb-8 animate-pulse">The page you're looking for doesn't exist.</p>
        
        <div>
          <img src="" alt="" />
        </div>
        
        <div className="mb-8 p-6 bg-emerald-300/10 rounded-lg backdrop-blur-sm max-w-md mx-auto animate-fade-in">
          <p className="text-lg italic">"{excuses[excuse]}"</p>
          <p className="mt-4 text-sm">Please forgive our developer, they're trying their best!</p>
        </div>
        
        <div className="flex flex-col items-center gap-6">
          
          <a 
            href="/" 
            className="underline text-red-400 hover:text-red-300 transition-colors"
          >
            Take me back to a page that exists
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;