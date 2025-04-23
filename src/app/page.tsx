'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Use dynamic import to avoid SSR issues with browser-only components
const Game = dynamic(() => import('@/components/Game'), {
  ssr: false,
  loading: () => (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading Wordle Game...</p>
    </div>
  )
});

export default function Home() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      {isClient ? <Game /> : (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading Wordle Game...</p>
        </div>
      )}
    </main>
  );
}