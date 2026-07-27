import { setLocalStorageMinutes, getLocalStorage, setLocalStorageSeconds } from "./localstorage.js";
import type {
  Scrobble,
  RecentTracks,
  UserInfo,
  LastFmError,
  LastFmImage,
  LastFmImageSize,
  TopTracks,
  TopAlbums,
  TopArtists,
  LastFmPeriod,
  Track,
  Artist,
} from "../types/lastfm.js";

export type { Scrobble, RecentTracks, UserInfo, LastFmImageSize };

const API_PROXY = "https://api.wireless.fish/lastfm/proxy";
const API_RECENT_TRACKS = API_PROXY + "/user.getRecentTracks";
const API_INFO = API_PROXY + "/user.getInfo";
const API_TOP_TRACKS = API_PROXY + "/user.getTopTracks";
const API_TOP_ALBUMS = API_PROXY + "/user.getTopAlbums";
const API_TOP_ARTISTS = API_PROXY + "/user.getTopArtists";

export const USERNAME = "sharkyblacktip";

// === API FUNCTIONS ===

async function api_getRecentTracks(username: string, limit?: number): Promise<RecentTracks> {
  const url = new URL(API_RECENT_TRACKS);
  url.searchParams.set("user", username);
  if (limit) url.searchParams.set("limit", String(limit));

  // Actually parse the stuff
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Backend error while trying to fetch recent tracks: ${response.status}`);
  }

  const data: RecentTracks | LastFmError = await response.json();
  if ("error" in data) {
    throw new Error(`Last.fm error ${data.error}: ${data.message}`);
  }

  return data;
}

async function api_getUserInfo(username: string): Promise<UserInfo> {
  const url = new URL(API_INFO);
  url.searchParams.set("user", username);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Backend error while trying to fetch user info: ${response.status}`);
  }

  const data: UserInfo | LastFmError = await response.json();
  if ("error" in data) {
    throw new Error(`Last.fm error ${data.error}: ${data.message}`);
  }

  return data;
}

async function api_getTopTracks(username: string, limit?: number, period?: LastFmPeriod): Promise<TopTracks> {
  const url = new URL(API_TOP_TRACKS);
  url.searchParams.set("user", username);

  if (period) url.searchParams.set("period", period);
  if (limit) url.searchParams.set("limit", String(limit));

  // Actually parse the stuff
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Backend error while trying to fetch top tracks: ${response.status}`);
  }

  const data: TopTracks | LastFmError = await response.json();
  if ("error" in data) {
    throw new Error(`Last.fm error ${data.error}: ${data.message}`);
  }

  return data;
}

async function api_getTopArtists(username: string, limit?: number, period?: LastFmPeriod): Promise<TopArtists> {
  const url = new URL(API_TOP_ARTISTS);
  url.searchParams.set("user", username);

  if (period) url.searchParams.set("period", period);
  if (limit) url.searchParams.set("limit", String(limit));

  // Actually parse the stuff
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Backend error while trying to fetch top artists: ${response.status}`);
  }

  const data: TopArtists | LastFmError = await response.json();
  if ("error" in data) {
    throw new Error(`Last.fm error ${data.error}: ${data.message}`);
  }

  return data;
}

