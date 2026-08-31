import { setLocalStorageMinutes, getLocalStorage } from "./module/localstorage";

const CACHE_KEY = "NW_STATS";

export interface NekowebStats {
  domain: string;
  title: string;
  updates: number;
  followers: number;
  views: number;
  created_at: Date;
  updated_at: Date;
}

export async function getNekowebStats(domain: string): Promise<NekowebStats> {
  let cached = getLocalStorage(CACHE_KEY);

  if (cached) {
    return JSON.parse(cached) as NekowebStats;
  }

  let response = await fetch(`https://nekoweb.org/api/site/info/${domain}`);

  if (!response.ok) {
    throw new Error(`Error while fetching nekoweb stats ${response.status}`);
  }

  let parsed = await response.json();
  setLocalStorageMinutes(CACHE_KEY, JSON.stringify(parsed), 5);

  return {
    domain: parsed["domain"],
    title: parsed["title"],
    updates: parsed["updates"],
    followers: parsed["followers"],
    views: parsed["views"],
    created_at: new Date(parsed["created_at"]),
    updated_at: new Date(parsed["updated_at"]),
  };
}
