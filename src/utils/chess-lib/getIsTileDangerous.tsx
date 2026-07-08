import type { pieceName } from "./chessType";
import getIsTileEmpty from "./getIsTileEmpty";
import getIsTileCapturable from "./getIsTileCaptureable";

let isLocationDangerous = [
  [false, false, false, false,false, false, false, false],
  [false, false, false, false,false, false, false, false],
  [false, false, false, false,false, false, false, false],
  [false, false, false, false,false, false, false, false],
  [false, false, false, false,false, false, false, false],
  [false, false, false, false,false, false, false, false],
  [false, false, false, false,false, false, false, false],
  [false, false, false, false,false, false, false, false],
];

// note:
// l = left, r = right
// t = top, b = bottom
// d = diagonal
type tracesType = 'l' | 'r' | 't' | 'b' | 'dlu' | 'dld' | 'dru' | 'drd' 

function traces(tracesType: tracesType, col: number, row: number, currentPiece: pieceName, piecesLocation: pieceName[][]) {
  let colCheck = -1;
  let rowCheck = -1;
  for (let i = 0; i < 8; i++) {
    if (tracesType === 'l') {
      colCheck = col-1-i;
      rowCheck = row;
    } else if (tracesType === 'r') {
      colCheck = col+1+i;
      rowCheck = row;
    } else if (tracesType === 't') {
      colCheck = col;
      rowCheck = row-1-i;
    } else if (tracesType === 'b') {
      colCheck = col;
      rowCheck = row+1+i;
    } else if (tracesType === 'dlu') {
      colCheck = col-1-i;
      rowCheck = row-1-i;
    } else if (tracesType === 'dld') {
      colCheck = col-1-i;
      rowCheck = row+1+i;
    }  else if (tracesType === 'dru') {
      colCheck = col+1+i;
      rowCheck = row-1-i;
    }  else if (tracesType === 'drd') {
      colCheck = col+1+i;
      rowCheck = row+1+i;
    }

    if (colCheck < 0 || rowCheck < 0 || colCheck >= 8 || rowCheck >= 8) continue;

    if (getIsTileEmpty(colCheck, rowCheck, piecesLocation)) {
      isLocationDangerous[rowCheck][colCheck] = true;
      continue;
    }

    if (piecesLocation[rowCheck][colCheck] === currentPiece) {
      isLocationDangerous[rowCheck][colCheck] = true;
      continue;
    }

    if (getIsTileCapturable(colCheck, rowCheck, currentPiece, piecesLocation)) {
      isLocationDangerous[rowCheck][colCheck] = true;
      break;
    }

    if (!getIsTileEmpty(colCheck, rowCheck, piecesLocation)) {
      break;
    }
  }
}

