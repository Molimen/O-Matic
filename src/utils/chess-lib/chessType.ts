export type pieceName = 'br' | 'bn' | 'bb' | 'bq' | 'bk' | 'bp' | 'wr' | 'wn' | 'wb' | 'wq' | 'wk' | 'wp' | ''

export type pieceIdentifyer = {
  name: pieceName;
  col: number;
  row: number;
}

export type pieceLocationHint = {
  col: number;
  row: number;
}[]