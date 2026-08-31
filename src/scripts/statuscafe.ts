import { getEl } from "./module/dom.js";
import { setLocalStorageMinutes, getLocalStorage } from "./module/localstorage.js";

const CACHE_KEY = "SCAFE";
const CACHE_EXPIRE_MINUTES = 5;

export interface StatusCafe {
  author: string;
  timeAgo: string;
  content: string;
}

export async function getSCafeData(): Promise<StatusCafe> {
  let cache_data = getLocalStorage(CACHE_KEY);
  if (cache_data) {
    return JSON.parse(cache_data);
  }

  const raw = await fetch("https://status.cafe/users/sharky/status.json");
  const json: StatusCafe = await raw.json();

  let data = {
    author: json.author,
    timeAgo: json.timeAgo,
    content: json.content,
  };

  setLocalStorageMinutes(CACHE_KEY, JSON.stringify(data), CACHE_EXPIRE_MINUTES);

  return data;
}
