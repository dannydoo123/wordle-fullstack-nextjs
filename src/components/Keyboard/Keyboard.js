'use client';

import React from 'react';
import './Keyboard.css';

function Keyboard({ onKeyPress, letterStates }) {
  const rows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
  ];

  // Helper function to determine key class based on state
  const getKeyClass = (key) => {
    if (!letterStates[key]) return '';
    
    switch (letterStates[key]) {
      case 'correct':
        return 'correct-key';
      case 'present':
        return 'present-key';
      case 'absent':
        return 'absent-key';
      default:
        return '';
    }
  };

  return (
    <div className="keyboard">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="keyboard-row">
          {row.map((key) => (
            <button
              key={key}
              className={`keyboard-key ${key.length > 1 ? 'keyboard-key-wide' : ''} ${getKeyClass(key)}`}
              onClick={() => onKeyPress(key)}
            >
              {key === 'BACKSPACE' ? '⌫' : key}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

export default Keyboard;