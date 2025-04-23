import axios from 'axios';

class WordList {
  constructor() {
    this.secretWords = [
      'ABOUT', 'ABOVE', 'ABUSE', 'ACTOR', 'ACUTE', 'ADMIT', 'ADOPT', 'ADULT', 'AFTER', 'AGAIN',
      'AGENT', 'AGREE', 'AHEAD', 'ALARM', 'ALBUM', 'ALERT', 'ALIKE', 'ALIVE', 'ALLOW', 'ALONE',
      'ALONG', 'ALTER', 'AMONG', 'ANGER', 'ANGLE', 'ANGRY', 'ANKLE', 'APART', 'APPLE', 'APPLY',
      'ARENA', 'ARGUE', 'ARISE', 'ARRAY', 'ASIDE', 'ASSET', 'AUDIO', 'AUDIT', 'AVOID', 'AWARD',
      'WORLD', 'GAMES', 'STACK', 'NODES', 'BUILD', 'LEVEL', 'PLANE', 'TRACK', 'CODER', 'DEBUG',
      'STYLE', 'MOUNT', 'CRANE', 'SLATE', 'AUDIO', 'HAPPY', 'SMILE', 'DANCE', 'LUNCH', 'BEACH'
    ];
    
    // Cache for validated words to avoid repeated API calls
    this.validatedWords = new Map();
  }

  // Get a random word from the secret words list
  getRandomWord() {
    const randomIndex = Math.floor(Math.random() * this.secretWords.length);
    return this.secretWords[randomIndex];
  }

  // Check if word is valid by calling dictionary APIs
  async isValidWord(word) {
    const upperWord = word.toUpperCase();
    
    // Special case: If the word is in our secret words list, it's valid
    if (this.secretWords.includes(upperWord)) {
      return true;
    }
    
    // Check cache first to avoid redundant API calls
    if (this.validatedWords.has(upperWord)) {
      return this.validatedWords.get(upperWord);
    }
    
    try {
      // First attempt with Free Dictionary API
      const isValid = await this.checkWithDictionaryAPI(word.toLowerCase());
      
      // Cache the result
      this.validatedWords.set(upperWord, isValid);
      
      return isValid;
    } catch (error) {
      console.error(`Error validating word with API: ${error.message}`);
      
      // Fallback to secondary API if the first one fails
      try {
        const isValidWithBackup = await this.checkWithDatamuseAPI(word.toLowerCase());
        
        // Cache the result
        this.validatedWords.set(upperWord, isValidWithBackup);
        
        return isValidWithBackup;
      } catch (secondError) {
        console.error(`Error with backup API: ${secondError.message}`);
        
        // If all APIs fail, check if it's a 5-letter word with vowels
        // This is a lenient fallback when services are down
        const hasBasicWordStructure = /^[a-z]{5}$/i.test(word) && /[aeiouy]/i.test(word);
        
        // Cache the result
        this.validatedWords.set(upperWord, hasBasicWordStructure);
        
        return hasBasicWordStructure;
      }
    }
  }

  // Primary API check using Free Dictionary API
  async checkWithDictionaryAPI(word) {
    try {
      const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`, {
        timeout: 3000
      });
      
      return response.status === 200;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return false;
      }
      throw error;
    }
  }

  // Backup API check using Datamuse
  async checkWithDatamuseAPI(word) {
    try {
      const url = `https://api.datamuse.com/words?sp=${word}&md=d`;
      const response = await axios.get(url, { timeout: 3000 });
      
      if (response.status === 200 && response.data && response.data.length > 0) {
        // Find exact match
        const exactMatch = response.data.find(item => 
          item.word.toLowerCase() === word.toLowerCase()
        );
        
        return !!exactMatch;
      }
      
      return false;
    } catch (error) {
      console.error(`Datamuse API error: ${error.message}`);
      throw error;
    }
  }
}

export default WordList;