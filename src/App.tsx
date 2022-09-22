import React, { useState, useRef, useEffect } from "react";
import Board from "./components/Board/Board";
import Card from "./components/Card/Card";
import { characterList } from "./components/Card/cardCharactersList";

type GameState = "MENU" | "GAME";

// App component
function App() {
  const NUM_OF_CARDS = 15;
  const FLIP_BACK_DELAY = 675;
  const LEVEL_NUM_CARDS = [3, 6, 10, 15, 18, 22, 26, 30]; // how many cards per each stage?

  const [gameState, setGameState] = useState<GameState>("MENU");
  const [cards, setCards] = useState(getCards(NUM_OF_CARDS));
  const [isFlippedArr, setIsFlippedArr] = useState(Array(NUM_OF_CARDS).fill(false, 0));
  const [level, setLevel] = useState(0);

  const correctAnswers = useRef<number[][]>([]);
  const currentGuesses = useRef<number[]>([]);
  const waitingForTimeout = useRef(false);
  const hasWon = useRef(false);

  function shuffle(array: any[]) {
    let currentIndex = array.length;
    let randomIndex = undefined;

    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex); // pick random index
      currentIndex--; // go back one in the list

      // flip the current index and the random index
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }

    return array;
  }

  function getCards(uniqueCardsAmount: number = 12): any[] {
    /*
      1. Shuffle character list
      2. Pick 12 from shuffled list
        push the same card twice
      3. Shuffle chosen cards list
      4. Map chosen cards list to the board.
    */
    const shuffledCharList = shuffle(characterList);

    const cards = shuffle([
      ...shuffledCharList.slice(0, uniqueCardsAmount),
      ...shuffledCharList.slice(0, uniqueCardsAmount),
    ]);
    return cards;
  }

  function handleClick(cardIdx: number) {
    // Disallow input while waiting for flip to turn back.
    if (waitingForTimeout.current) return;

    // Avoid clicking on confirmed or current guessed cards
    if (currentGuesses.current.includes(cardIdx) || isFlippedArr[cardIdx] === true) return;

    // Push guess to current guess.
    currentGuesses.current.push(cardIdx);

    if (currentGuesses.current.length >= 2) {
      const guesses = currentGuesses.current;

      if (cards[guesses[0]] === cards[guesses[1]]) {
        // If the two cards match, leave them, and clear the currentGuesses array.
        currentGuesses.current = [];
        const newCorrectAnswers = [guesses[0], guesses[1]];
        correctAnswers.current.push([...newCorrectAnswers]);

        // If this was the last pair, we have won!
        if (correctAnswers.current.length === LEVEL_NUM_CARDS[level]) hasWon.current = true;
      } else {
        // Set timeout for the card flipping back.
        waitingForTimeout.current = true;
        setTimeout(() => {
          const newArr = [...isFlippedArr];
          currentGuesses.current.forEach((guessIdx) => (newArr[guessIdx] = false));

          setIsFlippedArr(newArr);

          waitingForTimeout.current = false;
          currentGuesses.current = [];
        }, FLIP_BACK_DELAY);
      }
    }

    const arr = [...isFlippedArr];
    arr[cardIdx] = true;

    setIsFlippedArr(arr);
  }

  // Generate the card elements
  const cardsElements = cards.map((card, idx) => {
    return (
      <Card
        key={`${card}_${idx}`}
        char={card}
        isFlipped={isFlippedArr[idx]}
        handleClick={() => handleClick(idx)}
        winAnimIdx={hasWon.current ? idx + 1 : undefined}
        totalCards={LEVEL_NUM_CARDS[level]}
      />
    );
  });

  function levelSelect(levelIndex: number) {
    setCards(getCards(LEVEL_NUM_CARDS[levelIndex]));
    setLevel(levelIndex);
    setIsFlippedArr(Array(NUM_OF_CARDS).fill(false, 0));
    hasWon.current = false;
    correctAnswers.current = [];
    currentGuesses.current = [];
    setGameState("GAME");
  }

  const menu = (
    <div
      className={`menu ${gameState === "GAME" && !hasWon.current ? "hidden" : ""} ${
        hasWon.current ? "game-visible" : ""
      }`}>
      <h2>Level Select</h2>
      <button className="level-btn" onClick={() => levelSelect(0)}>
        Level 一
      </button>
      <button className="level-btn" onClick={() => levelSelect(1)}>
        Level 二
      </button>
      <button className="level-btn" onClick={() => levelSelect(2)}>
        Level 三
      </button>
      <button className="level-btn" onClick={() => levelSelect(3)}>
        Level 四
      </button>
      <button className="level-btn" onClick={() => levelSelect(4)}>
        Level 五
      </button>
    </div>
  );

  return (
    <div className="App">
      <header className="header">{menu}</header>
      <section className="board-container">
        <Board gameState={gameState} hasWon={hasWon.current}>
          {cardsElements}
        </Board>
      </section>
    </div>
  );
}

export default App;
