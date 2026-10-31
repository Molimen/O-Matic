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

export class LimitError extends Error {}
export class ApiError extends Error {}

export default async function getStudentsData(cls: number) {

  try {
    const response = await fetch(`/api/tool?index=${cls}`);

    if (response.status === 429) throw new LimitError("Usage Limit reached");
    if (!response.ok) throw new ApiError("Failed to fetch student data");

    const rawdata = await response.json() as studentsType;
    return rawdata;
  } catch (e) {
    console.error(e);
    if (e instanceof LimitError || e instanceof ApiError) throw e;
    if (!navigator.onLine) throw new Error("No internet connection");
    throw new Error("Connection issue, please try again later :>");
  }
}