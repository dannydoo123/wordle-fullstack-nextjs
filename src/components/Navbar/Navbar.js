'use client';

import React, { useState } from 'react';
import './Navbar.css';

function Navbar({ 
  onNewGame, 
  isDarkMode, 
  onToggleDarkMode, 
  isSoundOn, 
  onToggleSound, 
  onToggleHint, 
  isHintActive,
  hintUsed,
  isTimerOn,
  onToggleTimer,
  isTimerAlmostExpired
}) {
  const [showRules, setShowRules] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  const handleShare = () => {
    const text = `I've been playing Wordle! Check it out: ${window.location.href}`;
    if (navigator.share) {
      navigator.share({
        title: 'Wordle Game',
        text: text,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(text)
        .then(() => alert('Link copied to clipboard!'))
        .catch(err => console.error('Failed to copy text: ', err));
    }
  };
  
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <button className="nav-button" onClick={onNewGame}>New Game</button>
        
        <button className="nav-button" onClick={() => setShowRules(!showRules)}>
          How to Play
        </button>
        
        <div className="dropdown">
          <button className="nav-button" onClick={() => setShowSettings(!showSettings)}>
            Settings
          </button>
          {showSettings && (
            <div className="dropdown-content">
              <div className="setting-item">
                <span>Dark Mode</span>
                <label className="switch">
                  <input type="checkbox" checked={isDarkMode} onChange={onToggleDarkMode} />
                  <span className="slider round"></span>
                </label>
              </div>
              <div className="setting-item">
                <span>Sound</span>
                <label className="switch">
                  <input type="checkbox" checked={isSoundOn} onChange={onToggleSound} />
                  <span className="slider round"></span>
                </label>
              </div>
              <div className="setting-item">
                <span>Show Hint {hintUsed ? "(Used)" : "(!)"}</span>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={isHintActive || hintUsed}
                    onChange={onToggleHint}
                    disabled={hintUsed} // Disable toggle if hint was already used
                    aria-label={hintUsed ? "Hint already used" : "Get a hint"}
                  />
                  <span className={`slider round ${hintUsed ? "used" : ""}`}></span>
                </label>
              </div>
              <div className="setting-item">
                <span>Challenge Mode</span>
                <div className="timer-toggle-container" 
                     title={isTimerAlmostExpired ? "Less than 10 seconds left!" : ""}>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={isTimerOn}
                      onChange={onToggleTimer}
                      disabled={isTimerAlmostExpired} // Disable toggle when time is almost up
                      aria-label={isTimerAlmostExpired ? "Timer cannot be turned off with less than 10 seconds remaining" : "Toggle timer"}
                    />
                    <span className={`slider round ${isTimerAlmostExpired ? "timer-critical" : ""}`}></span>
                  </label>
                  {isTimerAlmostExpired && (
                    <div className="timer-tooltip">Cannot disable with less than 10 seconds left!</div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        
        <button className="nav-button" onClick={handleShare}>Share</button>
      </div>
      
      {showRules && (
        <div className="rules-modal">
          <div className="rules-content">
            <h3>How to Play</h3>
            <ul>
              <li>Guess the secret 5-letter word within 6 tries.</li>
              <li>Enter a valid 5-letter word as your guess.</li>
              <li>After submission, tiles change color:
                <ul>
                  <li><span className="green-example">Green</span>: Letter is in the correct position.</li>
                  <li><span className="yellow-example">Yellow</span>: Letter is in the word but wrong position.</li>
                  <li><span className="gray-example">Gray</span>: Letter is not in the word.</li>
                </ul>
              </li>
              <li>Use these clues to guess the word within 6 tries.</li>
              <li>Use the Hint feature for help - it will reveal one correct letter in your next guess, but you can only type 4 letters for that guess.</li>
              <li>You can only use the hint feature once per game.</li>
              <li>In Challenge Mode, you'll have 2 minutes to solve the puzzle. The timer starts when you type your first letter.</li>
              <li>You cannot turn off Challenge Mode when less than 10 seconds remain!</li>
            </ul>
            <button onClick={() => setShowRules(false)}>Close</button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;