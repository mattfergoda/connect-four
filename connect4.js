"use strict";

/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  // This should work instead of a for loop... Not sure why it doesn't.
  // board = Array.from({length: HEIGHT}).fill(Array.from({length: WIDTH}).fill(null));

  for (let rowIndex = 0; rowIndex < HEIGHT; rowIndex++) {
    const thisRow = Array.from({ length: WIDTH }).fill(null);
    /*for (let colIndex = 0; colIndex < WIDTH; colIndex++) {
      thisRow.push(null);
    }*/

    board.push(thisRow);
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  const htmlBoard = document.getElementById('board');

  // create a row for column dropping button
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");

  //complete setting up the dropping button and append it to the game board table
  for (let colIndex = 0; colIndex < WIDTH; colIndex++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", `top-${colIndex}`);
    headCell.addEventListener("click", handleClick);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // dynamically creates the main part of html board
  // uses HEIGHT to create table rows
  // uses WIDTH to create table cells for each row
  for (let rowIndex = 0; rowIndex < HEIGHT; rowIndex++) {

    const row = document.createElement("tr");

    for (let colIndex = 0; colIndex < WIDTH; colIndex++) {
      const cell = document.createElement('td');

      cell.setAttribute("id", `c-${rowIndex}-${colIndex}`);

      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return bottom empty y (null if filled) */

function findSpotForCol(x) {
  for (let y=HEIGHT-1; y>=0; y--) {
    const thisCell = board[y][x];
    if (thisCell === null) return y;
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(rowIndex, colIndex) {
  const thisCell = document.getElementById(`c-${rowIndex}-${colIndex}`);
  const markerElement = document.createElement('div');
  markerElement.classList.add('piece', `p${currPlayer}`);

  thisCell.append(markerElement);
}

/** endGame: announce game end */

function endGame(msg) {
  // TODO: pop up alert message
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  const x = +evt.target.id.split('-')[1];
  //debugger;
  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x);
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
  // TODO: check if all cells in board are filled; if so call, call endGame

  const allCellsFull = board.every(row => {
    row.every(cell => cell);
  });
  if (allCellsFull) endGame("The board is full!");

  // switch players
  currPlayer = currPlayer === 1 ? 2 : 1;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {

  /** _win:
   * takes input array of 4 cell coordinates [ [y, x], [y, x], [y, x], [y, x] ]
   * returns true if all are legal coordinates for a cell & all cells match
   * currPlayer
   */
  function _win(cells) {

    // TODO: Check four cells to see if they're all legal & all color of current
    // player
    //debugger;
    for (let cellCoords of cells) {
      const y = cellCoords[0];
      console.log("y=",y);
      const x = cellCoords[1];
      console.log("x=",x);
      let thisCell;

      // Try setting thisCell to this set of coordinates. If it's out of bounds,
      // catch the error and set thisCell equal to null.
      try {
        // If y is out of bounds, accessing [x] of undefined will throw an error.
        thisCell = board[y][x];
      }
      catch (err) {
        thisCell = null;
      }

      if (!thisCell || thisCell !== currPlayer) return false;
    }
    return true;
  }

  // using HEIGHT and WIDTH, generate "check list" of coordinates
  // for 4 cells (starting here) for each of the different
  // ways to win: horizontal, vertical, diagonalDR, diagonalDL
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      // horizontal has been assigned for you
      // each should be an array of 4 cell coordinates:
      // [ [y, x], [y, x], [y, x], [y, x] ]

      let horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      let vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      let diagDL = [[y, x], [y - 1, x - 1], [y - 2, x - 2], [y - 3, x - 3]];
      let diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];

      // find winner (only checking each win-possibility as needed)
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();;
