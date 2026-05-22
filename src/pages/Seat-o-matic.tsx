import ButtonProcess from '../components/user-input/ButtonProcess'
import InputSelect from '../components/user-input/InputSelect';
import MessageInformation, {type messageTypeCheck} from '../components/user-input/Message';
import useLocalStorage from '../utils/useLocalStorage';
import ColorPicker from "../components/user-input/ColorPicker";
import hexToBrightness from '../utils/hexToBrightness';
import { useRef, useState } from 'react';
import getStudentsData, { type studentsType, type studentType } from '../services/getStudentsData';
import shuffleArray from '../utils/shuffleArray';
import getBlacklistsData, {type blacklistsType} from '../services/getBlacklistsData';
import { snapdom } from "@zumer/snapdom";

function SeatRowElement({ left, girlColor, boyColor, studentsSeats }: { left: string, girlColor: string, boyColor: string, studentsSeats: studentsType[] | undefined }) {
  const girlTextColor = hexToBrightness(girlColor) > 0.179 ? 'black' : 'white';
  const boyTextColor = hexToBrightness(boyColor) > 0.179 ? 'black' : 'white';

  const seats = [];

  for (let i = 0; i < 4; i++) {
    seats.push(
      <div key={`${left} ${i}`}>
        <div
          key={`${i} seat 1`}
          className={`absolute flex w-[49.2%] h-[24.7%] justify-center items-center text-black z-2 ${i % 2 !== 0 ? "left-[50.7%]" : ""}`}
          style={{ fontSize: '6.1cqw', backgroundColor: `#${typeof studentsSeats !== "undefined" ? studentsSeats[i][0].gender === "P" ? girlColor : boyColor : boyColor}`, color: `${typeof studentsSeats !== "undefined" ? studentsSeats[i][0].gender === "P" ? girlTextColor : boyTextColor : boyTextColor}`, top: `${25*i}%` }}
        >
          {typeof studentsSeats !== "undefined" ? studentsSeats[i][0].absent : "??"}
        </div>
        <div
          key={`${i} seat 2`}
          className={`absolute flex w-[49.2%] h-[24.7%] justify-center items-center text-black z-2 ${i % 2 !== 0 ? "" : "left-[50.7%]"}`}
          style={{ fontSize: '6.1cqw', backgroundColor: `#${typeof studentsSeats !== "undefined" ? studentsSeats[i][1].gender === "P" ? girlColor : boyColor : girlColor}`, color: `${typeof studentsSeats !== "undefined" ? studentsSeats[i][1].gender === "P" ? girlTextColor : boyTextColor : girlTextColor}`, top: `${25*i}%` }}
        >
          {typeof studentsSeats !== "undefined" ? studentsSeats[i][1].absent : "??"}
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className="absolute w-[18.2%] h-[66.6%] border-2 border-black bg-black"
        style={{ left: left }}
      >
        <div className="absolute left-[49.2%] w-[3%] h-full bg-black z-2"></div>
        {seats}
      </div>
    </>
  )
}

export default function Seat() {
  const CLASSDATA = [
    {name: 'X-1', value: '1'},
    {name: 'X-2', value: '2'},
    {name: 'X-3', value: '3'},
    {name: 'X-4', value: '4'},
    {name: 'X-5', value: '5'},
    {name: 'X-6', value: '6'},
  ];

  const DEFAULTPALLETE = [
    '#FFFA9F',
    '#9FFFA5',
    '#FF48C4',
    '#2196F3',
    '#FDA4AF',
    '#84A98C',
    '#F59E0B',
    '#733BD9'
  ];

  const [classSelected, setClassSelected] = useLocalStorage("classSelected", "1");

  const [boyColor, setBoyColor] = useLocalStorage("boyColor", "9FFFA5");
  const [girlColor, setGirlColor] = useLocalStorage("girlColor", "FFFA9F");

  const [message, setMessage] = useState("Nothing to Do");
  const [messageType, setMessageType] = useState<messageTypeCheck>("info");

  const [displaySeats, setDisplaySeats] = useState<studentsType[]>();

  const captureSeatsRef = useRef <HTMLDivElement | null>(null);
  
  function setMessageBoard(message: string, messageType: messageTypeCheck = "info") {
    setMessage(message);
    setMessageType(messageType);
  }

  async function generateSeats() {
    console.log(classSelected);

    const seatOrder: studentsType[] = [];

    let students: studentsType;
    try {
      students = await getStudentsData(Number(classSelected));
    } catch {
      setMessageBoard('Something went wrong while fetching data.', "error");
      return;
    }

    let blacklistsPartner: blacklistsType;
    try {
      blacklistsPartner = await getBlacklistsData(Number(classSelected));
    } catch {
      setMessageBoard('Something went wrong while fetching data for a particular.', "error");
      return;
    }

    // const blacklist = new Map();
    // for (const entry of blacklistsPartner) {
    //   if (!blacklist.has(entry.absent)) {
    //     blacklist.set(entry.absent, new Set());
    //   }
    //   for (const blocked of entry.blacklistsPartner) {
    //     blacklist.get(entry.absent).add(blocked);
    //   }
    // }

    // console.log(blacklist.get(13));

    let studentsGirls: studentsType = [];
    let studentsBoys: studentsType = [];

    for (const student of students) {
      if (student.gender === "P") studentsGirls.push(student);
      else if (student.gender === "L") studentsBoys.push(student);
    }
    
    studentsGirls = shuffleArray(studentsGirls);
    studentsBoys = shuffleArray(studentsBoys);

    // note: this will check a to b.
    // A is student origin. B is to check if compatible.
    const isCompatible = (studentA: studentType, studentB: studentType) => {
      for (const student of blacklistsPartner) {
        if (student.absent === studentA.absent) {
          for (const studentBlacklistAbsent of student.blacklistsPartner) {
            if (studentBlacklistAbsent === studentB.absent) {
              return false;
            }
          }
        }
      }

      return true;
    };

    let whiletruecatcher3000 = 0;
    while (true) {
      if (studentsGirls.length === 0 || studentsBoys.length === 0) {
        while (true) {
          if (studentsGirls.length === 1) {
            const studentGirl = studentsGirls.pop();

            if (studentGirl) seatOrder.push([{absent: -1, gender: "P", smartness: 0, name: "??"}, studentGirl]);
            break;
          } else if (studentsBoys.length === 1) {
            const studentBoy = studentsBoys.pop();

            if (studentBoy) seatOrder.push([studentBoy, {absent: -1, gender: "P", smartness: 0, name: "??"}]);
            break;
          }

          if (studentsGirls.length > 1) {
            const studentGirl1 = studentsGirls.pop();
            const studentGirl2 = studentsGirls.pop();

            if (studentGirl1 && studentGirl2) seatOrder.push([studentGirl1, studentGirl2]);
          } else if (studentsBoys.length > 1) {
            const studentBoy1 = studentsBoys.pop();
            const studentBoy2 = studentsBoys.pop();

            if (studentBoy1 && studentBoy2) seatOrder.push([studentBoy1, studentBoy2]);
          }

          if (studentsGirls.length === 0 && studentsBoys.length === 0) {
            const seat = seatOrder.pop();

            if (seat) seatOrder.splice(Math.floor(Math.random() * seatOrder.length), 0, seat);
            break;
          }
        }
        break;
      }

      const studentGirl = studentsGirls.pop();
      const studentBoy = studentsBoys.pop();
      if (studentGirl && studentBoy) {
        seatOrder.push([studentBoy, studentGirl]);
      }

      whiletruecatcher3000++;

      if (whiletruecatcher3000 > 1000) {
        throw new Error("ECCOCa!");
      }
    }

    for (const seats of seatOrder) {
      // if (!isCompatible(seats[0], seats[1]) || !isCompatible(seats[1], seats[0])) {
      //   console.log(seats, isCompatible(seats[0], seats[1]) ? "Girl" : "", isCompatible(seats[1], seats[0]) ? "Boy" : "");
      //   throw new Error("a");
      // }



      // if (!isCompatible(seats[0], seats[1])) {
      //   for (const findingPartner of seatOrder) {
      //     if (!isCompatible(seats[0], findingPartner[1])) {
      //       console.log(seats, findingPartner);
            
      //       const temp1 = seats[1];

      //       seatOrder.splice(seatOrder.indexOf(seats), 1, [seats[0], findingPartner[1]]);
      //       seatOrder.splice(seatOrder.indexOf(findingPartner), 1, [findingPartner[0], temp1]);
      //       break;
      //     }
      //   }
      // }

      // code might accidentally swap already gud partner!
      for (const seatCurrent of seats) {
        for (const seatCheck of seats) {
          if (seatCurrent === seatCheck) continue;

          // console.log(isCompatible(seatCurrent, seatCheck), seatCurrent, seatCheck);
          if (!isCompatible(seatCurrent, seatCheck)) {
            for (const findingPartners of seatOrder) {
              let exit = false;
              for (const findingPartner of findingPartners) {
                if (isCompatible(seatCurrent, findingPartner) && seatCheck.gender === findingPartner.gender) {
                  const temp = seatCheck;

                  // console.log(structuredClone(seatCurrent), structuredClone(findingPartner), structuredClone(seatCheck), structuredClone(findingPartners));

                  seatOrder[seatOrder.indexOf(seats)][seats.indexOf(seatCheck)] = findingPartner;
                  seatOrder[seatOrder.indexOf(findingPartners)][findingPartners.indexOf(findingPartner)] = temp;

                  exit = true;
                  break;
                }
              }
              if (exit) break;
            }
          }
        }
      }
    }

    // console.log(seatOrder);

    setDisplaySeats(seatOrder);

    setMessageBoard("Seats generate successfully!");
  }

  async function captureSeats() {
    if (typeof displaySeats === "undefined") {
      setMessageBoard("The groups is has not been generated.", "error");
      return
    }

    if (!captureSeatsRef.current) return;

    const clone = captureSeatsRef.current.cloneNode(true) as HTMLElement;

    const wrapper = document.createElement("div");
    wrapper.classList.add("max-w-4xl", "mx-auto", "mt-12", "px-6", "bg-black");

    wrapper.appendChild(clone);

    document.body.appendChild(wrapper);

    const result = await snapdom(wrapper, { scale:2, embedFonts: true});

    document.body.removeChild(wrapper);

    const canvas = await result.toCanvas();

    console.log(canvas);

    const pngBlob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("toBlob returned null"));
          return;
        }
        resolve(blob);
      }, "image/png");
    });

    const SeatsImage = new File([pngBlob], 'seats-image.png', {type: 'image/png'});

    if (navigator.share && navigator.canShare?.({files: [SeatsImage]})) {
        await navigator.share({
            files: [SeatsImage],
            title: 'Group-chart baru'
        });
        setMessageBoard('The groups has been shared!');
    } else {
        const url = URL.createObjectURL(SeatsImage);

        const a = document.createElement('a');
        a.href = url;
        a.download = SeatsImage.name;
        a.click();

        URL.revokeObjectURL(url);

        setMessageBoard('The groups has been shared trough download!');
    }
  }

  return (
    <>
      <div className="max-w-4xl mx-auto px-6 z-0 relative">
        <div className="glass-panel rounded-lg p-8 space-y-6">
            <InputSelect
              name="Class"
              dataset={CLASSDATA}
              value={classSelected}
              onChange={(e) => setClassSelected(e)}
            />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative flex flex-col gap-2">
              <label className="text-[16px] uppercase tracking-[0.2em] font-bold text-pink-500/80 px-1">
                Set Color
              </label>

              <div className="relative flex flex-col items-center w-full bg-surface-container-highest border-0 rounded-4xl px-7 py-3 gap-2 cursor-pointer ">
                <div className="relative flex flex-row items-center gap-1 ml-2 sm:ml-0 select-none">
                  <span className="material-symbols-outlined">palette</span>
                  <div className="text-xl">
                    <mark className="ml-1 text-pink-500 bg-transparent">
                      Girls
                    </mark>{' '}
                    color
                  </div>
                </div>

                <ColorPicker color={girlColor} pallete={DEFAULTPALLETE} onChange={setGirlColor}/>
              </div>
            </div>

            <div className="relative flex flex-col gap-2">
              <div className="relative flex flex-col items-center w-full bg-surface-container-highest border-0 rounded-4xl px-7 py-3 gap-2 mt-0 md:mt-8 cursor-pointer">
                <div className="relative flex flex-row items-center gap-1 ml-2 sm:ml-0 select-none">
                  <span className="material-symbols-outlined">palette</span>
                  <div className="text-xl">
                    <mark className="ml-1 text-blue-500 bg-transparent">
                      Boys
                    </mark>{' '}
                    color
                  </div>
                </div>

                <ColorPicker color={boyColor} pallete={DEFAULTPALLETE} onChange={setBoyColor}/>
              </div>
            </div>
          </div>

          <MessageInformation name="Message" message={message} messageType={messageType}/>
        </div>
      </div>

      <div className="mt-12 flex justify-center items-center flex-col md:flex-row px-6 gap-6 max-w-4xl mx-auto">
        {<ButtonProcess name="PROCESS SEAT" icon="settings_input_component" onClick={() => void generateSeats()}/>}

        {<ButtonProcess name="DOWNLOAD/SHARE SEAT" icon="download" onClick={() => void captureSeats()}/>}
      </div>

      <div className="max-w-4xl mx-auto mt-12 px-2 pointer-events-none">
        <div
          ref={captureSeatsRef}
          className="relative w-[99%] h-[99%] aspect-square mx-auto font-bold bg-white border-3 border-[#222222]"
          style={{
            containerType: 'inline-size',
            fontFamily: 'SFProDisplayRegular',
          }}
        >
          <span className="absolute text-[1.3cqw] text-black">
            Made by: o-matic.pages.dev
          </span>

          <div className="absolute left-[18%] top-[1.1%] w-[63.9%] h-[1.2%] bg-[#bb9679] border md:border-3 border-black rounded-[3px]"></div>
          <div className="absolute left-[97.2%] top-[7.2%] w-[1.3%] h-[17.1%] bg-[#bb9679] border md:border-3 border-black rounded-[3px]"></div>
          <div className="flex justify-center items-center absolute left-[1.4%] top-[12.3%] w-[16.2%] h-[9.6%] bg-[#ff9fcf] border md:border-3 border-black rounded-[3px]">
            <span
              className="material-symbols-outlined text-pink-500"
              style={{ fontSize: '6cqw' }}
            >
              school
            </span>
          </div>

          <div className="absolute left-[40.3%] top-[8%] w-[5.8%] h-[4.6%]" style={{backgroundColor: `#${girlColor}`}}></div>
          <div className="absolute left-[40.3%] top-[14.9%] w-[5.8%] h-[4.6%]" style={{backgroundColor: `#${boyColor}`}}></div>
          <span
            className="absolute left-[47.6%] top-[8%] w-[52%] text-black"
            style={{ fontSize: '5cqw', lineHeight: '5cqw' }}
          >
            <b>Perempuan</b>
          </span>
          <span
            className="absolute left-[47.6%] top-[15%] w-[52%] text-black"
            style={{ fontSize: '5cqw', lineHeight: '5cqw' }}
          >
            <b>Laki-Laki</b>
          </span>
          <span
            className="absolute top-[24.4%] w-[99.4%] text-black"
            style={{ fontSize: '3.35cqw' }}
          >
            📍hari senin-kamis sesuai ini 👇, jumat bebas!
          </span>

          <div
            className="absolute top-[33.6%] w-full h-full text-black"
            style={{ fontSize: '3.35cqw' }}
          >
            <SeatRowElement left="0" boyColor={boyColor} girlColor={girlColor} studentsSeats={displaySeats?.slice(0, 4)} />
            <SeatRowElement left="26.8%" boyColor={boyColor} girlColor={girlColor} studentsSeats={displaySeats?.slice(4, 8)} />
            <SeatRowElement left="53.7%" boyColor={boyColor} girlColor={girlColor} studentsSeats={displaySeats?.slice(8, 12)} />
            <SeatRowElement left="82%" boyColor={boyColor} girlColor={girlColor} studentsSeats={displaySeats?.slice(12, 16)} />
          </div>
        </div>
      </div>
    </>
  )
}
