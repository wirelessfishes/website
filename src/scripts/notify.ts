import { getEl } from "./module/dom.js";

const input = getEl<HTMLInputElement>("notifyinput");
const button = getEl<HTMLButtonElement>("notifysend");
const btn_text = getEl("notify-btn-content");

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function sendNotification() {
  const beforetext = button.innerHTML;
  if (input.value == "") {
    return;
  }

  btn_text.innerHTML = "Sending...";
  button.disabled = true;

  let resp = await fetch("https://api.wireless.fish/ntfy", {
    method: "POST",
    body: JSON.stringify({ text: input.value, agent: navigator.userAgent }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  input.value = "";

  if (!resp.ok) {
    btn_text.innerHTML = '<span class="error-text">ERROR</span>';
    button.disabled = true;

    await sleep(3000);

    btn_text.innerHTML = beforetext;
    button.disabled = false;

    onNotifyInput();
  } else {
    btn_text.innerHTML = "Sent! :)";
    button.disabled = true;

    await sleep(3000);

    btn_text.innerHTML = beforetext;
    button.disabled = false;

    onNotifyInput();
  }
}

function onNotifyInput() {
  if (input.value == "") {
    button.disabled = true;
  } else {
    button.disabled = false;
  }
}

button.onclick = function () {
  try {
    sendNotification();
  } catch (e) {
    btn_text.innerHTML = '<span class="error-text">ERROR</span>';
    button.disabled = false;
  }
};
input.oninput = onNotifyInput;
