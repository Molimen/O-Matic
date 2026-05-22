import { useEffect, useRef, useState } from "react"
import InputNumber from "../components/user-input/InputNumber";

type imageType = {
    width: number;
    height: number;
    imgData: string[];
}

export default function Petto() {
  const displayRef = useRef<HTMLCanvasElement | null>(null);
  
  const [xCor, setXCor] = useState("0");
  const [YCor, setYCor] = useState("0");

  const displayScale = 4;

  const image: imageType = {
    width: 27,
    height: 30,
    imgData: [
      '000000001111111111100000000',
      '000000111000010000111000000',
      '000001100111101111001100000',
      '000011011111111111110110000',
      '000010111111111111111010000',
      '000110111111111111111011000',
      '000101111111111111111101000',
      '000101010101011011000101000',
      '000101010101011011010101000',
      '000101010101010101000101000',
      '000101010000000110010101000',
      '111101010100111001010101000',
      '110011010100111001010101111',
      '101101010111111111010010011',
      '100010010111000111010001101',
      '101100011011111110110010001',
      '100000000000000000000101101',
      '110000000100101001000110011',
      '011010000010000010000001110',
      '001111000010101010000111000',
      '000001100000101000001100000',
      '000000100000101000001000000',
      '000000100000000000001000000',
      '000000100000111000001000000',
      '000000110000000000011000000',
      '000000011011010110110000000',
      '000000001000010000100000000',
      '000000001011010110100000000',
      '000000001000010000100000000',
      '000000001111111111100000000',
    ],
  };

  function clear(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function drawPixel(canvas: HTMLCanvasElement, x: number, y: number, scale: number) {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#A8D8FF";

    ctx.fillRect(x*scale, y*scale, 1*scale, 1*scale);
  }

  function drawImage(canvas: HTMLCanvasElement, x: number, y: number, image: {width: number, height: number, imgData: string[]}, scale: number) {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    for (let yImg = 0; yImg < image.height; yImg++) {
      if (yImg >= image.height || yImg < 0) break;

      for (let xImg = 0; xImg < image.width; xImg++) {
        if (xImg >= image.width || xImg < 0) break;

        if (image.imgData[yImg][xImg] === "1") drawPixel(canvas, xImg+x,yImg+y, scale);
      }
    }
  }

  useEffect(() => {
    const canvas = displayRef.current;

    if (!canvas) return;

    clear(canvas);

    drawImage(canvas, 0+Number(xCor),34-Number(YCor), image, displayScale);
  });
  
  return (
    <>
      <div className="max-w-4xl mx-auto px-6 z-0 relative flex justify-center">
        <div className="bg-[#38835b] relative" style={{padding: `${10*displayScale}px`}}>
          <div
            className="bg-[#0033AA] border-[#11171A]"
            style={{padding: `${6*displayScale}px`, borderTopWidth: `${10*displayScale}px`, borderBottomWidth: `${10*displayScale}px`, borderLeftWidth: `${6*displayScale}px`, borderRightWidth: `${6*displayScale}px`}}
          >
            <div className="bg-[#001F7A]" style={{imageRendering: "pixelated"}}>
              <canvas ref={displayRef} width={128*displayScale} height={64*displayScale} />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 z-0 relative mt-6">
        <InputNumber
          name="X cor"
          dataset={{min: "0", max: "128"}}
          value={xCor}
          onChange={(e, type) => {
            if (e) {
              setXCor(e);
            } else if (typeof e !== "undefined") {
              setXCor("");
            }

            if (typeof e === "undefined") {
              if (type === "minus") {
                if (Number(xCor) > Number(0)) setXCor((Number(xCor) - 1).toString());
              } else if (type === "add") {
                if (Number(xCor) < Number(128)) setXCor((Number(xCor) + 1).toString());
              }
            }
          }}
        />

        <InputNumber
          name="Y cor"
          dataset={{min: "0", max: "64"}}
          value={YCor}
          onChange={(e, type) => {
            if (e) {
              setYCor(e);
            } else if (typeof e !== "undefined") {
              setYCor("");
            }

            if (typeof e === "undefined") {
              if (type === "minus") {
                if (Number(YCor) > Number(0)) setYCor((Number(YCor) - 1).toString());
              } else if (type === "add") {
                if (Number(YCor) < Number(128)) setYCor((Number(YCor) + 1).toString());
              }
            }
          }}
        />
      </div>
    </>
  )
}