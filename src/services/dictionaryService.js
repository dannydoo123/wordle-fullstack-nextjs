/**
 * Fetch word definition from the Dictionary API
 * @param {string} word - The word to lookup
 * @returns {Promise<Object|null>} Word data or null if not found
 */
export const fetchWordDefinition = async (word) => {
    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to fetch word definition:', error);
      return null;
    }
  };