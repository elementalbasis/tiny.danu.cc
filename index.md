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
