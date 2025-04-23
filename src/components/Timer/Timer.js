'use client';

import React from 'react';
import './Timer.css';

function Timer({ timeRemaining, totalTime, isAlmostExpired, isDarkMode }) {
  // Calculate percentage of time remaining - ensure it's between 0 and 100
  const percentRemaining = Math.max(0, Math.min(100, (timeRemaining / totalTime) * 100));
  
  // Format time remaining as MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(Math.max(0, seconds) / 60);
    const remainingSeconds = Math.max(0, seconds) % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="timer-container">
      <div className="timer-label">
        {formatTime(timeRemaining)}
      </div>
      <div className="timer-bar-container">
        <div 
          className={`timer-bar ${isAlmostExpired ? 'almost-expired' : ''} ${isDarkMode ? 'dark-mode' : ''}`} 
          style={{ width: `${percentRemaining}%` }}
        ></div>
      </div>
    </div>
  );
}

export default Timer;