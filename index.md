---
layout: default
title: Shorten a URL
---

# tiny.danu.cc

<p class="intro">A simple URL shortener.</p>

<form id="shorten-form">
    <label for="url">URL</label>
    <div class="form-row">
        <input
            id="url"
            name="url"
            type="url"
            placeholder="https://example.com/..."
            autocomplete="url"
            required
        >
        <button type="submit">Shorten</button>
    </div>
</form>

<div id="result" aria-live="polite"></div>

<footer>
    <a href="https://tiny.danu.cc">tiny.danu.cc</a>
</footer>

<script>
const form = document.getElementById("shorten-form");
const input = document.getElementById("url");
const result = document.getElementById("result");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const url = input.value.trim();

    if (!url) {
        return;
    }

    result.className = "";
    result.textContent = "Shortening…";

    try {
        const response = await fetch("https://api.tiny.danu.cc/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ url })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Unable to shorten URL.");
        }

        result.className = "success";
        result.innerHTML = "";

        const link = document.createElement("a");
        link.href = data.shortUrl;
        link.textContent = data.shortUrl;

        result.appendChild(link);
    } catch (error) {
        result.className = "error";
        result.textContent = error.message;
    }
});
</script>
