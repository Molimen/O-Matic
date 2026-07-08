import { useRef, useState } from "react";
import type { pieceName, pieceIdentifyer, pieceLocationHint } from "../utils/chess-lib/chessType";
import getIsTileCapturable from "../utils/chess-lib/getIsTileCaptureable";
import getIsTileEmpty from "../utils/chess-lib/getIsTileEmpty";
import getIsTileDangerous from "../utils/chess-lib/getIsTileDangerous";

type movedPositionType = {
  fromCol: number;
  fromRow: number;
  toCol: number;
  toRow: number;
}

type enPassantableType = {
  col: number;
  row: number;
};

const piecesLocation = [
  ['br','bn','bb','bq','bk','bb','bn','br'],
  ['bp','bp','bp','bp','bp','bp','bp','bp'],
  ['','','','','','','',''],
  ['','','','','','','',''],
  ['','','','','','','',''],
  ['','','','','','','',''],
  ['wp','wp','wp','wp','wp','wp','wp','wp'],
  ['wr','wn','wb','wq','wk','wb','wn','wr'],
] as pieceName[][];

// const piecesLocation = [
//   ['','','','','','','',''],
//   ['','','','','bp','','',''],
//   ['','','','','','','',''],
//   ['','','','wp','','','',''],
//   ['','','','','','wp','',''],
//   ['','','','','','','',''],
//   ['','','','','','','',''],
//   ['','','','','','','',''],
// ] as pieceName[][];

