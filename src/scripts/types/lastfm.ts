export type LastFmImageSize = "small" | "medium" | "large" | "extralarge" | "mega"; // "mega" only returned for artists
export type LastFmPeriod = "overall" | "7day" | "1month" | "3month" | "6month" | "12month";

export interface LastFmImage {
  "size": LastFmImageSize;
  "#text": string;
}

export interface LastFmError {
  error: number;
  message: string;
}

export interface LastFmPagination {
  user: string;
  page: string;
  perPage: string;
  totalPages: string;
  total: string;
}

export interface Scrobble {
  "@attr"?: { nowplaying: "true" };
  "artist": { "#text": string; "mbid": string };
  "album": { "#text": string; "mbid": string };
  "image": LastFmImage[];
  "date"?: { "uts": string; "#text": string };
  "url": string;
  "name": string;
  "mbid": string;
  "streamable": "0" | "1";
  "loved"?: "0" | "1";
}

export interface RecentTracks {
  recenttracks: {
    "@attr": LastFmPagination;
    "track": Scrobble[];
  };
}

export interface UserInfo {
  user: {
    name: string;
    realname: string;
    url: string;
    image: LastFmImage[];
    country: string;
    age: string;
    gender: string;
    subscriber: string;
    playcount: string;
    playlists: string;
    bootstrap: string;
    type: string;
    album_count: string;
    artist_count: string;
    track_count: string;
    registered: {
      unixtime: string;
      "#text": number;
    };
    spotify_expiry_estimate?: {
      unixtime: string;
      "#text": number;
    };
  };
}

export interface Album {
  "@attr": { rank: string };
  "name": string;
  "playcount": string;
  "mbid": string;
  "url": string;
  "artist": { name: string; mbid: string; url: string };
  "image": LastFmImage[];
}

export interface TopAlbums {
  topalbums: {
    "@attr": { user: string; type: string };
    "album": Album[];
  };
}

export interface Artist {
  "@attr": { rank: string };
  "name": string;
  "playcount": string;
  "mbid": string;
  "url": string;
  "streamable": string;
  "image": LastFmImage[];
}

export interface TopArtists {
  topartists: {
    "@attr": { user: string; type: string };
    "artist": Artist[];
  };
}

export interface Track {
  "@attr": { rank: string };
  "name": string;
  "playcount": string;
  "mbid": string;
  "url": string;
  "streamable": { fulltrack: string; "#text": string };
  "artist": { name: string; mbid: string; url: string };
  "image": LastFmImage[];
  "duration"?: string;
}

export interface TopTracks {
  toptracks: {
    "@attr": { user: string; type: string };
    "track": Track[];
  };
}
