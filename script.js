const gameBoard = (() => {
  const board = document.querySelector('.board');
  const getBoard = () => board;
  const squares = document.querySelectorAll('.square');
  const getSquares = () => squares;

  let content = ['', '', '', '', '', '', '', '', ''];
  const getContent = () => content;

  const render = () => {
    for (let i = 0; i < board.children.length; i++) {
      board.children[i].innerHTML = content[i];
    }
  };
  const makeMove = (index, value) => {
    content[index] = value;
    render();
  };
  const reset = () => {
    content = ['', '', '', '', '', '', '', '', ''];
    render();
  };

  return {
    getContent,
    render,
    makeMove,
    reset,
    getSquares,
    getBoard,
  };
})();

const ui = (() => {
  let player1 = 'Player 1';
  let player2 = 'Player 2';
  const init = () => {
    const form = document.querySelector('form');
    const start = document.querySelector('#start');
    const player1Input = document.querySelector('#player1');
    const player2Input = document.querySelector('#player2');
    const player1Field = document.querySelector('.player1');
    const player2Field = document.querySelector('.player2');
    const restart = document.querySelector('#restart');
    start.addEventListener('click', (event) => {
      event.preventDefault();
      player1 = player1Input.value;
      player2 = player2Input.value;
      player1Field.innerHTML = player1;
      player2Field.innerHTML = player2;
      form.style.display = 'none';
      gameBoard.getBoard().style.display = 'grid';
    });
    restart.addEventListener('click', () => {
      game.restart();
    });
  };

  const getP1 = () => player1;
  const getP2 = () => player2;
  
  return {
    init,
    getP1,
    getP2,
  };
})();

const game = (() => {
  let currentMove = 'o';
  let finished = false;
  const getCurrentMove = () => {
    currentMove = currentMove === 'x' ? 'o' : 'x';
    return currentMove;
  };
  const checkForWin = (boardArr) => {
    let players = ['x', 'o'];
    let winner = null;
    players.forEach(player => {
      for (let i = 0; i < 3; i++) {
        // check columns and rows
        if (
          boardArr[i] === player &&
          boardArr[i+3] === player &&
          boardArr[i+6] === player ||
          boardArr[i*3] === player &&
          boardArr[i*3 + 1] === player &&
          boardArr[i*3 + 2] === player
        ) {
          winner = player;
          break;
        }
      }
      // check across
      if (
        boardArr[0] === player &&
        boardArr[4] === player &&
        boardArr[8] === player ||
        boardArr[2] === player &&
        boardArr[4] === player &&
        boardArr[6] === player
      ) {
        winner = player;
        return;
      }
    });
    return winner;
  }
  const checkForTie = (boardArr) => {
    for(let square of boardArr) {
      if(square === '') return false;
    }
    return true;
  }

  const checkForEnd = (boardArr) => {
    const footer = document.querySelector('footer');
    const results = document.querySelector('.results');
    if(checkForWin(boardArr)) {
      const winner = checkForWin(boardArr) === 'x' ? ui.getP1() : ui.getP2();
      results.innerHTML = `<h2>${winner} won!</h2>`;
      finished = true;
    }
    else if(checkForTie(boardArr)) {
      results.innerHTML = '<h2>It\'s a tie!</h2>';
      finished = true;
    }
    if(finished) {
      footer.style.display = 'flex';
    }
  };
  const isFinished = () => finished;
  const restart = () => {
    gameBoard.reset();
    currentMove = 'o';
    finished = false;
    document.querySelector('footer').style.display = 'none';
  };

  const init = () => {
    const squares = gameBoard.getSquares();
    squares.forEach((sq) => {
      sq.addEventListener('click', (event) => {
        let targetSquare = event.target;
        if(targetSquare.innerHTML != '' || isFinished()) return
        gameBoard.makeMove(targetSquare.dataset.id, getCurrentMove());
        checkForEnd(gameBoard.getContent());
      });
    });
    ui.init();
  };

  return {
    getCurrentMove,
    checkForEnd,
    isFinished,
    restart,
    init,
  };
})();

game.init();