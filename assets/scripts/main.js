javascript
const form = document.getElementById("shorten-form");
const input = document.getElementById("url");
const result = document.getElementById("result");

function normalizeUrl(value) {
    value = value.trim();

    if (value && !/^https?:\/\//i.test(value)) {
        value = "https://" + value;
    }

    return value;
}

/*
 * Normalize before native URL validation occurs.
 * This lets users enter "example.com" while retaining
 * type="url" on the input.
 */
input.addEventListener("blur", () => {
    input.value = normalizeUrl(input.value);
});

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    input.value = normalizeUrl(input.value);

    if (!form.checkValidity()) {
        form.reportValidity();
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
            body: JSON.stringify({
                url: input.value
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.error || "Unable to shorten URL."
            );
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
