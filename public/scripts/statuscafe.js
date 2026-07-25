import { setLocalStorageMinutes, getLocalStorage } from "./module/localstorage.js";

const cache_key = "scafe";
const cache_expire_minutes = 5;

async function getSCafeData() {
  let cache_data = getLocalStorage(cache_key);
  if (cache_data) {
    return JSON.parse(cache_data);
  }

  let response = await fetch("https://status.cafe/users/sharky/status.json");
  response = await response.json();

  let data = {
    author: response.author,
    timeAgo: response.timeAgo,
    content: response.content,
  };

  setLocalStorageMinutes(cache_key, JSON.stringify(data), cache_expire_minutes);

  return data;
}

try {
  let data = await getSCafeData();

  document.getElementById("statuscafe-username").innerHTML =
    '<a href="https://status.cafe/users/sharky" target="_blank">' + data.author + "</a> ";
  document.getElementById("statuscafe-ago").textContent = data.timeAgo;
  document.getElementById("statuscafe-content").textContent = `"${data.content}"`;
} catch (e) {
  console.log(e);
  let el = document.getElementById("statuscafe");

  if (e.toString().includes("NetworkError")) {
    el.innerHTML = '<span class="error-text">[Network error]</span> while trying to fetch from status.cafe';
  } else {
    el.innerHTML =
      'Some sort of <span class="error-text">error</span> has occoured while fetching data from status.cafe';
  }
}
