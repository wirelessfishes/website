import { getEl } from "./module/dom.js";
import { setLocalStorageMinutes, getLocalStorage } from "./module/localstorage.js";

const cache_key = "scafe";
const cache_expire_minutes = 5;

interface StatusCafe {
  author: string;
  timeAgo: string;
  content: string;
}

async function getSCafeData() {
  let cache_data = getLocalStorage(cache_key);
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

  setLocalStorageMinutes(cache_key, JSON.stringify(data), cache_expire_minutes);

  return data;
}

try {
  let data = await getSCafeData();

  getEl("statuscafe-username").innerHTML =
    '<a href="https://status.cafe/users/sharky" target="_blank">' + data.author + "</a> ";
  getEl("statuscafe-ago").textContent = data.timeAgo;
  getEl("statuscafe-content").textContent = `"${data.content}"`;
} catch (e) {
  console.log(e);
  let el = getEl("statuscafe");

  if (e instanceof Error && e.toString().includes("NetworkError")) {
    el.innerHTML = '<span class="error-text">[Network error]</span> while trying to fetch from status.cafe';
  } else {
    el.innerHTML =
      'Some sort of <span class="error-text">error</span> has occoured while fetching data from status.cafe';
  }
}
