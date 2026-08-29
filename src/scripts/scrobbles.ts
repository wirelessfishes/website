import { getEl } from "./module/dom.js";
import {
  getRecentTracks,
  getNowPlaying,
  getUserInfo,
  type Scrobble,
  getLastPlayed,
  getScrobbleCover,
  type UserInfo,
  getUserAvatar,
  trackTimeAgo,
  getTopTracks,
  getTopArtists,
  getTrackCover,
  getArtistImage,
} from "./module/lastfm.js";
import type { Artist, Track } from "./types/lastfm.js";

let last_now_playing: Scrobble | null = null;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function scrobbleCard(track: Scrobble, dynamic_bg?: boolean): string {
  let dynamic_bg_str = "";
  if (dynamic_bg) {
    dynamic_bg_str = `
    <div class="scrobble-dynamicbg">
      <img loading="lazy" src="${getScrobbleCover(track)}" />
    </div>
    `;
  }

  return `
  <a href="${track.url}" target="_blank" class="scrobble-track${dynamic_bg ? " scrobble-track_dynamic" : ""}">
    <img src="${getScrobbleCover(track, "large")}" loading="lazy" class="scrobble-track_img" />

    <div class="scrobble-track_info">
      <div class="scrobble-track_name">${track.name}</div>
      <div class="scrobble-track_artist">${track.artist["#text"]}</div>
    </div>

    ${dynamic_bg_str}
  </a>
  `;
}

function topTrackCard(track: Track, rank?: number): string {
  return rank
    ? `
  <div>
      #${rank} <b>${track.name}</b> - ${track.artist.name} (${track.playcount})
  </div>`
    : `
  <div>
      ${track.name} by ${track.artist.name}
  </div>`;
}

function topArtistCard(artist: Artist, rank?: number): string {
  return rank
    ? `
  <div>
      #${rank} ${artist.name} (${artist.playcount})
  </div>
  `
    : `
  <div>
      ${artist.name}
  </div>
  `;
}

function userCard(user: UserInfo): string {
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
    activity_container.innerHTML = scrobbleCard(now_playing, true);
    last_now_playing = now_playing;
  } else if (!now_playing) {
    const last_played = getLastPlayed(tracks);

    if (last_played) {
      activity_title.textContent = `Latest Activity (${trackTimeAgo(last_played)})`;
      activity_container.innerHTML = scrobbleCard(last_played, true);
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

async function renderRecent() {
  const tracks = await getRecentTracks(16);
  const recent_container = getEl("scrobbles-recent");

  recent_container.innerHTML = "";
  const now_playing_track = getNowPlaying(tracks);
  tracks.recenttracks.track.forEach((track: Scrobble) => {
    if (track.mbid != now_playing_track?.mbid) {
      recent_container.innerHTML += scrobbleCard(track);
    }
  });
}

async function renderTopTracks() {
  const top_tracks_container = getEl("scrobbles-info_tracks");
  const top_tracks = await getTopTracks(10, "3month");

  top_tracks_container.innerHTML = "";
  top_tracks.toptracks.track.forEach((track: Track, i: number) => {
    top_tracks_container.innerHTML += topTrackCard(track, i + 1);
  });
}

async function renderTopArtists() {
  const top_artists_container = getEl("scrobbles-info_artists");
  const top_artists = await getTopArtists(10, "3month");

  top_artists_container.innerHTML = "";
  top_artists.topartists.artist.forEach((artist: Artist, i: number) => {
    top_artists_container.innerHTML += topArtistCard(artist, i + 1);
  });
}

async function renderUserInfo() {
  const user_info = await getUserInfo();
  const user_info_container = getEl("scrobbles-info");
  user_info_container.innerHTML = userCard(user_info);
}

async function render() {
  await Promise.all([renderRecent(), renderTopTracks(), renderTopArtists(), renderUserInfo()]);
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

  const scrobbles_section = getEl("scrobbles-section");
  scrobbles_section.innerHTML = `<span class="error-text">Failed to load scrobbles. Something went wrong or my backend is down :(</span>`;
  scrobbles_section.style.display = "block";
});

updateActivityLoop(15 * 1000); // 15 seconds
