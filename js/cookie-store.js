// Inspired by https://github.com/jamesdbloom/delete-all-cookies/blob/master/background.js.removeCookie() :)
function getCookieUrl(cookie) {
    return (
        "http" +
        (cookie.secure ? "s" : "") +
        "://" +
        cookie.domain +
        cookie.path
    );
}

const COOKIE_JAR = "COOKIE_JAR";
class CookieJar {
    async init() {
        const alreadyStored = await chrome.storage.local.get(COOKIE_JAR);
        if (!alreadyStored.COOKIE_JAR) {
            await chrome.storage.local.set({ COOKIE_JAR: [] });
        }
    }

    async addCookie(cookie) {
        const inJar = await this.getJarCookies();
        inJar.push(cookie);
        await chrome.storage.local.set({ COOKIE_JAR: inJar });
    }

    async getCookie(cookieDetails) {
        const inJar = await this.getJarCookies();
        return inJar.find(
            (c) =>
                c.name == cookieDetails.name &&
                c.storeId == cookieDetails.storeId &&
                c.url == cookieDetails.url
        );
    }

    async removeCookie(cookieDetails) {
        let inJar = await this.getJarCookies();
        // Remove the cookie matching the cookie details
        inJar = inJar.filter(
            (c) =>
                c.name != cookieDetails.name &&
                c.storeId != cookieDetails.storeId &&
                c.url != cookieDetails.url
        );
        await chrome.storage.local.set({ COOKIE_JAR: inJar });
    }

    async getJarCookies() {
        const stored = await chrome.storage.local.get(COOKIE_JAR);
        return stored.COOKIE_JAR;
    }
}

const cookieJar = new CookieJar();

(async () => {
    await cookieJar.init();
})();

class JarCookie {
    constructor(chromeCookie, isStored = false) {
        if (chromeCookie.domain.charAt(0) == ".") {
            this.domain = chromeCookie.domain.slice(1, -1);
        } else {
            this.domain = chromeCookie.domain;
        }
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
        this.url = getCookieUrl(this);
        this.details = {
            name: chromeCookie.name,
            storeId: chromeCookie.storeId,
            url: this.url,
        };
        this.isStored = isStored;
    }

    async store() {
        // Don't store the cookie if its already stored
        if (this.isStored) return;

        this.isStored = true;

        // Store the cookie in local storage
        await cookieJar.addCookie(this);

        // Remove the cookie from chrome cookies
        await chrome.cookies.remove(this.details);
    }

    async restore() {
        // Don't restore if restore
        if (!this.isStored) return;
        this.isStored = false;

        await chrome.cookies.set({
            domain: this.domain,
            httpOnly: this.httpOnly,
            name: this.name,
            path: this.path,
            sameSite: this.sameSite,
            secure: this.secure,
            storeId: this.storeId,
            url: this.url,
            value: this.value,
        });

        // Remove the cookie from the jar
        await cookieJar.removeCookie(this.details);
        // const key = JSON.stringify(this.details);
        // const storedCookie = chrome.storage.local.get(key);
    }
}

async function getCookies() {
    const chromeCookies = await chrome.cookies.getAll({});
    const allCookies = [];

    for (var chromeCookie of chromeCookies) {
        const ourCookie = new JarCookie(chromeCookie, false);
        allCookies.push(ourCookie);
    }

    const jarCookies = await cookieJar.getJarCookies();
    for (var jarCookie of jarCookies) {
        const cookie = new JarCookie(jarCookie, true);
        allCookies.push(cookie);
    }

    return allCookies;
}
