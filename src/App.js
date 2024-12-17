import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [deck, setDeck] = useState([]);
  const [players, setPlayers] = useState([]);
  const [currentRound, setCurrentRound] = useState(1);
  const [trumpCard, setTrumpCard] = useState(null);
  const [bids, setBids] = useState({});
  const [tricks, setTricks] = useState({});
  const [scores, setScores] = useState({});

  // Initialize deck
  const initializeDeck = () => {
    const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const newDeck = [];
    
    for (let suit of suits) {
      for (let value of values) {
        newDeck.push({ suit, value });
      }
    }
    return shuffleDeck(newDeck);
  };

  // Shuffle deck
  const shuffleDeck = (deck) => {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  };

  // Deal cards
  const dealCards = (numCards) => {
    if (deck.length < (numCards * players.length + 1)) {
      console.error('Not enough cards in deck');
      return {};
    }

    const newDeck = [...deck];
    const dealtCards = {};
    
    players.forEach(player => {
      dealtCards[player] = newDeck.splice(0, numCards);
    });

    const trump = newDeck.splice(0, 1)[0];
    setTrumpCard(trump);
    setDeck(newDeck);
    
    return dealtCards;
  };

  // Start new round
  const startNewRound = () => {
    const newDeck = initializeDeck();
    setDeck(newDeck);
    const cardsPerRound = currentRound <= 7 ? currentRound : 13 - currentRound;
    const dealtCards = dealCards(cardsPerRound);
    
    // Initialize tricks and bids for all players
    const initialPlayerState = Object.fromEntries(
      players.map(player => [player, 0])
    );
    setBids(initialPlayerState);
    setTricks(initialPlayerState);
  };

  // Calculate scores
  const calculateScores = () => {
    const newScores = { ...scores };
    
    players.forEach(player => {
      if (bids[player] === tricks[player]) {
        newScores[player] = (newScores[player] || 0) + 10 + tricks[player];
      }
    });
    
    setScores(newScores);
  };

  // Initialize game
  useEffect(() => {
    // Set up initial players (example with 4 players)
    setPlayers(['Player 1', 'Player 2', 'Player 3', 'Player 4']);
    startNewRound();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Oh Hell Card Game</h1>
        <div>Round: {currentRound}</div>
        {trumpCard && (
          <div>Trump Card: {trumpCard.value} of {trumpCard.suit}</div>
        )}
        <div>
          <h2>Scores:</h2>
          {players.map(player => (
            <div key={player}>
              {player}: {scores[player] || 0}
            </div>
          ))}
        </div>
      </header>
    </div>
  );
}

export default App;
