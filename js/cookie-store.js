class Cookie {
    constructor(chromeCookie, isStored = false) {
        this.domain = chromeCookie.domain;
        this.name = chromeCookie.name;
        this.storeId = chromeCookie.storeId;
        this.expirationDate = chromeCookie.expirationDate;
        this.hostOnly = chromeCookie.hostOnly;
        this.httpOnly = chromeCookie.httpOnly;
        this.path = chromeCookie.path;
        this.sameSite = chromeCookie.sameSite;
        this.secure = chromeCookie.secure;
        this.session = chromeCookie.session;
        this.value = chromeCookie.value;
        this.details = {
            name: chromeCookie.name,
            storeId: chromeCookie.storeId,
            url: chromeCookie.url,
        };
        this.isStored = isStored;
    }

    async store() {
        // Don't store the cookie if its already stored
        if (this.isStored) return;

        this.isStored = true;

        // Store the cookie in local storage
        const key = JSON.stringify(this.details);
        const cookieStorage = {};
        cookieStorage[key] = this;
        await chrome.storage.local.set(cookieStorage);

        // Remove the cookie from chrome cookies
        await chrome.cookies.remove(this.details);
    }

    async restore() {
        // Don't restore if restore
        if (!this.isStored) return;
        this.isStored = false;

        // Add the cookies back to chrome cookies
        const key = JSON.stringify(this.details);
        const storedCookie = chrome.storage.local.get(key);
        await chrome.cookies.set(storedCookie);

        // Remove the cookie from local storage
        await chrome.storage.local.remove(key);
    }
}

async function getCookies() {
    var chromeCookies = await chrome.cookies.getAll({});
    const ourCookies = [];

    for (var cookie of chromeCookies) {
        const ourCookie = new Cookie(cookie);
        ourCookies.push(ourCookie);
    }

    return ourCookies;
}
