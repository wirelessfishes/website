export function getEl<T extends HTMLElement = HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Missing element #${id}`);
  return el as T;
}

export function getInputEl(id: string, type?: string): HTMLInputElement {
  const el = getEl<HTMLInputElement>(id);
  if (el.tagName !== "INPUT") throw new Error(`#${id} is not an <input>`);
  if (type && el.type !== type) throw new Error(`#${id} is not type="${type}"`);
  return el;
}
