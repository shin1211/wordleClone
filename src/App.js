import React, { useState, useEffect } from 'react';
import { board } from './components/Board/defaultBoard';
import Board from './components/Board/Board';
import Keyboard from './components/Keyboard/Keyboard';
import BoardContext from './components/store/board-context';



function App() {
  let givenWord = 'hello';
  let defaultBoard = board(5, givenWord.split('').length);
  const [currentBoard, setCurrentBoard] = useState(defaultBoard);
  const [currentPos, setCurrentPos] = useState({ attempt: 0, letterPos: 0 });
  const [gameEnd, setGameEnd] = useState(false);



  const newGameHandler = () => {
    setCurrentBoard(defaultBoard);
    setCurrentPos((prev) => ({
      attempt: 0, letterPos: 0
    }))

    // if (currentPos.attempt === 5 || givenWord.toLowerCase() === currentBoard[currentPos.attempt].join('').toLowerCase())
    setGameEnd(false);
    // need new givenword and clean board
  }

  const onEnter = () => {
    // console.log(currentPos)
    const newBoard = [...currentBoard];
    if (currentPos.letterPos !== newBoard[0].length) return;  //need to add errorhandler

    // when user got the correct answer, escape the game?
    if (givenWord.toLowerCase() === currentBoard[currentPos.attempt].join('').toLowerCase() || currentPos.attempt === 4) {
      setGameEnd(true);
      console.log('game end')
    }

    let newPos = {};
    newPos = {
      attempt: currentPos.attempt + 1,
      letterPos: 0
    }
    setCurrentPos(newPos);

    setCurrentBoard(newBoard);

    // setCurrentPos(prev => ({
    //   ...prev,
    //   attempt: prev.attempt++,
    //   letterPos: 0
    // }))
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

    // setCurrentPos((prev) => ({
    //   ...prev,
    //   letterPos: prev.letterPos--
    // }))
  }

  const onSelectLetter = (text) => {

    if (!gameEnd) {
      const newBoard = [...currentBoard];
      // check if the current letter position is reaching the length of the word or current attempt
      if (currentPos.letterPos > newBoard[0].length - 1 || currentPos.attempt === 5) {
        // need to add errorhandler

        return;
      }
      newBoard[currentPos.attempt][currentPos.letterPos] = text;
      setCurrentBoard(newBoard);

      let newPos = {};
      newPos = {
        letterPos: currentPos.letterPos + 1
      }

      setCurrentPos((prev) => ({
        ...prev,
        ...newPos
      }));

      // setCurrentPos((prev) => ({
      //   ...prev,
      //   letterPos: prev.letterPos + 1
      // }))
    }


  }

  return (

    <div className="App">
      <h1>wordle</h1>
      <BoardContext.Provider value={{
        currentBoard,
        setCurrentBoard,
        currentPos,
        setCurrentPos,
        onEnter,
        onDelete,
        onSelectLetter,
        givenWord
      }}>

        {/* {!gameEnd && <>
          <Board />
          <Keyboard />
        </>
        } */}
        <Board />
        <Keyboard />
        {gameEnd &&
          <div>
            <h2>game end</h2>
            <button onClick={newGameHandler}>start new game</button>
          </div>}

      </BoardContext.Provider>
    </div>
  );
}

export default App;
