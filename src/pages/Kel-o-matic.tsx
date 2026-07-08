import { useRef, useState } from 'react';
import ButtonProcess from '../components/user-input/ButtonProcess'
import MessageInformation, {type messageTypeCheck} from '../components/user-input/Message';
import CLASSDATA from '../utils/classData';
import getStudentsData, { type studentsType, type studentType } from '../services/getStudentsData';
import shuffleArray from '../utils/shuffleArray';
import useLocalStorage from '../utils/useLocalStorage';
import { snapdom } from '@zumer/snapdom';
import NotificationWindow from '../components/notification/notificationWindow';
import InputSelect from '../components/user-input/InputSelect';
import InputNumber from '../components/user-input/InputNumber';
import getBlacklistsData, {type blacklistsType} from '../services/getBlacklistsData';
import CLASSNUMBER from '../utils/classNumber';

export default function Kel() {
  const GENERATIONTYPEDATA = [
    {name: 'Student Absent', value: 'absent'},
    {name: 'Student Name', value: 'name'},
  ];

  const TYPESEARCHDATA = [
    {name: 'Group', value: 'group'},
    {name: 'Member', value: 'member'},
  ];

  const HOWMUCHDATA = {min: "3", max: "10"};

  const [classSelected, setClassSelected] = useLocalStorage("classSelected", "1");
  const [generationType, setGenerationType] = useLocalStorage("group-generationType", "absent");
  const [typeSearch, setTypeSearch] = useLocalStorage("group-typeSearch", "group");
  const [totalItem, setTotalItem] = useLocalStorage("group-totalItem", "3");

  const [message, setMessage] = useState("Nothing to Do");
  const [messageType, setMessageType] = useState<messageTypeCheck>("info");

  const [displayGroup, setDisplayGroups] = useState<studentsType[]>();

  const captureGroupsRef = useRef <HTMLDivElement | null>(null);

  const [notificationState, setNotificationState] = useState(true);

  const setMessageBoard = (message: string, messageType: messageTypeCheck = "info") => {
    setMessage(message);
    setMessageType(messageType);
  }

  async function generateGroups() {
    console.log(totalItem, typeSearch, generationType, classSelected);

    let totalGroup = null;
    let totalMembers = null;

    const groups: studentsType[] = [];

    let students: studentsType;
    try {
      students = await getStudentsData(Number(classSelected));
    } catch {
      setMessageBoard('Something went wrong while fetching data.', "error");
      return;
    }

    const studentsLength = students.length;

    let blacklistsPartner: blacklistsType;
    try {
      blacklistsPartner = await getBlacklistsData(Number(classSelected));
    } catch {
      setMessageBoard('Something went wrong while fetching data for a particular.', "error");
      return;
    }

    if (totalItem === '') {
      setMessageBoard("Total item must not be empty.", "error");
      return;
    }

    if (typeSearch === "group") {
      totalGroup = Number(totalItem);
      totalMembers = null;
    } else if (typeSearch === "member") {
      totalGroup = null;
      totalMembers = Number(totalItem);
    }

    if (totalGroup !== null && totalGroup > studentsLength) {
      setMessageBoard("Total groups cannot be more than total students.", "error");
      return;
    }

    if (totalMembers !== null && totalMembers > studentsLength) {
      setMessageBoard("Total groups cannot be more than total students.", "error");
      return;
    }

    if ((totalGroup !== null && totalGroup <= 0) || (totalMembers !== null && totalMembers <= 0)) {
      setMessageBoard("Total item must be greater than 0.", "error");
      return;
    }

    // if ((totalMembers !== null && totalMembers < 1) && totalGroup === null) {
    //   setMessageBoard("Total members must be at least 1.", "error");
    //   return;
    // }

    if (totalGroup !== null && totalMembers !== null) {
      setMessageBoard("Invalid combination of total groups and members. and i dont expect this to happen. because it should be either groups or members. This only happen when the code is changed!", "error");
      return;
    }

    if (totalMembers !== null && totalMembers > 0) {
      totalGroup = Math.floor(studentsLength/totalMembers);
    }

    if (totalGroup !== null && totalGroup <= 1) {
      setMessageBoard("Total groups must be greater than 1.", "error");
      return;
    }

    if (totalGroup === null) {
      setMessageBoard("Somehow the check is failed?", "error");
      return;
    }

    let studentsGirls: studentsType = [];
    let studentsBoys: studentsType = [];

    for (const student of students) {
      if (student.gender === "P") studentsGirls.push(student);
      else if (student.gender === "L") studentsBoys.push(student);
    }
    
    console.log(`Boy: ${structuredClone(studentsBoys.length)}, Girl: ${structuredClone(studentsGirls.length)}`);

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

    const groupsRowSize: number[] = [];
    let groupIndex = 0;
    for (let i = 0; i < students.length; i++) {
      groupsRowSize[groupIndex] = (groupsRowSize[groupIndex] ?? 0) + 1;
      groupIndex++;
      if (groupIndex >= totalGroup) {
        groupIndex = 0;
      }
    }

    for (const groupRowSize of groupsRowSize) {
      const rowSize = groupRowSize;
      const numberOfGirls = Math.round((studentsGirls.length / (studentsGirls.length + studentsBoys.length)) * rowSize);
      const numberOfBoys = rowSize - numberOfGirls;

      const row: studentsType = [];
      for (let i = 0; i < numberOfGirls; i++) {
        if (studentsGirls.length === 0) break;
        const studentGirl = studentsGirls.pop();

        if (!studentGirl) break;

        row.push(studentGirl);
      }
      for (let i = 0; i < numberOfBoys; i++) {
        if (studentsBoys.length === 0) break;
        const studentBoy = studentsBoys.pop();

        if (!studentBoy) break;

        row.push(studentBoy);
      }

      groups.push(row);
    }

    for (const seats of groups) {
      // if (!isCompatible(seats[0], seats[1]) || !isCompatible(seats[1], seats[0])) {
      //   console.log(seats, isCompatible(seats[0], seats[1]) ? "Girl" : "", isCompatible(seats[1], seats[0]) ? "Boy" : "");
      //   throw new Error("a");
      // }



      // if (!isCompatible(seats[0], seats[1])) {
      //   for (const findingPartner of groups) {
      //     if (!isCompatible(seats[0], findingPartner[1])) {
      //       console.log(seats, findingPartner);
            
      //       const temp1 = seats[1];

      //       groups.splice(groups.indexOf(seats), 1, [seats[0], findingPartner[1]]);
      //       groups.splice(groups.indexOf(findingPartner), 1, [findingPartner[0], temp1]);
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
            for (const findingPartners of groups) {
              let exit = false;
              for (const findingPartner of findingPartners) {
                if (isCompatible(seatCurrent, findingPartner) && seatCheck.gender === findingPartner.gender) {
                  const temp = seatCheck;

                  // console.log(structuredClone(seatCurrent), structuredClone(findingPartner), structuredClone(seatCheck), structuredClone(findingPartners));

                  groups[groups.indexOf(seats)][seats.indexOf(seatCheck)] = findingPartner;
                  groups[groups.indexOf(findingPartners)][findingPartners.indexOf(findingPartner)] = temp;

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


    setDisplayGroups(groups);

    console.log(groups);

    // if (isThereAnyChange) setMessageBoard("Groups generated successfully!!", "info");
    // else 
    setMessageBoard("Groups generated successfully!");
  }

  async function captureGroups() {
    if (typeof displayGroup === 'undefined') {
      setMessageBoard("The groups is has not been generated.", "error");
      return
    }

    if (!captureGroupsRef.current) return;

    const clone = captureGroupsRef.current.cloneNode(true) as HTMLElement;

    const wrapper = document.createElement("div");
    wrapper.classList.add("max-w-4xl", "mx-auto", "mt-12", "px-6", "bg-black");

    wrapper.appendChild(clone);

    document.body.appendChild(wrapper);

    const result = await snapdom(wrapper, { scale:2, embedFonts: true});

    document.body.removeChild(wrapper);

    const canvas = await result.toCanvas();

    const pngBlob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("toBlob returned null"));
          return;
        }
        resolve(blob);
      }, "image/png");
    });

    const GroupsImage = new File([pngBlob], 'groups-image.png', {type: 'image/png'});

    if (navigator.share && navigator.canShare?.({files: [GroupsImage]})) {
        await navigator.share({
            files: [GroupsImage],
            title: 'Group-chart baru'
        });
        setMessageBoard('The groups has been shared!');
    } else {
        const url = URL.createObjectURL(GroupsImage);

        const a = document.createElement('a');
        a.href = url;
        a.download = GroupsImage.name;
        a.click();

        URL.revokeObjectURL(url);

        setMessageBoard('The groups has been shared trough download!');
    }
  }

  return (
    <>
      <NotificationWindow
        hiddenState={notificationState}
        onExit={() => setNotificationState(true)}
      >
        <div className="mb-8 flex justify-between items-center min-h-auto">
          <div className="text-[clamp(25px,5vw,30px)] leading-[clamp(1.5rem,1vw,0.2rem)] uppercase tracking-[0.15em] font-bold text-pink-400">Input explanation</div>
        </div>
        
        <div className="text-[16px] uppercase tracking-[0.2em] font-bold text-pink-500/80">Generation type</div>
        <div className="tracking-wide">Controls result format — <b><i>Student Absent</i></b> shows numbers, <b><i>Student Name</i></b> shows short names.</div>
        <div className="h-4"></div>

        <div className="text-[16px] uppercase tracking-[0.2em] font-bold text-pink-500/80">Type search</div>
        <div className="tracking-wide">Choose <b><i>Group</i></b> to set number of groups, or <b><i>Member</i></b> to set students per group.</div>
        <div className="h-4"></div>

        <div className="text-[16px] uppercase tracking-[0.2em] font-bold text-pink-500/80">How much</div>
        <div className="tracking-wide">The 'n' for Type Search. For example, <mark style={{backgroundColor: "#743665", color: "white"}}><i>Member</i> + {totalItem}</mark> = {totalItem} students per group. <mark style={{backgroundColor: "#743665", color: "white"}}><i>Group</i> + {totalItem}</mark> = {totalItem} groups (with <b>student amount</b> and <b>group's student gender ratio</b> spread evenly).</div>
        <div className="h-4"></div>

        <div className="text-[16px] uppercase tracking-[0.2em] font-bold text-pink-500/80">Smart finder</div>
        <div className="tracking-wide">Currently unavailable. because the dev is not in the mood to add this feature {"</3"}. this is a intensive feature and chalange dev moral to add this.</div>
      </NotificationWindow>

      <div className="absolute top-0 -left-20 w-96 h-96 bg-primary-dim/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-40 -right-20 w-125 h-125 bg-secondary-dim/5 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-6 z-0 relative">
        <div className="glass-panel rounded-lg p-8 space-y-6 border border-surface-container-highest">
          <div className="absolute right-0 pr-8 top-0 pt-6">
            <button
              className="text-on-surface-variant text-lg hover:text-on-surface flex justify-end items-center gap-3 rounded-full glass-panel py-2 pr-2 pl-3 max-w-11 hover:max-w-xl truncate transition-all cursor-pointer"
              onClick={() => setNotificationState(false)}
            >
              <span className="text-on-surface">Input Hint</span>
              <span
                className="material-symbols-outlined"
                style={{ fontSize: '28px' }}
              >
                help
              </span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <InputSelect
              name="Class"
              dataset={CLASSDATA}
              value={`${CLASSNUMBER}-${classSelected}`}
              onChange={(e) => {setClassSelected(e); setDisplayGroups(undefined); setMessageBoard("Nothing to Do")}}
            />

            <InputSelect
              name="Generation Type"
              dataset={GENERATIONTYPEDATA}
              value={generationType}
              onChange={(e) => setGenerationType(e)}
            />
          </div>

          <InputSelect
            name="Type Search"
            dataset={TYPESEARCHDATA}
            value={typeSearch}
            onChange={(e) => {setTypeSearch(e); setDisplayGroups(undefined); setMessageBoard("Nothing to Do")}}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputNumber
              name="How Much"
              dataset={HOWMUCHDATA}
              value={totalItem}
              onChange={(e, type) => {
                if (e) {
                  setTotalItem(e);
                } else if (typeof e !== "undefined") {
                  setTotalItem("");
                }

                if (typeof e === "undefined") {
                  if (type === "minus") {
                    if (Number(totalItem) > Number(HOWMUCHDATA.min)) setTotalItem((Number(totalItem) - 1).toString());
                  } else if (type === "add") {
                    if (Number(totalItem) < Number(HOWMUCHDATA.max)) setTotalItem((Number(totalItem) + 1).toString());
                  }
                }

                setDisplayGroups(undefined);
                setMessageBoard("Nothing to Do");
              }}
            />

            <div className="relative flex flex-col gap-2">
              <div className="flex items-center justify-between w-full bg-surface-container-low border border-surface-container rounded-full px-6 h-15 md:mt-8 gap-2">
                <label className="text-[16px] uppercase tracking-[0.2em] font-bold text-pink-500/80 px-1">
                  Smart Finder
                </label>

                {/* off: bg-surface-highest, on: bg-primary shadow-[0_0_15px_rgba(255,136,181,0.5)] */}
                <button
                  disabled
                  className="relative inline-flex h-8 w-17 items-center rounded-full bg-surface-container-highest disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {/* off: translate-x-1, on: translate-x-10 */}
                  <span className="translate-x-1 inline-block h-5 w-5 transform rounded-full bg-white transition"></span>
                </button>
              </div>
            </div>
          </div>

          <MessageInformation name="Message" message={message} messageType={messageType}/>
        </div>
      </div>

      <div className="mt-12 flex justify-center items-center flex-col md:flex-row px-6 gap-6 max-w-4xl mx-auto">
        {<ButtonProcess 
          name="PROCESS GROUP" 
          icon="settings_input_component"
          onClick={() => void generateGroups()} 
        />}

        {<ButtonProcess
          name="DOWNLOAD/SHARE GROUP"
          icon="download"
          onClick={() => void captureGroups()}
        />}
      </div>

      <div className="max-w-4xl mx-auto mt-12 px-6">
        <div ref={captureGroupsRef} className={`p-6 relative glass-panel rounded-lg border border-surface-container-highest ${typeof displayGroup === 'undefined' ? "hidden" : ""}`}>
          <div className="flex items-center bg-surface-container-highest border border-surface-container-highestest rounded-full px-6 mb-6">
            <input
              className="w-full bg-transparent border-0 py-4 text-on-surface focus:ring-0 font-medium text-3xl text-center font-SF-Pro-Regular"
              type="text"
              placeholder={totalItem === "2" ? "glorified Seats" : 'Group Name'}
            />
          </div>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(90px,100%),1fr))] gap-6">
            {displayGroup?.map((group) => (
              <div 
                className='p-2 pb-4 glass-panel rounded-4xl border border-surface-container-highestest flex flex-col items-center'
              >
                <span className='text-xl flex text-center leading-5 mt-1'>Group<br />{displayGroup.indexOf(group)+1}</span>
                <div className='bg-white h-0.75 w-[80%] mb-1 mt-1'></div>
                <div className='flex flex-col items-center'>
                  {group.map((student) => (
                    <span className={student.gender === "P" ? "text-pink-500" : "text-blue-500"}>{generationType === "absent" ? student.absent : student.name}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
