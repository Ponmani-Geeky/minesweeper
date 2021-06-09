import {
  TILE_STATUS,
  checkWin,
  checkLose,
  mineBoard,
  markTile,
  revealTile,
} from "./mine.js";

const BOARD_SIZE = 8;
const NUMBER_OF_MINES = 10;

const board = mineBoard(BOARD_SIZE, NUMBER_OF_MINES);

const boardElement = document.querySelector(".board");
const minesLeftText = document.querySelector("[data-mine-count]");
const subtext = document.querySelector(".subtext");
board.forEach((row) => {
  row.forEach((tile) => {
    boardElement.append(tile.element);
    tile.element.addEventListener("click", () => {
      revealTile(board, tile);
      checkGameEnd();
    });
    tile.element.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      markTile(tile);
      listMinesLeft();
    });
  });
});
boardElement.style.setProperty("--size", BOARD_SIZE);
minesLeftText.textContent = NUMBER_OF_MINES;

function listMinesLeft() {
  const markedTilesCount = board.reduce((count, row) => {
    return (
      count + row.filter((tile) => tile.status === TILE_STATUS.MARKED).length
    );
  }, 0);

  minesLeftText.textContent = NUMBER_OF_MINES - markedTilesCount;
}

function checkGameEnd() {
  const win = checkWin(board);
  const lose = checkLose(board);

  if (win || lose) {
    boardElement.addEventListener("click", stopProp, { capture: true });
    boardElement.addEventListener("contextmenu", stopProp, { capture: true });
  }

  if (win) {
    subtext.textContent = "You Win";
  }

  if (lose) {
    subtext.textContent = "You Lose";
    board.forEach((row) => {
      row.forEach((tile) => {
        if (tile.status === TILE_STATUS.MARKED) markTile(tile);
        if (tile.mine) revealTile(board, tile);
      });
    });
  }
}

function stopProp(e) {
  e.stopImmediatePropagation();
}
