import { request, webUrl } from "./api.js";

const form = document.querySelector("#shorten-form");
const input = document.querySelector("#url");
const submit = document.querySelector("#shorten");
const status = document.querySelector("#status");
const result = document.querySelector("#result");
const link = document.querySelector("#short-link");
const copy = document.querySelector("#copy");
let busy = false;

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (busy) return;
  let url;
  try {
    let value = input.value.trim();
    if (!value) throw new Error("Enter a URL first.");
    // Accept bare domains, including a domain followed by a port.
    if (!/^https?:\/\//i.test(value)) {
      if (/^[a-z][a-z0-9+.-]*:/i.test(value) &&
          !/^[^/:]+\.([^/:]+):\d+(?:[/?#]|$)/.test(value)) {
        throw new Error("Use an http or https address.");
      }
      value = "https://" + value;
    }
    url = webUrl(value).href;
  } catch (error) {
    status.className = "error";
    status.textContent = error.message === "Invalid URL" ? "Enter a valid web address." : error.message;
    input.focus();
    return;
  }

  busy = true;
  submit.disabled = true;
  input.readOnly = true;
  form.setAttribute("aria-busy", "true");
  status.className = "";
  status.textContent = "Shortening…";
  result.hidden = true;
  try {
    const data = await request("/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
    const shortUrl = webUrl(data.shortUrl);
    if (shortUrl.origin !== "https://tiny.danu.cc" ||
        !/^\/[^/]+$/.test(shortUrl.pathname)) {
      throw new Error("Unexpected short URL.");
    }
    link.href = shortUrl.href;
    link.textContent = shortUrl.href;
    copy.textContent = "Copy link";
    result.hidden = false;
    form.hidden = true;
    status.textContent = "Your link is ready.";
    copy.focus();
  } catch (error) {
    status.className = "error";
    status.textContent = error.status === 429
      ? "Too many requests. Wait a moment and try again."
      : error.status === 400 || error.status === 422
        ? "That address could not be shortened. Check it and try again."
        : "Couldn’t shorten that URL. Please try again.";
  } finally {
    busy = false;
    submit.disabled = false;
    input.readOnly = false;
    form.removeAttribute("aria-busy");
  }
});

copy.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(link.href);
    copy.textContent = "Copied!";
    status.textContent = "Link copied.";
  } catch {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(link);
    selection.removeAllRanges();
    selection.addRange(range);
    status.textContent = "Copy the selected link manually.";
  }
});

document.querySelector("#another").addEventListener("click", () => {
  result.hidden = true;
  form.hidden = false;
  form.reset();
  status.className = "";
  status.textContent = "";
  input.focus();
});
