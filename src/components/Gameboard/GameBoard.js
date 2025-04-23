'use client';

import React, { useState, useEffect } from 'react';
import './GameBoard.css';

function GameBoard({ 
  guesses, 
  currentGuess, 
  guessIndex, 
  secretWord, 
  isHintActive, 
  hintPosition, 
  hintLetter,
  gameWon,
  onAnimationComplete,
  hintHistory // Track which rows had hints
}) {
  // Store which tile has been revealed as a single number (0-4 for columns)
  // -1 means no animation is happening
  const [revealedUpTo, setRevealedUpTo] = useState(-1);
  
  // Function to determine tile color
  const getTileColor = (letter, position, word) => {
    if (!letter || !word) return '';
    
    const upperLetter = letter.toUpperCase();
    const upperWord = word.toUpperCase();
    
    if (upperWord[position] === upperLetter) {
      return 'correct';
    } else if (upperWord.includes(upperLetter)) {
      return 'present';
    } else {
      return 'absent';
    }
  };
  
  // Function to check if a tile should be revealed
  const isTileRevealed = (row, col) => {
    // All tiles in previous rows are revealed
    if (row < guessIndex - 1) return true;
    
    // Current row animation - this is where we control the one-by-one reveal
    // Skip animating the hint letter (it's already visible)
    if (row === guessIndex - 1) {
      // If this was a hint row, we need to check if the current column
      // is where the hint was and skip it
      const wasHintRow = hintHistory && hintHistory[row];
      
      if (wasHintRow && col === hintHistory[row].position) {
        // This is a hint tile, it's already shown
        return true;
      }
      return col <= revealedUpTo;
    }
    
    // Future rows
    return false;
  };
  
  // Effect to handle animations when a new guess is submitted
  useEffect(() => {
    // Reset revealedUpTo when a new game starts
    if (guessIndex === 0) {
      setRevealedUpTo(-1);
      return;
    }
    
    // Only animate if we have guesses
    if (guessIndex <= 0) return;
    
    const rowToAnimate = guessIndex - 1;
    if (!guesses[rowToAnimate]) return;
    
    // Reset revealed to -1 before starting new animation
    setRevealedUpTo(-1);
    
    // Animation timing for each tile
    const animationTimes = [300, 600, 900, 1200, 1500];
    
    // Set up 5 explicit delayed reveals with increasing intervals
    // Use 0-4 for column indices directly
    const timers = animationTimes.map((time, index) => {
      return setTimeout(() => setRevealedUpTo(index), time);
    });
    
    // Add a final timeout to signal that animations are complete
    const completionTimer = setTimeout(() => {
      if (onAnimationComplete) {
        onAnimationComplete(guesses[rowToAnimate]);
      }
    }, animationTimes[animationTimes.length - 1] + 300); // Add a little extra time
    
    // Cleanup
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(completionTimer);
    };
  }, [guessIndex, guesses, onAnimationComplete]);
  
  return (
    <div className="game-board">
      {Array(6).fill().map((_, rowIndex) => {
        // Determine letters to show in this row
        let rowLetters;
        if (rowIndex === guessIndex) {
          // Current input row
          if (isHintActive) {
            // Only show hint in current row
            rowLetters = Array(5).fill('');
            rowLetters[hintPosition] = hintLetter;
            
            // Add current guess letters around hint
            let currentIdx = 0;
            for (let i = 0; i < 5; i++) {
              if (i !== hintPosition && currentIdx < currentGuess.length) {
                rowLetters[i] = currentGuess[currentIdx++];
              }
            }
          } else {
            rowLetters = currentGuess.padEnd(5).split('');
          }
        } else {
          // Past or future rows
          rowLetters = guesses[rowIndex] ? guesses[rowIndex].padEnd(5).split('') : Array(5).fill('');
        }
        
        return (
          <div key={rowIndex} className="board-row">
            {Array(5).fill().map((_, colIndex) => {
              const letter = rowLetters[colIndex] || '';
              
              // Check if this tile should be revealed
              const isRevealed = isTileRevealed(rowIndex, colIndex);
              
              // Check if this is a hint letter (only in current row)
              const isHintLetter = rowIndex === guessIndex && isHintActive && colIndex === hintPosition;
              
              // Check if this is a hint letter from a previous hint row
              const isPreviousHint = hintHistory && 
                                     hintHistory[rowIndex] && 
                                     colIndex === hintHistory[rowIndex].position;
              
              // Only get color for revealed tiles
              let tileStatus = '';
              if (isRevealed || (rowIndex < guessIndex - 1)) {
                tileStatus = getTileColor(letter, colIndex, secretWord);
              }
              
              return (
                <div 
                  key={`${rowIndex}-${colIndex}`} 
                  className={`tile ${(isHintLetter || isPreviousHint) ? 'hint-letter' : ''} ${isRevealed || (rowIndex < guessIndex - 1) ? 'flipped' : ''}`}
                >
                  <div className="tile-inner">
                    <div className="tile-front">
                      {letter}
                    </div>
                    <div className={`tile-back ${tileStatus}`}>
                      {letter}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export default GameBoard;