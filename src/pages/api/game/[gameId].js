const activeGames = new Map();

export default function handler(req, res) {
  try {
    // Only allow GET requests
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { gameId } = req.query;
    
    if (!activeGames.has(gameId)) {
      return res.status(404).json({ error: 'Game not found' });
    }
    
    const game = activeGames.get(gameId);
    res.json(game.getGameState());
  } catch (error) {
    console.error('Error getting game state:', error);
    res.status(500).json({ error: 'Failed to get game state' });
  }
}