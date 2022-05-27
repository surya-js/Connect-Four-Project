/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;   // x (row)
const HEIGHT = 6;  // y  (col)

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {

  for(let y = 0; y < HEIGHT; y++) {
    board.push(Array.from( {length : WIDTH} ));   // creates an array of length = 7(WIDTH) and pushes it into the board
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  
  const htmlBoard = document.querySelector("#board");

  // creating the top row - where the the player have to click to drop a piece 
  const top = document.createElement("tr");  
  top.setAttribute("id", "column-top");      
  top.addEventListener("click", handleClick); 

  //  creating the cells in the top row (7 cells since width = 7)                                    
  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x); 
    top.append(headCell); 
  }
  htmlBoard.append(top); 

  // creating the htmlBoard with 42 cells (WIDTH = 7 and HEIGHT = 6)
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr"); 
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td"); 
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }

  // creating the NewGame Button
  const newGameBtn = document.createElement('button');
  newGameBtn.innerText = "New Game";
  document.body.append(newGameBtn);
  newGameBtn.addEventListener('click',newGame);
}


/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {

  // start checking from the bottom row and if the cell is empty return that y
  for( let y = HEIGHT - 1 ; y >= 0; y--) {

    if(!(board[y][x])) {
        return y;       // returning the top empty y
    }
  }

  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {

  const piece = document.createElement('div');
  piece.classList.add('piece');
  piece.classList.add(`player${currPlayer}`);

  const cell = document.getElementById(`${y}-${x}`);
  cell.append(piece);

}

/** endGame: announce game end */

function endGame(msg) {
  
  alert(msg);

  // to prevent further piece drop after a winner is declared
  const gameOver = document.getElementById('column-top'); 
  gameOver.classList.add('game-over'); 
  
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  const x = evt.target.id;

  // get next spot in column (if none, ignore click)
  var y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  placeInTable(y, x);
  board[y][x] = currPlayer;
  
  
 // check for win
  if (checkForWin()) {
    
    return endGame(`Player ${currPlayer} won!`);
    
  }

  // check for tie
  // check if all cells in board are filled; if so call, call endGame with Tie msg
  if(board.every( (row) => row.every( (cell) => cell))){
    return endGame("It's a Tie!!!");  
  }

  // switch players
  currPlayer = (currPlayer === 1) ? 2 : 1;

}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // iterating through each row and column of the board
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]]; 
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];  
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]]; 
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      // passing each 2D array into _win() and check if every coordinate is legal and all belong to the same player and if either one of the _win(cells) is true, then the following if block will return true 
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

// reloads the page when the New Game button is clicked
function newGame() {

     location.reload();
}

makeBoard();
makeHtmlBoard();

