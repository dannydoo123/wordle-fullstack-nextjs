import WordList from '../../../lib/models/WordList';
import WordleGame from '../../../lib/models/WordleGame';

// Initialize the word list
const wordList = new WordList();

// Store active games (in memory - would use a database in production)
const activeGames = new Map();

// Clean up old games every hour
const cleanUpInterval = 60 * 60 * 1000; // 1 hour in milliseconds

// Only set up the interval if we're in a Node.js environment
if (typeof process !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    const oneHourAgo = now - cleanUpInterval;
    
    for (const [gameId, game] of activeGames.entries()) {
      // Remove games older than 1 hour or completed games
      if (parseInt(gameId) < oneHourAgo || game.isGameOver()) {
        activeGames.delete(gameId);
      }
    }
  }, 15 * 60 * 1000); // Run every 15 minutes
}

export default function handler(req, res) {
  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const gameId = Date.now().toString();
    const word = wordList.getRandomWord();
    const game = new WordleGame(word);
    
    activeGames.set(gameId, game);
    
    res.json({
      gameId,
      remainingGuesses: game.maxGuesses
    });
  } catch (error) {
    console.error('Error creating new game:', error);
    res.status(500).json({ error: 'Failed to create new game' });
  }
}