function updateLocationDangerous(currentPiece: pieceName, piecesLocation: pieceName[][]) {
  isLocationDangerous = [
    [false, false, false, false,false, false, false, false],
    [false, false, false, false,false, false, false, false],
    [false, false, false, false,false, false, false, false],
    [false, false, false, false,false, false, false, false],
    [false, false, false, false,false, false, false, false],
    [false, false, false, false,false, false, false, false],
    [false, false, false, false,false, false, false, false],
    [false, false, false, false,false, false, false, false],
  ];

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if (piecesLocation[row][col][0] === '') continue;
      else if (currentPiece[0] === 'b') {
        if (piecesLocation[row][col] === 'wn') {
          if (col-1 >= 0 && row-2 >= 0) isLocationDangerous[row-2][col-1] = true;
          if (col+1 < 8 && row-2 >= 0) isLocationDangerous[row-2][col+1] = true;
          if (col-2 >= 0 && row-1 >= 0) isLocationDangerous[row-1][col-2] = true;
          if (col+2 < 8 && row-1 >= 0) isLocationDangerous[row-1][col+2] = true;
          if (col-2 >= 0 && row+1 < 8) isLocationDangerous[row+1][col-2] = true;
          if (col+2 < 8 && row+1 < 8) isLocationDangerous[row+1][col+2] = true;
          if (col-1 >= 0 && row+2 < 8) isLocationDangerous[row+2][col-1] = true;
          if (col+1 < 8 && row+2 < 8) isLocationDangerous[row+2][col+1] = true;
        } else if (piecesLocation[row][col] === 'wr') {
          // left
          traces('l', col, row, currentPiece, piecesLocation);

          // right
          traces('r', col, row, currentPiece, piecesLocation);

          // up
          traces('t', col, row, currentPiece, piecesLocation);

          // down
          traces('b', col, row, currentPiece, piecesLocation);
        } else if (piecesLocation[row][col] === 'wb') {
          // diagonal left up
          traces('dlu', col, row, currentPiece, piecesLocation);

          // diagonal right up
          traces('dru', col, row, currentPiece, piecesLocation);

          // diagonal left down
          traces('dld', col, row, currentPiece, piecesLocation);

          // diagonal right down
          traces('drd', col, row, currentPiece, piecesLocation);
        } else if (piecesLocation[row][col] === 'wq') {
          // left
          traces('l', col, row, currentPiece, piecesLocation);

          // right
          traces('r', col, row, currentPiece, piecesLocation);

          // up
          traces('t', col, row, currentPiece, piecesLocation);

          // down
          traces('b', col, row, currentPiece, piecesLocation);

          // diagonal left up
          traces('dlu', col, row, currentPiece, piecesLocation);

          // diagonal right up
          traces('dru', col, row, currentPiece, piecesLocation);

          // diagonal left down
          traces('dld', col, row, currentPiece, piecesLocation);

          // diagonal right down
          traces('drd', col, row, currentPiece, piecesLocation);
        } else if (piecesLocation[row][col] === 'wk') {
          for (let i = 0; i < 2; i++) {
            const colCheck = col-1+i;
            const rowCheck = row-1;

            if (colCheck < 0 || row < 0) break; 

            if ((getIsTileEmpty(colCheck, rowCheck, piecesLocation) || getIsTileCapturable(colCheck, rowCheck, currentPiece, piecesLocation))) {
              isLocationDangerous[rowCheck][colCheck] = true;
            }
          }

          for (let i = 0; i < 2; i++) {
            const colCheck = col-1;
            const rowCheck = row+i;

            if (colCheck < 0 || row >= 8) break; 

            if ((getIsTileEmpty(colCheck, rowCheck, piecesLocation) || getIsTileCapturable(colCheck, rowCheck, currentPiece, piecesLocation))) {
              isLocationDangerous[rowCheck][colCheck] = true;
            }
          }

          for (let i = 0; i < 2; i++) {
            const colCheck = col+i;
            const rowCheck = row+1;

            if (colCheck >= 8 || row >= 8) break; 

            if ((getIsTileEmpty(colCheck, rowCheck, piecesLocation) || getIsTileCapturable(colCheck, rowCheck, currentPiece, piecesLocation))) {
              isLocationDangerous[rowCheck][colCheck] = true;
            }
          }

          for (let i = 0; i < 2; i++) {
            const colCheck = col+1;
            const rowCheck = row-i;

            if (colCheck >= 8 || row < 0) break; 

            if ((getIsTileEmpty(colCheck, rowCheck, piecesLocation) || getIsTileCapturable(colCheck, rowCheck, currentPiece, piecesLocation))) {
              isLocationDangerous[rowCheck][colCheck] = true;
            }
          }
        } else if (piecesLocation[row][col] === 'wp') {
          isLocationDangerous[row-1][col-1] = true;

          isLocationDangerous[row-1][col+1] = true;
        }
      } else if (currentPiece[0] === 'w') {
        if (piecesLocation[row][col] === 'bn') {
          if (col-1 >= 0 && row-2 >= 0) isLocationDangerous[row-2][col-1] = true;
          if (col+1 < 8 && row-2 >= 0) isLocationDangerous[row-2][col+1] = true;
          if (col-2 >= 0 && row-1 >= 0) isLocationDangerous[row-1][col-2] = true;
          if (col+2 < 8 && row-1 >= 0) isLocationDangerous[row-1][col+2] = true;
          if (col-2 >= 0 && row+1 < 8) isLocationDangerous[row+1][col-2] = true;
          if (col+2 < 8 && row+1 < 8) isLocationDangerous[row+1][col+2] = true;
          if (col-1 >= 0 && row+2 < 8) isLocationDangerous[row+2][col-1] = true;
          if (col+1 < 8 && row+2 < 8) isLocationDangerous[row+2][col+1] = true;
        } else if (piecesLocation[row][col] === 'br') {
          // left
          traces('l', col, row, currentPiece, piecesLocation);

          // right
          traces('r', col, row, currentPiece, piecesLocation);

          // up
          traces('t', col, row, currentPiece, piecesLocation);

          // down
          traces('b', col, row, currentPiece, piecesLocation);
        } else if (piecesLocation[row][col] === 'bb') {
          // diagonal left up
          traces('dlu', col, row, currentPiece, piecesLocation);

          // diagonal right up
          traces('dru', col, row, currentPiece, piecesLocation);

          // diagonal left down
          traces('dld', col, row, currentPiece, piecesLocation);

          // diagonal right down
          traces('drd', col, row, currentPiece, piecesLocation);
        } else if (piecesLocation[row][col] === 'bq') {
          // left
          traces('l', col, row, currentPiece, piecesLocation);

          // right
          traces('r', col, row, currentPiece, piecesLocation);

          // up
          traces('t', col, row, currentPiece, piecesLocation);

          // down
          traces('b', col, row, currentPiece, piecesLocation);

          // diagonal left up
          traces('dlu', col, row, currentPiece, piecesLocation);

          // diagonal right up
          traces('dru', col, row, currentPiece, piecesLocation);

          // diagonal left down
          traces('dld', col, row, currentPiece, piecesLocation);

          // diagonal right down
          traces('drd', col, row, currentPiece, piecesLocation);
        } else if (piecesLocation[row][col] === 'bk') {
          for (let i = 0; i < 2; i++) {
            const colCheck = col-1+i;
            const rowCheck = row-1;

            if (colCheck < 0 || row < 0) break; 

            if ((getIsTileEmpty(colCheck, rowCheck, piecesLocation) || getIsTileCapturable(colCheck, rowCheck, currentPiece, piecesLocation))) {
              isLocationDangerous[rowCheck][colCheck] = true;
            }
          }

          for (let i = 0; i < 2; i++) {
            const colCheck = col-1;
            const rowCheck = row+i;

            if (colCheck < 0 || row >= 8) break; 

            if ((getIsTileEmpty(colCheck, rowCheck, piecesLocation) || getIsTileCapturable(colCheck, rowCheck, currentPiece, piecesLocation))) {
              isLocationDangerous[rowCheck][colCheck] = true;
            }
          }

          for (let i = 0; i < 2; i++) {
            const colCheck = col+i;
            const rowCheck = row+1;

            if (colCheck >= 8 || row >= 8) break; 

            if ((getIsTileEmpty(colCheck, rowCheck, piecesLocation) || getIsTileCapturable(colCheck, rowCheck, currentPiece, piecesLocation))) {
              isLocationDangerous[rowCheck][colCheck] = true;
            }
          }

          for (let i = 0; i < 2; i++) {
            const colCheck = col+1;
            const rowCheck = row-i;

            if (colCheck >= 8 || row < 0) break; 

            if ((getIsTileEmpty(colCheck, rowCheck, piecesLocation) || getIsTileCapturable(colCheck, rowCheck, currentPiece, piecesLocation))) {
              isLocationDangerous[rowCheck][colCheck] = true;
            }
          }
        } else if (piecesLocation[row][col] === 'bp') {
          isLocationDangerous[row+1][col+1] = true;

          isLocationDangerous[row+1][col-1] = true;
        }
      }
    }
  }
}

export default function getIsTileDangerous(col: number, row: number, currentPiece: pieceName, piecesLocation: pieceName[][]) {
  if (col >= 8 || row >= 8 || col < 0 || row < 0) return false;

  updateLocationDangerous(currentPiece, piecesLocation);

  return isLocationDangerous[row][col];
}