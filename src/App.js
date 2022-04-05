import React, { useState, useEffect } from 'react';
import Header from './components/container/Header';
import LoadingPage from './components/LoadingPage/LoadingPage';
import { board } from './components/Board/defaultBoard';
import Board from './components/Board/Board';
import Keyboard from './components/Keyboard/Keyboard';
import BoardContext from './components/store/board-context';

import useAsync from './hooks/useAsync'
import axios from 'axios';

async function getWords(difficulty) {
  const response = await axios.get('https://random-word-api.herokuapp.com/word?number=10');
  const filteredWords = await response.data.filter((item) => item.length === difficulty);
  if (filteredWords.length === 0) {
    throw new Error('no words. try again');
  }
  return filteredWords;
}


function App() {
  const [difficulty, setDifficulty] = useState(null);
  const [word, setWord] = useState('');
  const [currentBoard, setCurrentBoard] = useState([]);
  const [currentPos, setCurrentPos] = useState({ attempt: 0, letterPos: 0 });
  const [gameStart, setGameStart] = useState(false);
  const [gameEnd, setGameEnd] = useState(false);

  const [state, refetch] = useAsync(() => getWords(difficulty), [difficulty], true, setGameStart, setWord);
  const { loading, error } = state;






  // need to update when user select the level of difficulty.
  useEffect(() => {
    const defaultBoard = board(5, word.split('').length);
    setCurrentBoard(defaultBoard);
  }, [word, gameStart]);

  const wordHandler = (word) => {
    setWord(word);
    // gameHandler(true);
  }

  // Back to the main page where user can choose the level of difficulty.
  const resetGame = () => {
    setGameStart(false);
    setCurrentPos((prev) => ({
      attempt: 0, letterPos: 0
    }));
    // setWord('');
    setGameEnd(false);
  }

  // This function will make a new game with same level of difficulty that user choose before. 
  // and also reset the current attempts and letter of position. (clean board)
  const newGameHandler = () => {
    refetch().then(() => {
      setCurrentPos((prev) => ({
        attempt: 0, letterPos: 0
      }))
      // if (currentPos.attempt === 5 || givenWord.toLowerCase() === currentBoard[currentPos.attempt].join('').toLowerCase())

    });

    setGameEnd(false);
  }

  // When user hit the enter or click enter key from screen, check the answer with user's guess.
  const onEnter = () => {
    const newBoard = [...currentBoard];
    if (currentPos.letterPos !== word.length) return;  //need to add errorhandler

    // when user got the correct answer, escape the game?
    if (word.toLowerCase() === currentBoard[currentPos.attempt].join('').toLowerCase() || currentPos.attempt === 4) {
      setGameEnd(true);
      console.log('game end')
    }
    // If there are more attempts left, reset the letter position as 0 and add attempt.
    let newPos = {};
    newPos = {
      attempt: currentPos.attempt + 1,
      letterPos: 0
    }
    setCurrentPos(newPos);
    setCurrentBoard(newBoard);
  }

  //if user hit the delete, remove current letter and letter position update previous position.
  const onDelete = () => {
    const newBoard = [...currentBoard];
    if (currentPos.letterPos === 0) return;

    newBoard[currentPos.attempt][currentPos.letterPos - 1] = '';
    setCurrentBoard(newBoard);

    let newPos = {};
    newPos = {
      attempt: currentPos.attempt,
      letterPos: currentPos.letterPos - 1
    }
    setCurrentPos(newPos);

  }

  const onSelectLetter = (text) => {

    if (!gameEnd) {
      const newBoard = [...currentBoard];
      // check if the current letter position is reaching the length of the word or current attempt
      if (currentPos.letterPos > word.length - 1 || currentPos.attempt === 5) {
        // need to add errorhandler
        return;
      }
      newBoard[currentPos.attempt][currentPos.letterPos] = text;
      setCurrentBoard(newBoard);

      let newPos = {};
      newPos = {
        attempt: currentPos.attempt,
        letterPos: currentPos.letterPos + 1
      }

      setCurrentPos(newPos);

    }

  }

  return (

    <div className="App">
      <Header />
      <BoardContext.Provider value={{
        currentBoard,
        setCurrentBoard,
        currentPos,
        setCurrentPos,
        onEnter,
        onDelete,
        onSelectLetter,
        word,
        setWord,
        difficulty,
        setDifficulty,
        wordHandler,
        loading, error, refetch

      }}>
        <main>
          {gameEnd &&
            <div>
              <h2>Game End</h2>
              <h2>Word : {word}</h2>
              <button onClick={newGameHandler}>Try again with new word!</button>
              <button onClick={resetGame}>Back to main page</button>
            </div>}
          {!gameStart && <LoadingPage />}

          {gameStart &&
            <>
              <section>
                {loading && <p>Loading...</p>}
                {error && <div>
                  <p>Error occur during api call. Please try again</p>
                  <button onClick={refetch}>Try again</button>
                </div>}
                <Board />
                <Keyboard />
              </section>
            </>}
        </main>

      </BoardContext.Provider>
    </div>
  );
}

export default App;
