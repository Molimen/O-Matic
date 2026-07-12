export type studentsType = {
  absent: number;
  gender: string;
  smartness: number;
  name: string;
}[];

export type studentType = {
  absent: number;
  gender: string;
  smartness: number;
  name: string;
};

let studentsCache: studentsType;
let studentsCacheClass: number;

export default async function getStudentsData(cls: number) {
  if (studentsCacheClass === cls) {
    return studentsCache;
  }

  try {
    // const response = await fetch('https://o-matic-person.molimen.workers.dev/?type=students');
    
    // const response = await fetch(`https://o-matic-person.molimen.workers.dev/?type=studentsNewSquared&index=${cls}`, {
    //   headers: { "X-API-Key": import.meta.env.VITE_API_KEY }
    // });
    const response = await fetch(`http://127.0.0.1:8787/?type=studentsNewSquared&index=${cls}`, {
      headers: {"X-API-Key": import.meta.env.VITE_API_KEY}
    });

    // const response = await fetch(`https://o-matic-person.molimen.workers.dev/?type=studentsNew&index=${cls}`);
    if (!response.ok) throw new Error("Failed to fetch student data");

    const rawdata = await response.json() as studentsType;

    studentsCache = rawdata;
    studentsCacheClass = cls;

    return rawdata;
  } catch {
    if (!navigator.onLine) throw new Error("No internet connection");
      throw new Error("Connection issue, please try again later :>");
  }
}