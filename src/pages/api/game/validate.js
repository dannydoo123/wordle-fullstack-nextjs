import WordList from '../../../lib/models/WordList';
import WordleGame from '../../../lib/models/WordleGame';

// Initialize the word list
const wordList = new WordList();

// Store active games
const activeGames = new Map();

export default async function handler(req, res) {
  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { guess, secretWord, gameId } = req.body;
    
    if (!guess || guess.length !== 5) {
      return res.status(400).json({ error: 'Guess must be 5 letters' });
    }
    
    const upperGuess = guess.toUpperCase();
    
    // Check if the word is valid
    const valid = await wordList.isValidWord(upperGuess);
    
    if (!valid) {
      console.log(`Word "${upperGuess}" is not valid according to dictionary APIs`);
      return res.json({ valid: false });
    }
    
    // Process the guess
    let result = [];
    
    if (gameId && activeGames.has(gameId)) {
      // Use specific game instance
      const game = activeGames.get(gameId);
      const gameResult = game.makeGuess(upperGuess);
      
      if (gameResult.error) {
        return res.status(400).json({ error: gameResult.error });
      }
      
      result = gameResult.result;
      
      // Include game state in response
      return res.json({
        valid: true,
        result,
        gameState: game.getGameState()
      });
    } else if (secretWord) {
      // Use provided secret word for validation
      const upperSecret = secretWord.toUpperCase();
      
      // Create temporary game for evaluation
      const tempGame = new WordleGame(upperSecret);
      const gameResult = tempGame.makeGuess(upperGuess);
      
      return res.json({
        valid: true,
        result: gameResult.result
      });
    } else {
      // Fallback to a default word for testing
      const defaultWord = "REACT";
      const tempGame = new WordleGame(defaultWord);
      const gameResult = tempGame.makeGuess(upperGuess);
      
      return res.json({
        valid: true,
        result: gameResult.result
      });
    }
  } catch (error) {
    console.error('Error validating guess:', error);
    return res.status(500).json({ error: 'Failed to validate guess' });
  }
}