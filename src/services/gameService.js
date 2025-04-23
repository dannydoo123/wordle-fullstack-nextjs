// In Next.js, we can use relative paths for API routes
const API_URL = '/api/game';

/**
 * Fetch a new random word from the API
 */
export const fetchNewWord = async () => {
  try {
    const res = await fetch(`${API_URL}/word`);
    if (!res.ok) throw new Error(`Error: ${res.status}`);
    const { word } = await res.json();
    return word;
  } catch (err) {
    console.error('Failed to fetch word:', err);
    return 'REACT';  // local fallback
  }
};

/**
 * Validate a guess against the secret word
 */
export const validateGuess = async (guess, secretWord) => {
  try {
    const res = await fetch(`${API_URL}/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ guess, secretWord }),
    });
    if (!res.ok) throw new Error(`Server returned ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('Error validating guess:', err);
    throw err;
  }
};

/**
 * Check if a word is valid
 */
export const checkWord = async (word) => {
  try {
    const res = await fetch(`${API_URL}/check-word`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ word }),
    });
    if (!res.ok) throw new Error(`Error: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('Error checking word:', err);
    throw err;
  }
};

/**
 * Create a new game
 */
export const createNewGame = async () => {
  try {
    const res = await fetch(`${API_URL}/new`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error(`Error: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('Error creating new game:', err);
    throw err;
  }
};

/**
 * Get the state of a game
 */
export const getGameState = async (gameId) => {
  try {
    const res = await fetch(`${API_URL}/game/${gameId}`);
    if (!res.ok) throw new Error(`Error: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('Error getting game state:', err);
    throw err;
  }
};