async function api_getTopAlbums(username: string, limit?: number, period?: LastFmPeriod): Promise<TopAlbums> {
  const url = new URL(API_TOP_ALBUMS);
  url.searchParams.set("user", username);

  if (period) url.searchParams.set("period", period);
  if (limit) url.searchParams.set("limit", String(limit));

  // Actually parse the stuff
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Backend error while trying to fetch top albums: ${response.status}`);
  }

  const data: TopAlbums | LastFmError = await response.json();
  if ("error" in data) {
    throw new Error(`Last.fm error ${data.error}: ${data.message}`);
  }

  return data;
}

// === WRAPPER FUNCTIONS ===

export async function getRecentTracks(limit?: number): Promise<RecentTracks> {
  const cacheKey = limit ? `lastfm-recent-${limit}` : "lastfm-recent";

  const cached = getLocalStorage(cacheKey);
  if (cached) return JSON.parse(cached);

  const data = await api_getRecentTracks(USERNAME, limit);
  // 15 second cache bc it refreshes often
  setLocalStorageSeconds(cacheKey, JSON.stringify(data), 15);
  return data;
}

export async function getUserInfo(): Promise<UserInfo> {
  const cacheKey = `lastfm-info`;

  const cached = getLocalStorage(cacheKey);
  if (cached) return JSON.parse(cached);

  const data = await api_getUserInfo(USERNAME);
  // 1 minute just to prevent refresh spam
  setLocalStorageMinutes(cacheKey, JSON.stringify(data), 1);
  return data;
}

export async function getTopTracks(limit?: number, period?: LastFmPeriod): Promise<TopTracks> {
  const cacheKey = limit ? `lastfm-toptracks-${limit}` : "lastfm-toptracks";

  const cached = getLocalStorage(cacheKey);
  if (cached) return JSON.parse(cached);

  const data = await api_getTopTracks(USERNAME, limit, period);
  setLocalStorageMinutes(cacheKey, JSON.stringify(data), 1);
  return data;
}

export async function getTopAlbums(limit?: number, period?: LastFmPeriod): Promise<TopAlbums> {
  const cacheKey = limit ? `lastfm-topalbums-${limit}` : "lastfm-topalbums";

  const cached = getLocalStorage(cacheKey);
  if (cached) return JSON.parse(cached);

  const data = await api_getTopAlbums(USERNAME, limit, period);
  setLocalStorageMinutes(cacheKey, JSON.stringify(data), 1);
  return data;
}

export async function getTopArtists(limit?: number, period?: LastFmPeriod): Promise<TopArtists> {
  const cacheKey = limit ? `lastfm-topartists-${limit}` : "lastfm-topartists";

  const cached = getLocalStorage(cacheKey);
  if (cached) return JSON.parse(cached);

  const data = await api_getTopArtists(USERNAME, limit, period);
  setLocalStorageMinutes(cacheKey, JSON.stringify(data), 1);
  return data;
}

// === HELPER FUNCTIONS ===

const LASTFM_PLACEHOLDER_HASH = "2a96cbd8b46e442fc41c2b86b821562f";

function resolveImage(images: LastFmImage[], size: LastFmImageSize): string {
  const url = images.find((img) => img.size === size)?.["#text"] ?? "";
  if (url.includes(LASTFM_PLACEHOLDER_HASH)) return "";
  return url;
}

export function getNowPlaying(tracks: RecentTracks): Scrobble | null {
  return tracks.recenttracks.track.find((t) => t["@attr"]?.nowplaying === "true") ?? null;
}

export function getLastPlayed(tracks: RecentTracks): Scrobble | null {
  return tracks.recenttracks.track.find((t) => !t["@attr"]) ?? null;
}

export function getScrobbleCover(track: Scrobble, size: LastFmImageSize = "large"): string {
  return resolveImage(track.image, size);
}

export function getTrackCover(track: Track, size: LastFmImageSize = "large"): string {
  return resolveImage(track.image, size);
}

export function getArtistImage(artist: Artist, size: LastFmImageSize = "large"): string {
  return resolveImage(artist.image, size);
}

export function getUserAvatar(info: UserInfo, size: LastFmImageSize = "large"): string {
  return resolveImage(info.user.image, size);
}

export function formatAgo(seconds: number): string {
  if (seconds < 0) return "just now";
  const units: Array<[number, string]> = [
    [86400, "day"],
    [3600, "hour"],
    [60, "minute"],
    [1, "second"],
  ];
  for (const [threshold, unit] of units) {
    if (seconds >= threshold) {
      const value = Math.floor(seconds / threshold);
      return `${value} ${unit}${value !== 1 ? "s" : ""} ago`;
    }
  }
  return "just now";
}

export function trackTimeAgo(track: Scrobble): string {
  if (!track.date) return "right now";
  const secondsAgo = Math.floor(Date.now() / 1000 - Number(track.date.uts));
  return formatAgo(secondsAgo);
}
