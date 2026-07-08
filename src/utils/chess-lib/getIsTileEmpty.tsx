import type { pieceName } from "./chessType";

export default function getIsTileEmpty(col: number, row: number, piecesLocation: pieceName[][]) {
  if (col >= 8 || row >= 8 || col < 0 || row < 0) return false;

  if (piecesLocation[row][col] === '') return true;

  return false;
}