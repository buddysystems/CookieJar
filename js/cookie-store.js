/// A JarCookie represents the apps representation of a traditional browser cookie.
/// In addition the normal fields you would find on Chrome's Cookie object, you can find
/// details on whether it is stored or not, as well as methods to store/restore it.
class JarCookie {
    constructor(cookie, isStored = false, isSelected = false) {
        this.domain = cookie.domain;
        this.name = cookie.name;
        this.storeId = cookie.storeId;
        this.expirationDate = cookie.expirationDate;
        this.hostOnly = cookie.hostOnly;
        this.httpOnly = cookie.httpOnly;
        this.path = cookie.path;
        this.sameSite = cookie.sameSite;
        this.secure = cookie.secure;
        this.session = cookie.session;
        this.value = cookie.value;
        this.details = {
            name: cookie.name,
            storeId: cookie.storeId,
            url: getCookieUrl(this),
        };
        this.isStored = isStored;
        this.isSelected = isSelected;
    }

    /**
     * @param {*} newCookie The cookie object with updated fields
     * @param {{name: str, storeId: number, url: str}} previousCookieDetails The details used to identify the cookie to be updated
     */
    async updateCookie(newCookie, previousCookieDetails) {
        if (this.isStored) {
            // Is in cookie jar, need to update in local storage
            await cookieJar.removeCookie(previousCookieDetails);
            await cookieJar.addCookie(newCookie);
        } else {
            // Is in browser cookies
            await chromeCookieStore.removeCookie(previousCookieDetails);
            await chromeCookieStore.addCookie(newCookie);
        }
    }

    async store() {
        // Don't store the cookie if its already stored
        if (this.isStored) return;
        this.isStored = true;

        await cookieJar.addCookie(this);
        await chromeCookieStore.removeCookie(this.details);
    }

    async restore() {
        // Don't restore if restore
        if (!this.isStored) return;
        this.isStored = false;

        await chromeCookieStore.addCookie(this);
        await cookieJar.removeCookie(this.details);
    }
}

const COOKIE_JAR = "COOKIE_JAR";
class CookieJar {
    async addCookie(cookie) {
        const inJar = await this.getJarCookies();
        inJar.push(cookie);
        await chrome.storage.local.set({ COOKIE_JAR: inJar });
    }

    /// returns: Promise<JarCookie>
    async getCookie(cookieDetails) {
        const inJar = await this.getJarCookies();
        const cookie = inJar.find(
            (c) =>
                c.name == cookieDetails.name &&
                c.storeId == cookieDetails.storeId &&
                c.url == cookieDetails.url
        );
        return new JarCookie(cookie, true);
    }

    async removeCookie(cookieDetails) {
        let inJar = await this.getJarCookies();
        // Remove the cookie matching the cookie details
        inJar = inJar.filter(
            (c) =>
                c.name != cookieDetails.name ||
                c.storeId != cookieDetails.storeId ||
                c.details.url != cookieDetails.url
        );
        await chrome.storage.local.set({ COOKIE_JAR: inJar });
    }

    async removeAllCookies() {
        // Remove the cookies in the jar by setting the cookie jar to an empty list.
        await chrome.storage.local.set({ COOKIE_JAR: [] });
    }

    async restoreAllCookies() {
        // Stores all of the cookies by looping through cookies in the storage (Jar) to restore each then (Unjar) remove them from the storage.
        for (cookies in this.getJarCookies) {
            cookie.restore();
            this.removeCookie(cookie.cookieDetails);
        }
    }

    /// returns: Promise<JarCookie[]>
    async getJarCookies() {
        const stored = await chrome.storage.local.get(COOKIE_JAR);
        const cookies = stored.COOKIE_JAR;

        const jarCookies = [];
        for (const c of cookies) {
            jarCookies.push(new JarCookie(c, true));
        }
        return jarCookies;
    }
}

class ChromeCookieStore {
    async addCookie(cookie) {
        let domain = cookie.domain;
        const domainHasPrecedingDot = domain.charAt(0) == ".";
        if (domainHasPrecedingDot) {
            domain = domain.slice(1, -1);
        }
        const cookieDetails = {
            domain: domain,
            httpOnly: cookie.httpOnly,
            name: cookie.name,
            path: cookie.path,
            sameSite: cookie.sameSite,
            secure: cookie.secure,
            storeId: cookie.storeId,
            url: cookie.details.url,
            value: cookie.value,
        };

        if (domainHasPrecedingDot) {
            cookieDetails.url = getCookieUrl(cookieDetails);
        }

        await chrome.cookies.set(cookieDetails);
    }

    /// returns: Promise<JarCookie>
    async getCookie(cookieDetails) {
        const chromeCookie = await chrome.cookies.get(cookieDetails);
        if (!chromeCookie) return null;
        return new JarCookie(chromeCookie, false);
    }

    async removeCookie(cookieDetails) {
        // TODO: make sure that the cookie details include predecing dot
        const removedInfo = await chrome.cookies.remove({
            name: cookieDetails.name,
            url: cookieDetails.url,
        });
        if (removedInfo == null) {
            console.error("Couldn't remove cookie.");
        }
    }

    async removeAllCookies(cookieDetails) {
        // Aka 'Empty Jar'
        // Remove the cookies in the jar by setting the cookie jar to an empty list.
        await chrome.storage.local.set({ COOKIE_JAR: [] });
    }

    async storeAllCookies() {
        // Stores all of the cookies by looping through cookies in the browser to store each then remove them from the browser.
        for (cookies in this.getChromeCookies) {
            cookie.store();
            this.removeCookie(cookie.cookieDetails);
        }
    }

    /// returns: Promise<JarCookie[]>
    async getChromeCookies() {
        const chromeCookies = await chrome.cookies.getAll({});

        const jarCookies = [];
        for (const cc of chromeCookies) {
            jarCookies.push(new JarCookie(cc, false));
        }
        return jarCookies;
    }
}

const cookieJar = new CookieJar();
const chromeCookieStore = new ChromeCookieStore();

/// returns: Promsie<JarCookie[]>
async function getCookies() {
    const chromeCookies = await chromeCookieStore.getChromeCookies();
    const jarCookies = await cookieJar.getJarCookies();

    let allCookies = chromeCookies;
    allCookies = allCookies.concat(jarCookies);
    return allCookies;
}
