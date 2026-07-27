export interface GuestbookEntry {
  id: number;
  name: string;
  content: string;
  reply_to: number | null;
  site: string | null;
  created: string;
}

export interface GuestbookResponse {
  count: number;
  entries: GuestbookEntry[];
}

export interface GuestbookPostBody {
  name: string;
  content: string;
  reply_to?: number;
  site?: string;
}
