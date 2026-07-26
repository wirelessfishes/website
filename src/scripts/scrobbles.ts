import { getEl } from "./module/dom.js";
import {
  getRecentTracks,
  getNowPlaying,
  getUserInfo,
  Track,
  getLastPlayed,
  getTrackCover,
  UserInfoResponse,
  getUserAvatar,
  trackTimeAgo,
} from "./module/lastfm.js";

let last_now_playing: Track | null = null;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function trackCard(track: Track, dynamic_bg?: boolean): string {
  let dynamic_bg_str = "";
  if (dynamic_bg) {
    dynamic_bg_str = `
    <div class="scrobble-dynamicbg">
      <img loading="lazy" src="${getTrackCover(track)}" />
    </div>
    `;
  }

  return `
  <div class="scrobble-track${dynamic_bg ? " scrobble-track_dynamic" : ""}">
    <img src="${getTrackCover(track, "large")}" loading="lazy" class="scrobble-track_img" />

    <div class="scrobble-track_info">
      <div class="scrobble-track_name">${track.name}</div>
      <div class="scrobble-track_artist">${track.artist["#text"]}</div>
    </div>

    ${dynamic_bg_str}
  </div>
  `;
}

function userCard(user: UserInfoResponse): string {
  return `
  <div class="scrobble-user">
    <img src="${getUserAvatar(user, "large")}" loading="lazy" class="scrobble-user_img" />

    <div class="scrobble-user_info">
      <a href="${user.user.url}" class="scrobble-user_name">${user.user.name} 🡕</a>
      <div>${user.user.playcount} total scrobbles</div>
    </div>
  </div>
  `;
}

async function updateActivity() {
  const tracks = await getRecentTracks(1);
  const activity_container = getEl("scrobbles-activity");
  const now_playing = getNowPlaying(tracks);
  const activity_title = getEl<HTMLHeadingElement>("scrobbles-activity_title");

  if (now_playing && now_playing.mbid != last_now_playing?.mbid) {
    activity_title.textContent = `Latest Activity (${trackTimeAgo(now_playing)})`;
    activity_container.innerHTML = trackCard(now_playing, true);
    last_now_playing = now_playing;
  } else if (!now_playing) {
    const last_played = getLastPlayed(tracks);

    if (last_played) {
      activity_title.textContent = `Latest Activity (${trackTimeAgo(last_played)})`;
      activity_container.innerHTML = trackCard(last_played, true);
    } else {
      activity_container.innerHTML = "Something went wrong :(";
    }
  }
}

async function updateActivityLoop(delay_ms: number) {
  while (true) {
    await updateActivity().catch(console.error);
    await sleep(delay_ms);
  }
}

async function render() {
  const tracks = await getRecentTracks(16);
  const user_info = await getUserInfo();

  const recent_container = getEl("scrobbles-recent");
  const user_info_container = getEl("scrobbles-info");

  let final_html = "";
  tracks.recenttracks.track.forEach((track: Track) => {
    if (track != getNowPlaying(tracks)) {
      final_html += trackCard(track);
    }
  });

  recent_container.innerHTML = final_html;
  user_info_container.innerHTML = userCard(user_info);
}

render().catch((error) => {
  console.error("Failed to render scrobbles:", error);

  const recent_container = getEl("scrobbles-recent");
  const user_info_container = getEl("scrobbles-info");

  if (recent_container) {
    recent_container.innerHTML = "Failed to load scrobbles.";
  }

  if (user_info_container) {
    user_info_container.innerHTML = "Failed to load user info.";
  }
});

updateActivityLoop(15 * 1000); // 15 seconds
