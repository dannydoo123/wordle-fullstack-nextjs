class WordleGame {
    constructor(secretWord) {
      this.secretWord = secretWord.toUpperCase();
      this.guesses = [];
      this.maxGuesses = 6;
      this.won = false;
      this.lost = false;
    }
  
    makeGuess(guess) {
      if (this.isGameOver()) {
        return { error: 'Game is already over' };
      }
  
      if (this.guesses.length >= this.maxGuesses) {
        this.lost = true;
        return { error: 'Maximum guesses reached' };
      }
  
      const upperGuess = guess.toUpperCase();
      
      if (upperGuess.length !== 5) {
        return { error: 'Guess must be 5 letters' };
      }
  
      // Add guess to history
      this.guesses.push(upperGuess);
  
      // Evaluate guess
      const result = this.evaluateGuess(upperGuess);
      
      // Check win condition
      if (upperGuess === this.secretWord) {
        this.won = true;
      } else if (this.guesses.length >= this.maxGuesses) {
        this.lost = true;
      }
  
      return {
        result,
        gameOver: this.isGameOver(),
        won: this.won
      };
    }
  
    evaluateGuess(guess) {
      const result = [];
      const secretLetterCount = {};
      
      // Count letters in secret word
      for (const letter of this.secretWord) {
        secretLetterCount[letter] = (secretLetterCount[letter] || 0) + 1;
      }
      
      // First pass: mark correct positions
      for (let i = 0; i < guess.length; i++) {
        const guessLetter = guess[i];
        
        if (guessLetter === this.secretWord[i]) {
          result[i] = 'correct';
          secretLetterCount[guessLetter]--;
        } else {
          result[i] = null;
        }
      }
      
      // Second pass: mark present or absent
      for (let i = 0; i < guess.length; i++) {
        if (result[i] !== null) continue;
        
        const guessLetter = guess[i];
        
        if (secretLetterCount[guessLetter] && secretLetterCount[guessLetter] > 0) {
          result[i] = 'present';
          secretLetterCount[guessLetter]--;
        } else {
          result[i] = 'absent';
        }
      }
      
      return result;
    }
  
    getGameState() {
      return {
        guesses: this.guesses,
        remainingGuesses: this.maxGuesses - this.guesses.length,
        won: this.won,
        lost: this.lost,
        gameOver: this.isGameOver(),
        secretWord: this.isGameOver() ? this.secretWord : null
      };
    }
  
    isGameOver() {
      return this.won || this.lost;
    }
  }
  
  export default WordleGame;