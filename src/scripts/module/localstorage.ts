const isBrowser = typeof window !== "undefined"; // to make astro ssr happy

export function setLocalStorageMinutes(name: string, value: string, minutes: number) {
  if (!isBrowser) return;
  let expiresAt = minutes ? Date.now() + minutes * 60 * 1000 : null;
  localStorage.setItem(name, JSON.stringify({ value, expiresAt }));
}

export function setLocalStorageSeconds(name: string, value: string, seconds: number) {
  if (!isBrowser) return;
  let expiresAt = seconds ? Date.now() + seconds * 1000 : null;
  localStorage.setItem(name, JSON.stringify({ value, expiresAt }));
}

export function getLocalStorage(name: string): string | null {
  if (!isBrowser) return null;

  let raw = localStorage.getItem(name);
  if (!raw) return null;
  let { value, expiresAt } = JSON.parse(raw);
  if (expiresAt && Date.now() > expiresAt) {
    localStorage.removeItem(name);
    return null;
  }
  return value;
}