export default function Chess() {
  const piecesRefs = useRef(new Map());

  const [currentTurn, setCurrentTurn] = useState<'black' | 'white'>('white');

  const [movedPosition, setMovedPosition] = useState<movedPositionType>({fromCol: -1, fromRow: -1, toCol: -1,toRow: -1});

  const [enPassantable, setEnPassantable] = useState<enPassantableType>({col: -1, row: -1});

  const pieces = [];

  const [pieceSquareHint, setPieceSquareHint] = useState<pieceIdentifyer>({name: '', col: -1, row: -1});

  const [pieceSquareHintLocation, setPieceSquareHintLocation] = useState<pieceLocationHint>();

  // this is still has no check if a move is illegal or not
  const getSquareHint = (piece: pieceIdentifyer) => {
    const location = [];
    if (piece.name === 'bn' || piece.name === 'wn') {
      if (
        getIsTileCapturable(piece.col-1, piece.row-2, piece.name, piecesLocation) ||
        getIsTileEmpty(piece.col-1, piece.row-2, piecesLocation)
      ) location.push({col: piece.col-1, row: piece.row-2});
      if (
        getIsTileCapturable(piece.col+1, piece.row-2, piece.name, piecesLocation) ||
        getIsTileEmpty(piece.col+1, piece.row-2, piecesLocation)
      ) location.push({col: piece.col+1, row: piece.row-2});
      if (
        getIsTileCapturable(piece.col-2, piece.row-1, piece.name, piecesLocation) ||
        getIsTileEmpty(piece.col-2, piece.row-1, piecesLocation)
      ) location.push({col: piece.col-2, row: piece.row-1});
      if (
        getIsTileCapturable(piece.col+2, piece.row-1, piece.name, piecesLocation) ||
        getIsTileEmpty(piece.col+2, piece.row-1, piecesLocation)
      ) location.push({col: piece.col+2, row: piece.row-1});
      if (
        getIsTileCapturable(piece.col-2, piece.row+1, piece.name, piecesLocation) ||
        getIsTileEmpty(piece.col-2, piece.row+1, piecesLocation)
      ) location.push({col: piece.col-2, row: piece.row+1});
      if (
        getIsTileCapturable(piece.col+2, piece.row+1, piece.name, piecesLocation) ||
        getIsTileEmpty(piece.col+2, piece.row+1, piecesLocation)
      ) location.push({col: piece.col+2, row: piece.row+1});
      if (
        getIsTileCapturable(piece.col-1, piece.row+2, piece.name, piecesLocation) ||
        getIsTileEmpty(piece.col-1, piece.row+2, piecesLocation)
      ) location.push({col: piece.col-1, row: piece.row+2});
      if (
        getIsTileCapturable(piece.col+1, piece.row+2, piece.name, piecesLocation) ||
        getIsTileEmpty(piece.col+1, piece.row+2, piecesLocation)
      ) location.push({col: piece.col+1, row: piece.row+2});
    } else if (piece.name === 'br' || piece.name === 'wr') {
      for (let i = 0; i < 8; i++) {
        const col = piece.col-1-i;
        const row = piece.row;

        if (getIsTileEmpty(col, row, piecesLocation)) {
          location.push({col: col, row: row});
          continue;
        }

        if (!getIsTileEmpty(col, row, piecesLocation) && !getIsTileCapturable(col, row, piece.name, piecesLocation)) {
          break;
        }

        if (getIsTileCapturable(col, row, piece.name, piecesLocation)) {
          location.push({col: col, row: row});
          break
        }
      }

      for (let i = 0; i < 8; i++) {
        const col = piece.col+1+i;
        const row = piece.row;

        if (getIsTileEmpty(col, row, piecesLocation)) {
          location.push({col: col, row: row});
          continue;
        }

        if (!getIsTileEmpty(col, row, piecesLocation) && !getIsTileCapturable(col, row, piece.name, piecesLocation)) {
          break;
        }

        if (getIsTileCapturable(col, row, piece.name, piecesLocation)) {
          location.push({col: col, row: row});
          break
        }
      }

      for (let i = 0; i < 8; i++) {
        const col = piece.col;
        const row = piece.row-1-i;

        if (getIsTileEmpty(col, row, piecesLocation)) {
          location.push({col: col, row: row});
          continue;
        }

        if (!getIsTileEmpty(col, row, piecesLocation) && !getIsTileCapturable(col, row, piece.name, piecesLocation)) {
          break;
        }

        if (getIsTileCapturable(col, row, piece.name, piecesLocation)) {
          location.push({col: col, row: row});
          break
        }
      }

      for (let i = 0; i < 8; i++) {
        const col = piece.col;
        const row = piece.row+1+i;

        if (getIsTileEmpty(col, row, piecesLocation)) {
          location.push({col: col, row: row});
          continue;
        }

        if (!getIsTileEmpty(col, row, piecesLocation) && !getIsTileCapturable(col, row, piece.name, piecesLocation)) {
          break;
        }

        if (getIsTileCapturable(col, row, piece.name, piecesLocation)) {
          location.push({col: col, row: row});
          break
        }
      }
    } else if (piece.name === 'bb' || piece.name === 'wb') {
      for (let i = 0; i < 8; i++) {
        const col = piece.col-1-i;
        const row = piece.row-1-i;

        if (getIsTileEmpty(col, row, piecesLocation)) {
          location.push({col: col, row: row});
          continue;
        }

        if (!getIsTileEmpty(col, row, piecesLocation) && !getIsTileCapturable(col, row, piece.name, piecesLocation)) {
          break;
        }

        if (getIsTileCapturable(col, row, piece.name, piecesLocation)) {
          location.push({col: col, row: row});
          break
        }
      }

      for (let i = 0; i < 8; i++) {
        const col = piece.col+1+i;
        const row = piece.row-1-i;

        if (getIsTileEmpty(col, row, piecesLocation)) {
          location.push({col: col, row: row});
          continue;
        }

        if (!getIsTileEmpty(col, row, piecesLocation) && !getIsTileCapturable(col, row, piece.name, piecesLocation)) {
          break;
        }

        if (getIsTileCapturable(col, row, piece.name, piecesLocation)) {
          location.push({col: col, row: row});
          break
        }
      }

      for (let i = 0; i < 8; i++) {
        const col = piece.col-1-i;
        const row = piece.row+1+i;

        if (getIsTileEmpty(col, row, piecesLocation)) {
          location.push({col: col, row: row});
          continue;
        }

        if (!getIsTileEmpty(col, row, piecesLocation) && !getIsTileCapturable(col, row, piece.name, piecesLocation)) {
          break;
        }

        if (getIsTileCapturable(col, row, piece.name, piecesLocation)) {
          location.push({col: col, row: row});
          break
        }
      }

      for (let i = 0; i < 8; i++) {
        const col = piece.col+1+i;
        const row = piece.row+1+i;

        if (getIsTileEmpty(col, row, piecesLocation)) {
          location.push({col: col, row: row});
          continue;
        }

        if (!getIsTileEmpty(col, row, piecesLocation) && !getIsTileCapturable(col, row, piece.name, piecesLocation)) {
          break;
        }

        if (getIsTileCapturable(col, row, piece.name, piecesLocation)) {
          location.push({col: col, row: row});
          break
        }
      }
    } else if (piece.name === 'bq' || piece.name === 'wq') {
      for (let i = 0; i < 8; i++) {
        const col = piece.col-1-i;
        const row = piece.row;

        if (getIsTileEmpty(col, row, piecesLocation)) {
          location.push({col: col, row: row});
          continue;
        }

        if (!getIsTileEmpty(col, row, piecesLocation) && !getIsTileCapturable(col, row, piece.name, piecesLocation)) {
          break;
        }

        if (getIsTileCapturable(col, row, piece.name, piecesLocation)) {
          location.push({col: col, row: row});
          break
        }
      }

      for (let i = 0; i < 8; i++) {
        const col = piece.col+1+i;
        const row = piece.row;

        if (getIsTileEmpty(col, row, piecesLocation)) {
          location.push({col: col, row: row});
          continue;
        }

        if (!getIsTileEmpty(col, row, piecesLocation) && !getIsTileCapturable(col, row, piece.name, piecesLocation)) {
          break;
        }

        if (getIsTileCapturable(col, row, piece.name, piecesLocation)) {
          location.push({col: col, row: row});
          break
        }
      }

      for (let i = 0; i < 8; i++) {
        const col = piece.col;
        const row = piece.row-1-i;

        if (getIsTileEmpty(col, row, piecesLocation)) {
          location.push({col: col, row: row});
          continue;
        }

        if (!getIsTileEmpty(col, row, piecesLocation) && !getIsTileCapturable(col, row, piece.name, piecesLocation)) {
          break;
        }

        if (getIsTileCapturable(col, row, piece.name, piecesLocation)) {
          location.push({col: col, row: row});
          break
        }
      }

      for (let i = 0; i < 8; i++) {
        const col = piece.col;
        const row = piece.row+1+i;

        if (getIsTileEmpty(col, row, piecesLocation)) {
          location.push({col: col, row: row});
          continue;
        }

        if (!getIsTileEmpty(col, row, piecesLocation) && !getIsTileCapturable(col, row, piece.name, piecesLocation)) {
          break;
        }

        if (getIsTileCapturable(col, row, piece.name, piecesLocation)) {
          location.push({col: col, row: row});
          break
        }
      }

      for (let i = 0; i < 8; i++) {
        const col = piece.col-1-i;
        const row = piece.row-1-i;

        if (getIsTileEmpty(col, row, piecesLocation)) {
          location.push({col: col, row: row});
          continue;
        }

        if (!getIsTileEmpty(col, row, piecesLocation) && !getIsTileCapturable(col, row, piece.name, piecesLocation)) {
          break;
        }

        if (getIsTileCapturable(col, row, piece.name, piecesLocation)) {
          location.push({col: col, row: row});
          break
        }
      }

      for (let i = 0; i < 8; i++) {
        const col = piece.col+1+i;
        const row = piece.row-1-i;

        if (getIsTileEmpty(col, row, piecesLocation)) {
          location.push({col: col, row: row});
          continue;
        }

        if (!getIsTileEmpty(col, row, piecesLocation) && !getIsTileCapturable(col, row, piece.name, piecesLocation)) {
          break;
        }

        if (getIsTileCapturable(col, row, piece.name, piecesLocation)) {
          location.push({col: col, row: row});
          break
        }
      }

      for (let i = 0; i < 8; i++) {
        const col = piece.col-1-i;
        const row = piece.row+1+i;

        if (getIsTileEmpty(col, row, piecesLocation)) {
          location.push({col: col, row: row});
          continue;
        }

        if (!getIsTileEmpty(col, row, piecesLocation) && !getIsTileCapturable(col, row, piece.name, piecesLocation)) {
          break;
        }

        if (getIsTileCapturable(col, row, piece.name, piecesLocation)) {
          location.push({col: col, row: row});
          break
        }
      }

      for (let i = 0; i < 8; i++) {
        const col = piece.col+1+i;
        const row = piece.row+1+i;

        if (getIsTileEmpty(col, row, piecesLocation)) {
          location.push({col: col, row: row});
          continue;
        }

        if (!getIsTileEmpty(col, row, piecesLocation) && !getIsTileCapturable(col, row, piece.name, piecesLocation)) {
          break;
        }

        if (getIsTileCapturable(col, row, piece.name, piecesLocation)) {
          location.push({col: col, row: row});
          break
        }
      }
    } else if (piece.name === 'bk' || piece.name === 'wk') {
      for (let i = 0; i < 2; i++) {
        const col = piece.col-1+i;
        const row = piece.row-1;

        if ((getIsTileEmpty(col, row, piecesLocation) || getIsTileCapturable(col, row, piece.name, piecesLocation)) && !getIsTileDangerous(col, row, piece.name, piecesLocation)) {
          location.push({col: col, row: row});
        }
      }

      for (let i = 0; i < 2; i++) {
        const col = piece.col-1;
        const row = piece.row+i;

        if ((getIsTileEmpty(col, row, piecesLocation) || getIsTileCapturable(col, row, piece.name, piecesLocation)) && !getIsTileDangerous(col, row, piece.name, piecesLocation)) {
          location.push({col: col, row: row});
        }
      }

      for (let i = 0; i < 2; i++) {
        const col = piece.col+i;
        const row = piece.row+1;

        if ((getIsTileEmpty(col, row, piecesLocation) || getIsTileCapturable(col, row, piece.name, piecesLocation)) && !getIsTileDangerous(col, row, piece.name, piecesLocation)) {
          location.push({col: col, row: row});
        }
      }

      for (let i = 0; i < 2; i++) {
        const col = piece.col+1;
        const row = piece.row-i;

        if ((getIsTileEmpty(col, row, piecesLocation) || getIsTileCapturable(col, row, piece.name, piecesLocation)) && !getIsTileDangerous(col, row, piece.name, piecesLocation)) {
          location.push({col: col, row: row});
        }
      }
    } else if (piece.name === 'bp') {
      if (
        !getIsTileCapturable(piece.col, piece.row+1, piece.name, piecesLocation) &&
        getIsTileEmpty(piece.col, piece.row+1, piecesLocation)
      ) location.push({col: piece.col, row: piece.row+1});
      
      if (
        getIsTileEmpty(piece.col, piece.row+1, piecesLocation) &&
        (!getIsTileCapturable(piece.col, piece.row+2, piece.name, piecesLocation) &&
        getIsTileEmpty(piece.col, piece.row+2, piecesLocation)) &&
        piece.row === 1
      ) location.push({col: piece.col, row: piece.row+2});

      if (getIsTileCapturable(piece.col+1, piece.row+1, piece.name, piecesLocation)) location.push({col: piece.col+1, row: piece.row+1});

      if (getIsTileCapturable(piece.col-1, piece.row+1, piece.name, piecesLocation)) location.push({col: piece.col-1, row: piece.row+1});

      if (enPassantable.col-1 === piece.col && enPassantable.row === piece.row) location.push({col: piece.col+1, row: piece.row+1});

      if (enPassantable.col+1 === piece.col && enPassantable.row === piece.row) location.push({col: piece.col-1, row: piece.row+1});
    } else if (piece.name === 'wp') {
      if (
        !getIsTileCapturable(piece.col, piece.row-1, piece.name, piecesLocation) &&
        getIsTileEmpty(piece.col, piece.row-1, piecesLocation)
      ) location.push({col: piece.col, row: piece.row-1});

      if (
        getIsTileEmpty(piece.col, piece.row-1, piecesLocation) &&
        (!getIsTileCapturable(piece.col, piece.row-2, piece.name, piecesLocation) &&
        getIsTileEmpty(piece.col, piece.row-2, piecesLocation)) &&
        piece.row === 6
      ) location.push({col: piece.col, row: piece.row-2});

      if (getIsTileCapturable(piece.col-1, piece.row-1, piece.name, piecesLocation)) location.push({col: piece.col-1, row: piece.row-1});

      if (getIsTileCapturable(piece.col+1, piece.row-1, piece.name, piecesLocation)) location.push({col: piece.col+1, row: piece.row-1});

      if (enPassantable.col+1 === piece.col && enPassantable.row === piece.row) location.push({col: piece.col-1, row: piece.row-1});

      if (enPassantable.col-1 === piece.col && enPassantable.row === piece.row) location.push({col: piece.col+1, row: piece.row-1});
    }

    setPieceSquareHintLocation(location);
  };

  const removeSquareHintLocation = () => {
    setPieceSquareHintLocation([]);
  }

  const removeSquareHint = () => {
    setPieceSquareHint({name: '', col: -1, row: -1});
  }

  const removeEnPassantable = () => {
    setEnPassantable({col: -1, row: -1});
  }

  const doDrag = (e: React.PointerEvent, idKey: string, id: pieceIdentifyer) => {
    const elPieces = piecesRefs.current.get(idKey) as HTMLDivElement;
    if (!elPieces) return;

    let isThisPieceTheirTurn = false;

    if (currentTurn === 'black' && id.name[0] === 'b') {
      isThisPieceTheirTurn = true;
    } else if (currentTurn === 'white' && id.name[0] === 'w') {
      isThisPieceTheirTurn = true;
    }

    if (isThisPieceTheirTurn) {
      setPieceSquareHint(id);
      getSquareHint(id);
    } else {
      setPieceSquareHint(id);
      removeSquareHintLocation();
    }


    e.currentTarget.setPointerCapture(e.pointerId);

    elPieces.style.cursor = 'grabbing';

    const move = (ev: PointerEvent) => {
      elPieces.style.position = 'fixed';
      elPieces.style.width = '12.4cqw';
      
      elPieces.style.left = `${ev.clientX - (elPieces.getBoundingClientRect().width/2)}px`;
      elPieces.style.top = `${ev.clientY - (elPieces.getBoundingClientRect().height/2)}px`;
    };

    const up = () => {
      elPieces.style.position = '';
      elPieces.style.width = '';
      elPieces.style.cursor = 'grab';
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };

    window.addEventListener("pointerdown", move, { once: true });
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  const doPieceMove = (col: number, row: number) => {
    piecesLocation[pieceSquareHint.row][pieceSquareHint.col] = '';

    piecesLocation[row][col] = pieceSquareHint.name;

    if (pieceSquareHint.name === 'bp' && row-1 === enPassantable.row) {
      piecesLocation[enPassantable.row][enPassantable.col] = '';
      removeEnPassantable();
    }

    if (pieceSquareHint.name === 'wp' && row+1 === enPassantable.row) {
      piecesLocation[enPassantable.row][enPassantable.col] = '';
      removeEnPassantable();
    }
    
    if ((pieceSquareHint.name === 'wp' || pieceSquareHint.name === 'bp') && (pieceSquareHint.row - row === 2 || row - pieceSquareHint.row === 2)) setEnPassantable({col: col, row: row});
    else removeEnPassantable();

    setMovedPosition({fromCol: pieceSquareHint.col, fromRow: pieceSquareHint.row, toCol: col, toRow: row});

    if (currentTurn === 'black') setCurrentTurn('white'); 
    if (currentTurn === 'white') setCurrentTurn('black')

    removeSquareHintLocation();
  }

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (piecesLocation[i][j] !== '') {
        const pieceKey = `${piecesLocation[i][j]}, ${i}, ${j}`;
        const pieceID = {name: piecesLocation[i][j], col: j, row: i};

        pieces.push(
          <div
            key={pieceKey}
            ref={el => {
              if (el) {
                piecesRefs.current.set(pieceKey, el);
              } else {
                piecesRefs.current.delete(pieceKey);
              }
            }}
            onPointerDown={(e) => {doDrag(e, pieceKey, pieceID)}}
            draggable={false}
            style={{
              gridColumn: j+1,
              gridRow: i+1,
              cursor: 'grab'
            }}
          >
            <img draggable={false} src={`/images/chess-pieces/${piecesLocation[i][j]}.png`}></img>
          </div>
        )
      }
    }
  }

  const board = [];

  for (let i = 0; i < 8; i++) {
    const tempBoard = [];
    for (let j = 0; j < 8; j++) {
      let highlight = false;
      if (pieceSquareHint.col === j && pieceSquareHint.row === i) highlight = true;
      if (movedPosition.fromCol === j && movedPosition.fromRow === i) highlight = true;
      if (movedPosition.toCol === j && movedPosition.toRow === i) highlight = true;

      if (i % 2 !== 0) {
        if (j % 2 !== 0) {
          tempBoard.push(
            <>
              <div
                className={highlight ? "bg-[#CDD26A]" : "bg-[#F0D9B5]"}
                onClick={() => {removeSquareHintLocation(); removeSquareHint();}}
                style={{
                  gridColumn: j+1,
                  gridRow: i+1,
                }}
              ></div>
            </>
          )
        } else {
          tempBoard.push(
            <>
              <div
                className={highlight ? "bg-[#AAA23A]" : "bg-[#B58863]"}
                onClick={() => {removeSquareHintLocation(); removeSquareHint();}}
                style={{
                  gridColumn: j+1,
                  gridRow: i+1,
                }}
              ></div>
            </>
          )
        }
      } else {
        if (j % 2 === 0) {
          tempBoard.push(
            <>
              <div
                className={highlight ? "bg-[#CDD26A]" : "bg-[#F0D9B5]"}
                onClick={() => {removeSquareHintLocation(); removeSquareHint();}}
                style={{
                  gridColumn: j+1,
                  gridRow: i+1,
                }}
              ></div>
            </>
          )
        } else {
          tempBoard.push(
            <>
              <div
                className={highlight ? "bg-[#AAA23A]" : "bg-[#B58863]"}
                onClick={() => {removeSquareHintLocation(); removeSquareHint();}}
                style={{
                  gridColumn: j+1,
                  gridRow: i+1,
                }}
              ></div>
            </>
          )
        }
      }
    }

    board.push(tempBoard);
  }

  const boardSquareHintLocation = [];

  if (pieceSquareHintLocation) {
    for (const location of pieceSquareHintLocation) {
      if (!(location.col < 0 || location.row < 0 || location.col > 8 || location.row > 8)) {
        boardSquareHintLocation.push(
          <>
            <div
              className="flex justify-center items-center"
              style={{
                gridColumn: location.col+1,
                gridRow: location.row+1,
              }}
              onClick={() => doPieceMove(location.col, location.row)}
            >
              {
                piecesLocation[location.row][location.col] !== '' ?
                <div className="aspect-square rounded-full w-[12.3cqw] border-[1.3cqw] border-gray-600/30 z-1 cursor-grab"></div> : 
                <div className="aspect-square rounded-full w-[4.034cqw] bg-gray-600/30"></div>}
            </div>
          </>
        )
      }
    }
  }

  return (
    <>
      <div className='max-w-lg mx-auto px-2'>
        <div className="flex flex-row gap-2">
          <div className="">Current Turn: {currentTurn}</div>
          <button onClick={() => {if (currentTurn === 'black') setCurrentTurn('white'); if (currentTurn === 'white') setCurrentTurn('black')}} className="bg-slate-700 px-2">Change Turn</button>
        </div>

        <div
          className="relative aspect-square select-none"
          style={{
            containerType: 'size',
          }}
          >
          <div className="absolute w-full h-full aspect-square grid grid-cols-8 grid-rows-8">
            {board}
            {boardSquareHintLocation}
            {pieces}
          </div>
        </div>
      </div>
    </>
  )
}