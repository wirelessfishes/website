import { format } from "date-fns";

import { getEl } from "./module/dom";
import { getGuestbook } from "./module/guestbook";
import { GuestbookEntry } from "./types/guestbook";

const COMMENT_ARCHIVE_POINT = new Date("2026-07-27");

function Comment(comment: GuestbookEntry) {
  let comment_date = new Date(comment.created);

  return `
    <div class="guestbook-entry">
        <div class="guestbook-entry_top">
            <div>${comment.name}</div>
            
            <div class="guestbook-entry_options">
            ${comment.site ? `<a href="${comment.site}">${new URL(comment.site).host} 🡕</a>` : ""}
            <span class="guestbook-entry_date">${format(comment_date, "yyyy/MM/dd")}</span>
            </div>
        </div>

        <div class="guestbook-entry_content">
        ${comment.content}
        <button class="guestbook-reply-button">reply</button>
        </div>
    </div>
    `;
}

function Reply() {}

async function onSubmit() {
  const form = getEl<HTMLFormElement>("guestbook-form");
}

async function render() {
  const comments = await getGuestbook();
  const comment_container = getEl("guestbook-content");
  const comment_archive = getEl("guestbook-content-archive");
  comment_container.innerHTML = "";

  comments.entries.forEach((comment) => {
    // const replies = getReplies(comment, comments);
    if (new Date(comment.created) > COMMENT_ARCHIVE_POINT) {
      comment_container.innerHTML += Comment(comment);
    } else {
      comment_archive.innerHTML += Comment(comment);
    }
  });
}

render();
