'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import GameBoard from './Gameboard/GameBoard.js';
import Keyboard from './Keyboard/Keyboard';
import Modal from './Modal/Modal';
import Navbar from './Navbar/Navbar';
import Timer from './Timer/Timer';
import { fetchNewWord, validateGuess } from '../services/gameService';
import { fetchWordDefinition } from '../services/dictionaryService';

function Game() {
  // Game state
  const [secretWord, setSecretWord] = useState('');
  const [guesses, setGuesses] = useState(Array(6).fill(''));
  const [currentGuess, setCurrentGuess] = useState('');
  const [guessIndex, setGuessIndex] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');
  const [letterStates, setLetterStates] = useState({});
  
  // UI state
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  
  // Hint system
  const [isHintActive, setIsHintActive] = useState(false);
  const [hintLetter, setHintLetter] = useState(null);
  const [hintPosition, setHintPosition] = useState(null);
  const [hintUsed, setHintUsed] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hintHistory, setHintHistory] = useState({});
  
  // Word definition
  const [wordDefinition, setWordDefinition] = useState(null);
  
  // Timer state
  const [isTimerOn, setIsTimerOn] = useState(false); // Default is OFF
  const [timeRemaining, setTimeRemaining] = useState(120); // 2 minutes
  const [isTimerAlmostExpired, setIsTimerAlmostExpired] = useState(false);
  
  // Refs - persist across renders
  const timerRef = useRef(null); // To store the timer interval
  const gameActiveRef = useRef(false); // To track if the game is active (user has typed)
  const timerBackgroundRunningRef = useRef(false); // To track if the timer is running in the background
  
  // Start a new game
  const startNewGame = useCallback(async () => {
    try {
      setIsLoading(true);
      const word = await fetchNewWord();
      
      // Stop the timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      // Reset game state
      setSecretWord(word);
      setGuesses(Array(6).fill(''));
      setCurrentGuess('');
      setGuessIndex(0);
      setGameOver(false);
      setGameWon(false);
      setLetterStates({});
      setShowModal(false);
      
      // Reset hint state
      setIsHintActive(false);
      setHintLetter(null);
      setHintPosition(null);
      setHintUsed(false);
      setIsAnimating(false);
      setHintHistory({});
      
      // Reset word definition
      setWordDefinition(null);
      
      // Reset timer state but keep isTimerOn preference
      setTimeRemaining(120);
      setIsTimerAlmostExpired(false);
      
      // Reset interaction tracking
      gameActiveRef.current = false;
      timerBackgroundRunningRef.current = false;
      
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error('Failed to fetch word:', error);
      setMessage('Failed to start new game. Please refresh.');
      setShowModal(true);
    }
  }, []);

  // Initialize game
  useEffect(() => {
    // Start a new game on mount (and whenever startNewGame changes)
    startNewGame();
  
    // Load timer preference from localStorage
    if (typeof window !== 'undefined') { // Check if running in browser
      const saved = localStorage.getItem('isTimerOn');
      if (saved !== null) {
        setIsTimerOn(saved === 'true');
      }
    }
  
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [startNewGame]);

  // Handle timer expiration
  const handleTimerExpired = useCallback(() => {
    // Make sure the timer is stopped
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // Only end the game if the timer is still ON
    if (isTimerOn) {
      setGameOver(true);
      setMessage(`Time's up! The word was ${secretWord}`);
      
      // Fetch word definition
      fetchWordDefinition(secretWord.toLowerCase())
        .then(definition => setWordDefinition(definition))
        .catch(error => console.error('Failed to fetch definition:', error));
      
      setShowModal(true);
    }
  }, [secretWord, isTimerOn]);

  // Function to start/restart the timer
  const startTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerBackgroundRunningRef.current = true;
  
    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          // Only end the game if timer is still active
          if (isTimerOn && !gameOver && !gameWon) {
            handleTimerExpired();
          }
          return 0;
        }
        if (prev <= 11 && !isTimerAlmostExpired) {
          setIsTimerAlmostExpired(true);
        }
        return prev - 1;
      });
    }, 1000);
  }, [isTimerOn, gameOver, gameWon, isTimerAlmostExpired, handleTimerExpired]);
  
  // Handle user interaction that should start the timer
  const handleUserInteraction = useCallback(() => {
    // Skip if game is over or user has already interacted
    if (gameOver || gameWon || gameActiveRef.current) {
      return;
    }
    
    // Mark that the user has interacted with the game
    gameActiveRef.current = true;
    
    // Start the timer if it's enabled
    if (isTimerOn && !timerBackgroundRunningRef.current) {
      startTimer();
    }
  }, [gameOver, gameWon, isTimerOn, startTimer]);
  
  // Handle timer toggle
  const toggleTimer = useCallback(() => {
    // Don't allow toggling if timer is almost expired
    if (isTimerAlmostExpired) {
      return;
    }
    
    const newTimerState = !isTimerOn;
    setIsTimerOn(newTimerState);
    
    // Save preference to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('isTimerOn', newTimerState.toString());
    }
    
    // If turning timer ON and game is active, start timer if it's not already running
    if (newTimerState && gameActiveRef.current && !timerBackgroundRunningRef.current) {
      startTimer();
    }
    
    // If turning timer OFF, don't stop it - just hide it, it continues in the background
  }, [isTimerOn, isTimerAlmostExpired, startTimer]);
  
  // Dark mode effect
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (isDarkMode) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
    }
  }, [isDarkMode]);
  
  // Create audio objects once instead of recreating them each time
