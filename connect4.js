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
  // TODO: set "board" to empty HEIGHT x WIDTH matrix array

  for(let y = 0; y < HEIGHT; y++) {
    board.push(Array.from( {length : WIDTH} ));   // creates an array of length = 7(WIDTH) and pushes it into the board
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"

  const htmlBoard = document.querySelector("#board");

  // TODO: add comment for this code
  // creating the top row - where the the player have to click to drop a piece 
  const top = document.createElement("tr");  // creating a tr element (table row) 
  top.setAttribute("id", "column-top");      // setting the ID of that top tr element as "column-top"
  top.addEventListener("click", handleClick); // adding event listener to the top. 
                                              //i.e. while there is a click in that top (tr element), it will call the handleClick() function

  //  creating the cells in the top row (7 cells since width = 7)                                    
  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);  // setting the ID of each headCell
    top.append(headCell);  // appending each headCell to the top row
  }
  htmlBoard.append(top);  // appending the top to the htmlBoard

  // TODO: add comment for this code
  // creating the htmlBoard with 42 cells (WIDTH = 7 and HEIGHT = 6)
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr"); // creating the board's rows
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td"); // creating the board's cells
      cell.setAttribute("id", `${y}-${x}`);  // setting ids for each cell as y-x i.e for 1st cell -> 0-0, 2nd cell -> 0-1
      row.append(cell);  // appending each cell to its row
    }
    htmlBoard.append(row); // appending each row to the htmlBoard.
  }

  const newGameBtn = document.createElement('button');
  newGameBtn.innerText = "New Game";
  document.body.append(newGameBtn);
  newGameBtn.addEventListener('click',newGame);
}


/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  // TODO: write the real version of this, rather than always returning 0

  // start checking from the bottom row and if the cell is empty return that y
  for( let y = HEIGHT - 1 ; y >= 0; y--) {

    // returns true if the cell don't have a piece and returns false if the cell contains a piece
    if(!(board[y][x])) {
        return y;       // returning the top empty y
    }
  }

  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  // TODO: make a div and insert into correct table cell
  const piece = document.createElement('div');
  piece.classList.add('piece');
  piece.classList.add(`player${currPlayer}`);

  const cell = document.getElementById(`${y}-${x}`);   // getting the cell based on its ID to which the piece have to be placed
  cell.append(piece); // placing the piece in the cell on the HTML board

}

/** endGame: announce game end */

function endGame(msg) {
  // TODO: pop up alert message
  
  alert(msg);

  const gameOver = document.getElementById('column-top'); // to prevent further piece drop after a winner is declared
  gameOver.classList.add('game-over'); // in game-over class of css the pointer-events is set to none to ignore further clicks
  
  // newGame();
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
  // TODO: add line to update in-memory board
  placeInTable(y, x);
  board[y][x] = currPlayer;
  
  
 // check for win
  if (checkForWin()) {
    
    return endGame(`Player ${currPlayer} won!`);
    
  }

  // check for tie
  // TODO: check if all cells in board are filled; if so call, call endGame
  // checks for a piece in every cell and returns true if all cells are filled
  if(board.every( (row) => row.every( (cell) => cell))){
    return endGame("It's a Tie!!!");  
  }

  // switch players
  // TODO: switch currPlayer 1 <-> 2

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

  // TODO: read and understand this code. Add comments to help you.

  // iterating through each row and column of the board
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]]; // storing the coordiantes of four neighbouring horizontal cells (left to right) in horiz array.
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]]; // storing the coordiantes of four neighbouring vertical cells (top to bottom) in vert array. 
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]]; // storing the coordiantes of four neighbouring diagonal cells (Top left to bottom right) in diagDR array.
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];// storing the coordiantes of four neighbouring diagonal cells (top right to bottom left) in diagDL array.

      // passing each 2D array into _win() and check every coordinate is legal and all belong to the same player
      // if either one of the _win(cells) is true, then the following if(){} block will return true
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
