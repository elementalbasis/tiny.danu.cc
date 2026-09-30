---
layout: default
title: Shorten a URL
script: create.js
---

<h1>tiny.danu.cc</h1>
<p class="intro">A simple URL shortener.</p>

<form id="shorten-form">
  <label for="url">Enter a long URL</label>
  <div class="form-row">
    <input id="url" name="url" type="text" inputmode="url"
      placeholder="https://example.com/a-long-address" autocomplete="url"
      autocapitalize="none" spellcheck="false" required aria-describedby="status">
    <button id="shorten" type="submit">Shorten</button>
  </div>
</form>

<p id="status" role="status" aria-live="polite"></p>
<section id="result" hidden aria-labelledby="result-title">
  <h2 id="result-title">Your short link</h2>
  <a id="short-link"></a>
  <div class="actions">
    <button id="copy" type="button">Copy link</button>
    <button id="another" class="secondary" type="button">Shorten another</button>
  </div>
</section>
<noscript><p>Enable JavaScript to create short links.</p></noscript>