const keyAudio = useRef(null);
const tileAudio = useRef(null);
const winAudio = useRef(null);

// Initialize audio objects
useEffect(() => {
  if (typeof window !== 'undefined') {
    keyAudio.current = new Audio('/sounds/key-press.mp3');
    keyAudio.current.volume = 0.3;
    
    tileAudio.current = new Audio('/sounds/tile-flip.mp3');
    tileAudio.current.volume = 0.2;
    
    winAudio.current = new Audio('/sounds/win-sound.mp3');
    winAudio.current.volume = 0.5;
  }
}, []);

  // Sound functions
  const playKeySound = useCallback(() => {
    if (!isSoundOn || typeof window === 'undefined' || !keyAudio.current) return;
    
    // Create a clone to allow overlapping sounds
    const sound = keyAudio.current.cloneNode();
    sound.volume = 0.3;
    sound.play().catch(e => console.log('Audio play failed:', e));
  }, [isSoundOn]);

  const playTileFlipSound = useCallback(() => {
    if (!isSoundOn || typeof window === 'undefined' || !tileAudio.current) return;
    
    const sound = tileAudio.current.cloneNode();
    sound.volume = 0.2;
    sound.play().catch(e => console.log('Audio play failed:', e));
  }, [isSoundOn]);

  const playWinSound = useCallback(() => {
    if (!isSoundOn || typeof window === 'undefined' || !winAudio.current) return;
    
    const sound = winAudio.current.cloneNode();
    sound.volume = 0.5;
    sound.play().catch(e => console.log('Audio play failed:', e));
  }, [isSoundOn]);
  
  // Function called when animation completes
  const handleAnimationComplete = useCallback(async (guess) => {
    setIsAnimating(false);
    
    if (!guess) return;
    
    // Check if the guess matches the secret word
    const isCorrect = guess.toUpperCase() === secretWord.toUpperCase();
    
    if (isCorrect) {
      // Stop the timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      playWinSound();
      setGameWon(true);
      setGameOver(true);
      setMessage(`You won! The word was ${secretWord}`);
      
      // Fetch word definition
      try {
        const definition = await fetchWordDefinition(secretWord.toLowerCase());
        setWordDefinition(definition);
      } catch (error) {
        console.error('Failed to fetch definition:', error);
      }
      
      setShowModal(true);
    } else if (guessIndex >= 6) {
      // Stop the timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      // Game over - loss
      setGameOver(true);
      setMessage(`Game over! The word was ${secretWord}`);
      
      // Fetch word definition
      try {
        const definition = await fetchWordDefinition(secretWord.toLowerCase());
        setWordDefinition(definition);
      } catch (error) {
        console.error('Failed to fetch definition:', error);
      }
      
      setShowModal(true);
    }
  }, [guessIndex, secretWord, playWinSound]);
  
  // Function to generate a hint
  const generateHint = useCallback(() => {
    if (!secretWord || hintUsed) return false;
    
    // Find positions without correct guesses
    const correctPositions = new Set();
    for (let i = 0; i < guessIndex; i++) {
      const guess = guesses[i];
      for (let j = 0; j < guess.length; j++) {
        if (guess[j].toUpperCase() === secretWord[j].toUpperCase()) {
          correctPositions.add(j);
        }
      }
    }
    
    // Get available positions for hints
    const availablePositions = [];
    for (let i = 0; i < secretWord.length; i++) {
      if (!correctPositions.has(i)) {
        availablePositions.push(i);
      }
    }
    
    if (availablePositions.length === 0) {
      setMessage('All letters are already correctly guessed!');
      setShowModal(true);
      return false;
    }
    
    // Randomly select a position
    const randomIndex = Math.floor(Math.random() * availablePositions.length);
    const hintPos = availablePositions[randomIndex];
    const hintLet = secretWord[hintPos];
    
    setHintPosition(hintPos);
    setHintLetter(hintLet);
    setHintUsed(true); // Mark hint as used for this game
    return true;
  }, [guessIndex, guesses, secretWord, hintUsed]);
  
  // Handle toggle hint
  const handleToggleHint = useCallback(() => {
    if (isHintActive || hintUsed) return; // Cannot be deactivated once active, and only one hint per game
    
    if (generateHint()) {
      setIsHintActive(true);
      setCurrentGuess(''); // Reset current guess when hint is activated
    }
  }, [isHintActive, generateHint, hintUsed]);
  
  // Update letter states for keyboard
  const updateLetterStates = useCallback((guess, result) => {
    const newLetterStates = { ...letterStates };
    
    for (let i = 0; i < guess.length; i++) {
      const letter = guess[i].toUpperCase();
      const currentState = newLetterStates[letter];
      const newState = result[i];
      
      // Only update if new state is better than current
      if (!currentState) {
        newLetterStates[letter] = newState;
      } else if (currentState === 'absent' && (newState === 'present' || newState === 'correct')) {
        newLetterStates[letter] = newState;
      } else if (currentState === 'present' && newState === 'correct') {
        newLetterStates[letter] = newState;
      }
    }
    
    setLetterStates(newLetterStates);
  }, [letterStates]);
  
  // Handle form submission of guesses
  const handleSubmit = useCallback(async () => {
    // Don't allow submission during animation
    if (isAnimating) return;
    
    // Trigger user interaction to start timer
    handleUserInteraction();
    
    // Prepare the guess
    let finalGuess = currentGuess;
    
    if (isHintActive) {
      if (currentGuess.length !== 4) {
        setMessage(`With hint active, please enter exactly 4 letters.`);
        setShowModal(true);
        return;
      }
      // Insert hint letter
      let guessParts = currentGuess.split('');
      guessParts.splice(hintPosition, 0, hintLetter);
      finalGuess = guessParts.join('');
    } else if (currentGuess.length !== 5) {
      setMessage('Word must be 5 letters');
      setShowModal(true);
      return;
    }
    
    try {
      setIsLoading(true);
      // Validate guess
      const response = await validateGuess(finalGuess, secretWord);
      setIsLoading(false);
      
      if (!response.valid) {
        setMessage('Not a valid word');
        setShowModal(true);
        return;
      }
      
      // Play tile flip sound
      playTileFlipSound();
      
      // If using a hint, save it to the hint history
      if (isHintActive) {
        setHintHistory(prev => ({
          ...prev,
          [guessIndex]: {
            position: hintPosition,
            letter: hintLetter
          }
        }));
      }
      
      // Reset hint active state (but keep hintUsed)
      setIsHintActive(false);
      
      // Update guesses array
      const newGuesses = [...guesses];
      newGuesses[guessIndex] = finalGuess;
      setGuesses(newGuesses);
      
      // Update keyboard colors
      updateLetterStates(finalGuess, response.result);
      
      // Set animation state
      setIsAnimating(true);
      
      // Increment guess index
      setGuessIndex(guessIndex + 1);
      setCurrentGuess('');
      
    } catch (error) {
      setIsLoading(false);
      console.error('Error validating guess:', error);
      setMessage('Error processing your guess. Please try again.');
      setShowModal(true);
    }
  }, [
    currentGuess,
    guessIndex,
    guesses,
    secretWord,
    playTileFlipSound,
    updateLetterStates,
    isHintActive,
    hintLetter,
    hintPosition,
    isAnimating,
    handleUserInteraction
  ]);
  
  // Handle keyboard input from UI
  const handleKeyPress = useCallback((key) => {
    if (gameOver || gameWon || isLoading || isAnimating) return;
    
    // Try to start the timer on any key press
    handleUserInteraction();
    
    // Play sound for regular keys
    if (isSoundOn) {
      playKeySound();
    }
    
    if (key === 'ENTER') {
      handleSubmit();
    } else if (key === 'BACKSPACE') {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (/^[A-Z]$/.test(key)) {
      // Only allow 4 letters when hint is active (the hint letter is the 5th)
      const maxLength = isHintActive ? 4 : 5;
      if (currentGuess.length < maxLength) {
        setCurrentGuess(prev => prev + key);
      }
    }
  }, [
    currentGuess,
    handleSubmit,
    gameOver,
    gameWon,
    isSoundOn,
    playKeySound,
    isLoading,
    isHintActive,
    isAnimating,
    handleUserInteraction
  ]);
  
  // Handle physical keyboard input
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (showModal || gameOver || gameWon || isLoading || isAnimating) return;
      
      // Try to start the timer on any key press
      handleUserInteraction();
      
      if (isSoundOn) {
        playKeySound();
      }

      if (event.key === 'Enter') {
        handleSubmit();
      } else if (event.key === 'Backspace') {
        setCurrentGuess(prev => prev.slice(0, -1));
      } else if (/^[a-zA-Z]$/.test(event.key)) {
        const key = event.key.toUpperCase();
        const maxLength = isHintActive ? 4 : 5;
        
        if (currentGuess.length < maxLength) {
          setCurrentGuess(prev => prev + key);
          if (isSoundOn) {
            playKeySound();
          }
        }
      }
    };
    
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
    return () => {};
  }, [
    currentGuess,
    handleSubmit,
    gameOver,
    gameWon,
    showModal,
    isSoundOn,
    playKeySound,
    isLoading,
    isHintActive,
    isAnimating,
    handleUserInteraction
  ]);
  
  // Toggle dark mode
  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(!isDarkMode);
  }, [isDarkMode]);
  
  // Toggle sound
  const toggleSound = useCallback(() => {
    setIsSoundOn(!isSoundOn);
  }, [isSoundOn]);
  
  // Close modal
  const closeModal = useCallback(() => {
    setShowModal(false);
  }, []);
  
  return (
    <div className={`app ${isDarkMode ? 'dark-mode' : ''}`}>
      <header>
        <h1>Wordle Game!</h1>
      </header>
      <Navbar
        onNewGame={startNewGame}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        isSoundOn={isSoundOn}
        onToggleSound={toggleSound}
        isHintActive={isHintActive}
        onToggleHint={handleToggleHint}
        hintUsed={hintUsed}
        isTimerOn={isTimerOn}
        onToggleTimer={toggleTimer}
        isTimerAlmostExpired={isTimerAlmostExpired}
      />
      <main>
        <GameBoard
          guesses={guesses}
          currentGuess={currentGuess}
          guessIndex={guessIndex}
          secretWord={secretWord}
          isHintActive={isHintActive}
          hintPosition={hintPosition}
          hintLetter={hintLetter}
          gameWon={gameWon}
          onAnimationComplete={handleAnimationComplete}
          hintHistory={hintHistory}
        />
        
        {/* Only show timer when it's active */}
        {isTimerOn && (
          <Timer
            timeRemaining={timeRemaining}
            totalTime={120}
            isAlmostExpired={isTimerAlmostExpired}
            isDarkMode={isDarkMode}
          />
        )}
        
        <Keyboard
          onKeyPress={handleKeyPress}
          letterStates={letterStates}
        />
        {showModal && (
          <Modal
            message={message}
            onClose={closeModal}
            onNewGame={gameOver || gameWon ? startNewGame : null}
            wordData={wordDefinition}
          />
        )}
        {isLoading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Game;