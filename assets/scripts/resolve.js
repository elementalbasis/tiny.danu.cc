const status = document.getElementById("status");

const parts = window.location.pathname
    .split("/")
    .filter(Boolean);

if (parts.length !== 1) {
    window.location.replace("/");
} else {
    const code = parts[0];

    fetch(
        "https://api.tiny.danu.cc/resolve?code=" +
        encodeURIComponent(code)
    )
    .then(async response => {
        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.error || "Short URL not found."
            );
        }

        return data;
    })
    .then(data => {
        window.location.replace(data.longUrl);
    })
    .catch(error => {
        status.textContent = error.message;
    });
}
