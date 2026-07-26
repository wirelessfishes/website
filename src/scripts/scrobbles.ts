import { getEl } from "./module/dom";
import {
  getRecentTracks,
  getNowPlaying,
  getUserInfo,
  Track,
  getLastPlayed,
  trackTimeAgo,
  getTrackCover,
  UserInfoResponse,
  USERNAME,
  getUserAvatar,
} from "./module/lastfm";

let last_now_playing: Track | null = null;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function trackCard(track: Track): string {
  return `
  <div class="scrobble-track">
    <img src="${getTrackCover(track, "large")}" loading="lazy" class="scrobble-track_img" />

    <div class="scrobble-track_info">
      <div class="scrobble-track_name">${track.name}</div>
      <div class="scrobble-track_artist">${track.artist["#text"]}</div>
      <div class="scrobble-track_ago">${trackTimeAgo(track)}</div>
    </div>
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

  if (now_playing && now_playing.mbid != last_now_playing?.mbid) {
    activity_container.innerHTML = trackCard(now_playing);
    last_now_playing = now_playing;
  } else if (!now_playing) {
    const last_played = getLastPlayed(tracks);

    if (last_played) {
      activity_container.innerHTML = trackCard(last_played);
    } else {
      activity_container.innerHTML = "Something went wrong :(";
    }
  }
}

async function updateActivityLoop(delay_ms: number) {
  while (true) {
    await updateActivity();
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

render();

updateActivityLoop(15 * 1000); // 15 seconds
