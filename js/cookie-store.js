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

    store() {
        if (this.isStored) return;
        else {
            this.isStored = true;
            const key = JSON.stringify(this.details);
            chrome.stroage.local.set({ key: this });
            chrome.cookies.remove(this.details);
        }
    }

    restore() {
        if (this.isStored) {
            this.isStored = false;
            const key = JSON.stringify(this.details);
            transferCookie = chrome.storage.local.get(key);
        }
    }
}

async function getCookies() {
    var chromeCookies = await chrome.cookies.getAll({});
    console.log(`chromeCookies:`);
    console.dir(chromeCookies);
    const ourCookies = [];

    for (var cookie of chromeCookies) {
        const ourCookie = new Cookie(cookie);
        ourCookies.push(ourCookie);
    }

    console.log(`ourCookies:`);
    console.dir(ourCookies);
    return ourCookies;
}
