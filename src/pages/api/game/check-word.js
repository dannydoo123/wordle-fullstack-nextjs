import WordList from '../../../lib/models/WordList';

// Initialize the word list
const wordList = new WordList();

export default async function handler(req, res) {
  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { word } = req.body;
    
    if (!word || word.length !== 5) {
      return res.status(400).json({ error: 'Word must be 5 letters' });
    }
    
    const valid = await wordList.isValidWord(word);
    
    res.json({ 
      valid,
      word: word.toUpperCase()
    });
  } catch (error) {
    console.error('Error checking word:', error);
    res.status(500).json({ error: 'Failed to check word' });
  }
}