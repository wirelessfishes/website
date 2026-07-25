import { setLocalStorageMinutes, getLocalStorage, setLocalStorageSeconds } from "./localstorage.js";

// for api types check https://github.com/wirelessfishes/website-backend
interface Track {
  "@attr"?: { nowplaying: "true" };
  "artist": { "#text": string; "mbid": string };
  "album": { "#text": string; "mbid": string };
  "image": Array<{ "size": string; "#text": string }>;
  "date"?: { "uts": string; "#text": string };
  "url": string;
  "name": string;
  "mbid": string;
  "streamable": "0" | "1";
  "loved"?: "0" | "1";
}
interface RecentTracksResponse {
  recenttracks: {
    "@attr": {
      page: string;
      total: string;
      user: string;
      perPage: string;
      totalPages: string;
    };
    "track": Track[];
  };
}
interface UserInfoResponse {
  user: {
    id: string;
    name: string;
    realname: string;
    url: string;
    image: string;
    country: string;
    age: string;
    gender: string;
    subscriber: string;
    playcount: string;
    playlists: string;
    bootstrap: string;
    registered: {
      "unixtime": string;
      "#text": string;
    };
  };
}

const API_RECENT_TRACKS = "https://api.wireless.fish/lastfm/recent";
const API_INFO = "https://api.wireless.fish/lastfm/info";

const USERNAME = "sharkyblacktip";

// === API FUNCTIONS ===

async function api_getRecentTracks(username: string, limit?: number): Promise<RecentTracksResponse> {
  const url = new URL(API_RECENT_TRACKS);
  url.searchParams.set("user", username);
  if (limit) url.searchParams.set("limit", String(limit));

  // Actually parse the stuff
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Backend error while trying to fetch recent tracks: ${response.status}`);
  }

  return await response.json();
}

async function api_getUserInfo(username: string): Promise<UserInfoResponse> {
  const url = new URL(API_INFO);
  url.searchParams.set("user", username);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Backend error while trying to fetch user info: ${response.status}`);
  }

  return await response.json();
}

// === WRAPPER FUNCTIONS ===

export async function getRecentTracks(limit?: number): Promise<RecentTracksResponse> {
  const cacheKey = limit ? `lastfm-recent-${limit}` : "lastfm-recent";

  const cached = getLocalStorage(cacheKey);
  if (cached) return JSON.parse(cached);

  const data = await api_getRecentTracks(USERNAME, limit);
  // 15 second cache bc it refreshes often
  setLocalStorageSeconds(cacheKey, JSON.stringify(data), 15);
  return data;
}

export async function getUserInfo(): Promise<UserInfoResponse> {
  const cacheKey = `lastfm-info`;

  const cached = getLocalStorage(cacheKey);
  if (cached) return JSON.parse(cached);

  const data = await api_getUserInfo(USERNAME);
  // 1 minute just to prevent refresh spam
  setLocalStorageMinutes(cacheKey, JSON.stringify(data), 1);
  return data;
}

// === HELPER FUNCTIONS ===

export function getNowPlaying(tracks: RecentTracksResponse): Track | null {
  return tracks.recenttracks.track.find((t) => t["@attr"]?.nowplaying === "true") ?? null;
}

export function getLastPlayed(tracks: RecentTracksResponse): Track | null {
  return tracks.recenttracks.track.find((t) => !t["@attr"]) ?? null;
}

export function getTrackCover(track: Track, size: "small" | "medium" | "large" | "extralarge" = "large"): string {
  return track.image.find((img) => img.size === size)?.["#text"] ?? "";
}
