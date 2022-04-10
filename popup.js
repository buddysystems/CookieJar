let changeColor = document.getElementById("changeColor");
const getCookiesBtn = document.getElementById("getCookies");
const cookieList = document.getElementById("cookieList");
const removeCookieBtn = document.getElementById("removeCookie");
const urlInput = document.getElementById("url");
const nameInput = document.getElementById("name");

const cookieWorker = new CookieWorker();

// The body of this function will be executed as a content script inside the
// current page
function setPageBackgroundColor() {
    chrome.storage.sync.get("color", ({ color }) => {
        document.body.style.backgroundColor = color;
    });
}

async function getCookies() {
    const cookies = await cookieWorker.getAllCookiesAsync();
    for (const cookie of cookies) {
        const cookieListItem = document.createElement("ul");
        cookieListItem.style.marginBottom = "10px";
        cookieListItem.innerHTML = `${cookie.domain} - ${cookie.name}:${cookie.value}`;
        cookieList.appendChild(cookieListItem);
    }
}

async function removeCookie() {
    await cookieWorker.removeCookieAsync({
        name: nameInput.value,
        url: urlInput.value,
    });
}

getCookiesBtn.addEventListener("click", getCookies);

removeCookieBtn.addEventListener("click", removeCookie);