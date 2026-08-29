import type { GuestbookEntry, GuestbookResponse } from "../types/guestbook";
import { getLocalStorage, setLocalStorageMinutes } from "./localstorage";

const API = "https://api.wireless.fish/guestbook";

let name_map: Map<number, string> = new Map<number, string>();

async function api_getGuestbook(): Promise<GuestbookResponse> {
  const url = new URL(API);

  // Actually parse the stuff
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Backend error while trying to fetch guestbook data: ${response.status}`);
  }

  const data: GuestbookResponse = await response.json();
  if (data.count == 0) {
    throw new Error(`guestbook api error`);
  }

  data.entries.forEach((comment) => {
    comment.replies.forEach((reply) => {
      name_map.set(reply.id, reply.name);
    });

    name_map.set(comment.id, comment.name);
  });

  return data;
}

export async function getGuestbook(): Promise<GuestbookResponse> {
  // const cache_key = "guestbook";
  // const cached_data = getLocalStorage(cache_key);

  // if (cached_data) return JSON.parse(cached_data);

  const data = await api_getGuestbook();
  // setLocalStorageMinutes(cache_key, JSON.stringify(data), 1);

  return data;
}

export function resolveIdToName(id: number): string | undefined {
  return name_map.get(id);
}
