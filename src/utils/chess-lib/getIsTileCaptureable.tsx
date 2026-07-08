import type { pieceName } from "./chessType";

export default function getIsTileCapturable(col: number, row: number, currentPiece: pieceName, piecesLocation: pieceName[][]) {
  if (col >= 8 || row >= 8 || col < 0 || row < 0) return false;

  if (currentPiece[0] === 'b' && piecesLocation[row][col][0] === 'w') return true;
  if (currentPiece[0] === 'w' && piecesLocation[row][col][0] === 'b') return true;

  return false;
}