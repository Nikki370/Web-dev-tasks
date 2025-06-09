// A sample solved Sudoku board 
const solvedBoard = [
  [5,3,4,6,7,8,9,1,2],
  [6,7,2,1,9,5,3,4,8],
  [1,9,8,3,4,2,5,6,7],
  [8,5,9,7,6,1,4,2,3],
  [4,2,6,8,5,3,7,9,1],
  [7,1,3,9,2,4,8,5,6],
  [9,6,1,5,3,7,2,8,4],
  [2,8,7,4,1,9,6,3,5],
  [3,4,5,2,8,6,1,7,9]
];

function copyBoard(board) {
  return board.map(row => row.slice());
}

function generatePuzzle(solved, difficulty = 40) {
  const puzzle = copyBoard(solved);
  let count = 0;
  while (count < difficulty) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    if (puzzle[row][col] !== "") {
      puzzle[row][col] = "";
      count++;
    }
  }
  return puzzle;
}

let currentPuzzle = [];
let solution = [];
let lockedCells = []; 

function fillBoard(puzzle) {
  const cells = document.querySelectorAll('.cell');
  lockedCells = [];
  let idx = 0;
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const value = puzzle[row][col];
      const cell = cells[idx];
      if (value !== "") {
        cell.value = value;
        cell.disabled = true;
        cell.style.backgroundColor = "#e0e0e0";
        lockedCells.push(true);
      } else {
        cell.value = "";
        cell.disabled = false;
        cell.style.backgroundColor = "white";
        lockedCells.push(false);
      }
      idx++;
    }
  }
}

function getUserBoard() {
  const cells = document.querySelectorAll('.cell');
  let board = [];
  for (let i = 0; i < 9; i++) board.push([]);
  cells.forEach((cell, idx) => {
    const row = Math.floor(idx / 9);
    const val = cell.value.trim();
    board[row].push(val === "" ? "" : parseInt(val));
  });
  return board;
}


function boardsEqual(a, b) {
  for (let i = 0; i < 9; i++)
    for (let j = 0; j < 9; j++)
      if (a[i][j] !== b[i][j]) return false;
  return true;
}

function isValidSudoku(board) {
  for (let i = 0; i < 9; i++) {
    let row = new Set(), col = new Set(), box = new Set();
    for (let j = 0; j < 9; j++) {
      // Row
      if (board[i][j] !== "" && row.has(board[i][j])) return false;
      row.add(board[i][j]);
      // Column
      if (board[j][i] !== "" && col.has(board[j][i])) return false;
      col.add(board[j][i]);
      // Box
      const r = 3 * Math.floor(i / 3) + Math.floor(j / 3);
      const c = 3 * (i % 3) + (j % 3);
      if (board[r][c] !== "" && box.has(board[r][c])) return false;
      box.add(board[r][c]);
    }
  }
  return true;
}

window.generateNewPuzzle = function() {
  solution = copyBoard(solvedBoard);
  currentPuzzle = generatePuzzle(solution, 40); // 40 cells removed
  fillBoard(currentPuzzle);
};

window.resetBoard = function() {
  fillBoard(currentPuzzle);
};

window.checkSolution = function() {
  const userBoard = getUserBoard();
  // Check for empty cells
  for (let i = 0; i < 9; i++)
    for (let j = 0; j < 9; j++)
      if (userBoard[i][j] === "" || isNaN(userBoard[i][j])) {
        alert("Please fill all cells before checking!");
        return;
      }
  // Check Sudoku rules
  if (!isValidSudoku(userBoard)) {
    alert("Invalid solution! Please check your rows, columns, and boxes.");
    return;
  }
  // Check against solution
  if (boardsEqual(userBoard, solution)) {
    alert("Congratulations! You solved the puzzle!");
  } else {
    alert("Incorrect solution. Try again!");
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const cells = document.querySelectorAll('.cell');
  cells.forEach(cell => {
    cell.addEventListener('input', function() {
      // Only allow 1-9
      if (!/^[1-9]$/.test(cell.value)) {
        cell.value = "";
      }
    });
  });
  generateNewPuzzle();
});