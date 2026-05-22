export type blacklistsType = {
  absent: number;
  blacklistsPartner: number[];
}[];

let blacklistsCache: blacklistsType;
let blacklistsCacheClass: number;

export default async function getBlacklistsData(cls: number) {
  if (blacklistsCacheClass === cls) {
    return blacklistsCache;
  }

  try {
    const response = await fetch(`http://localhost:8787/?type=blacklistsPartnerNew&index=${cls}`);
    if (!response.ok) throw new Error("Failed to fetch student data");

    const rawdata = await response.json() as blacklistsType;

    blacklistsCache = rawdata;
    blacklistsCacheClass = cls;

    return rawdata;
  } catch {
    if (!navigator.onLine) throw new Error("No internet connection");
    throw new Error("Connection issue, please try again later :>");
  }
}