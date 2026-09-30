const API_BASE = "https://api.tiny.danu.cc";

export function webUrl(value) {
  if (typeof value !== "string") throw new Error("Invalid URL.");
  const url = new URL(value);
  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("Use an http or https address.");
  }
  if (url.username || url.password) {
    throw new Error("Use an address without a username or password.");
  }
  return url;
}

export async function request(path, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(API_BASE + path, {
      ...options, signal: controller.signal,
    });
    if (!response.ok) {
      const error = new Error("Request failed.");
      error.status = response.status;
      throw error;
    }
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}
