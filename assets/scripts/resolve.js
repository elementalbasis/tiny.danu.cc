import { request, webUrl } from "./api.js";

const heading = document.querySelector("#heading");
const status = document.querySelector("#status");
const retry = document.querySelector("#retry");
let busy = false;

async function resolve() {
  if (busy) return;
  const path = window.location.pathname;
  let code;
  try {
    if (!/^\/[^/]+$/.test(path)) throw new Error();
    code = decodeURIComponent(path.slice(1));
    if (!code || /[\/\\\s\x00-\x1f\x7f]/.test(code)) throw new Error();
  } catch {
    heading.textContent = "Page not found";
    status.textContent = "This address isn’t a short link.";
    retry.hidden = true;
    return;
  }

  busy = true;
  retry.hidden = true;
  heading.textContent = "Opening your link…";
  status.textContent = "Please wait while we find the destination.";
  status.className = "";
  try {
    const data = await request("/resolve?code=" + encodeURIComponent(code));
    const destination = webUrl(data.longUrl);
    // Prevent a broken link from repeatedly loading the same 404 page.
    if (destination.origin === window.location.origin &&
        destination.pathname === path) {
      throw new Error("Redirect loop.");
    }
    window.location.replace(destination.href);
  } catch (error) {
    const missing = [404, 410].includes(error.status);
    heading.textContent = missing ? "Link unavailable" : "Couldn’t open this link";
    status.className = "error";
    status.textContent = missing
      ? "This short link doesn’t exist or is no longer available."
      : "We couldn’t reach the destination. Please try again.";
    retry.hidden = missing;
  } finally {
    busy = false;
  }
}

retry.addEventListener("click", resolve);
resolve();
