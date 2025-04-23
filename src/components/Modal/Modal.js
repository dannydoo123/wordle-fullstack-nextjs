'use client';

import React from 'react';
import './Modal.css';

function Modal({ message, onClose, onNewGame, wordData }) {
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <p className="game-result">{message}</p>
        
        {wordData ? (
          <div className="word-definition">
            <h3>Word Information</h3>
            {wordData[0]?.phonetics?.length > 0 && wordData[0].phonetics.some(p => p.text) && (
              <p className="pronunciation">
                Pronunciation: {wordData[0].phonetics.find(p => p.text)?.text}
              </p>
            )}
            
            {wordData[0]?.meanings?.map((meaning, index) => (
              <div key={index} className="meaning-container">
                <p className="part-of-speech">{meaning.partOfSpeech}</p>
                <div className="definition-list">
                  {meaning.definitions.slice(0, 2).map((def, idx) => (
                    <div key={idx} className="definition-item">
                      <p className="definition-text">{def.definition}</p>
                      {def.example && <p className="example">Example: "{def.example}"</p>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          message.includes("The word was") && (
            <div className="word-definition">
              <p>No additional information available for this word.</p>
            </div>
          )
        )}
        
        <div className="modal-buttons">
          <button onClick={onClose}>Close</button>
          {onNewGame && (
            <button onClick={onNewGame}>New Game</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Modal;