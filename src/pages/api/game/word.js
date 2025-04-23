import WordList from '../../../lib/models/WordList';

// Initialize the word list
const wordList = new WordList();

export default function handler(req, res) {
  try {
    // Only allow GET requests
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // Get a random word
    const word = wordList.getRandomWord();
    
    // Return the word
    return res.status(200).json({ word });
  } catch (error) {
    console.error('Error in word API route:', error);
    
    // Return a fallback word in case of error
    return res.status(200).json({ word: 'REACT' });
  }
}