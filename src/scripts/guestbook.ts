import { format } from "date-fns";

import { getEl, getInputEl } from "./module/dom";
import { getGuestbook, resolveIdToName } from "./module/guestbook";
import { GuestbookEntry, GuestbookPostBody, GuestbookResponse } from "./types/guestbook";

const COMMENT_ARCHIVE_POINT = new Date("2026-07-27");

let reply_to_id: number | undefined = undefined;

// By default all comments can be replied to. Replies cannot be replied to.
function Comment(comment: GuestbookEntry, render_replies: boolean, can_be_replied?: boolean) {
  if (can_be_replied === undefined) can_be_replied = true;
  let comment_date = new Date(comment.created);

  // Archived comments cannot be replied to
  if (comment_date < COMMENT_ARCHIVE_POINT) can_be_replied = false;

  // Prep reply html
  let reply_html = "";
  if (comment.replies && render_replies) {
    comment.replies.forEach((reply) => {
      reply_html += Comment(reply, false, false);
    });
  }

  return `
    <div class="guestbook-entry">
        <div class="guestbook-entry_top">
            <div class="guestbook-entry_name">${comment.name}</div>
            
            <div class="guestbook-entry_options">
            ${comment.site ? `<a href="${comment.site}">${new URL(comment.site).host} 🡕</a>` : ""}
            <span class="guestbook-entry_date">${format(comment_date, "yyyy/MM/dd")}</span>
            </div>
        </div>

        
          <div class="guestbook-entry_content">
            ${comment.content}
            ${can_be_replied ? `<button class="guestbook-reply-button" data-reply-to="${comment.id}">reply</button>` : ""}
          </div>
        

        <div class="guestbook-entry_replies">
            ${reply_html}
        </div>
    </div>
    `;
}

async function render(comments?: GuestbookResponse) {
  const comment_container = getEl("guestbook-content");
  const comment_archive = getEl("guestbook-content-archive");
  comment_container.innerHTML = "";
  comment_archive.innerHTML = "";

  if (!comments) {
    try {
      comments = await getGuestbook();
    } catch (e) {
      comment_container.innerHTML = `<span class="error-text">ERROR: Could not get guestbook comments.</span>`;
      return;
    }
  }

  comments.entries.forEach((comment) => {
    if (new Date(comment.created) > COMMENT_ARCHIVE_POINT) {
      comment_container.innerHTML += Comment(comment, true);
    } else {
      comment_archive.innerHTML += Comment(comment, true);
    }
  });
}

function setReplyToId(id?: number) {
  const reply_to_container_el = getEl("guestbook-reply");
  const reply_to_status_el = getEl("guestbook-reply_name");
  reply_to_id = id;

  if (!id) {
    reply_to_container_el.style.display = "none";
  } else {
    reply_to_status_el.innerHTML = `&gt;&gt;&gt; Replying to ${
      resolveIdToName(id) ?? `<span class="error-text">[ERROR]: Name not loaded</span>`
    }`;

    reply_to_container_el.style.display = "block";
  }
}

async function onSubmit(e: SubmitEvent) {
  const name_el = getInputEl("guestbook-form_name", "text");
  const url_el = getInputEl("guestbook-form_url", "url");
  const content_el = getEl<HTMLTextAreaElement>("guestbook-form_message");
  const status_el = getEl("guestbook-form_status");

  e.preventDefault();

  const data: GuestbookPostBody = {
    name: name_el.value,
    site: url_el.value,
    content: content_el.value,
    reply_to: reply_to_id,
  };

  status_el.classList.remove("error-text");
  status_el.innerHTML = "Sending...";

  let resp: Response | undefined;
  try {
    resp = await fetch("https://api.wireless.fish/guestbook", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json",
      },
    });
  } catch (e) {
    status_el.classList.add("error-text");
    status_el.innerHTML = `Network error. Check your connection.`;
    return;
  }

  if (resp.status == 200) {
    status_el.innerHTML = "Successfuly posted!";
    render();
    setReplyToId(undefined);
  } else {
    status_el.classList.add("error-text");
    status_el.innerHTML = `Error while posting (${resp.status}). Please poke me on discord/email.`;
  }
}

async function onClick(e: PointerEvent) {
  const btn = (e.target as HTMLElement).closest("[data-reply-to]");
  if (!btn) return;
  setReplyToId(Number((btn as HTMLElement).dataset.replyTo));
}

async function connectInputEvents() {
  const form = getEl<HTMLFormElement>("guestbook-form");

  form.addEventListener("submit", onSubmit);
  document.addEventListener("click", onClick);
}

connectInputEvents();
render();

const cancel_reply_btn = getEl<HTMLButtonElement>("guestbook-reply_cancel");
cancel_reply_btn.addEventListener("click", (e) => {
  setReplyToId(undefined);
});
