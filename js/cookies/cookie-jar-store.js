const COOKIE_JAR = "COOKIE_JAR";

class CookieJarStore {
    constructor() {
        ensureCookieJarStorageCreated();
    }

    async cookieExists(cookieDetails) {
        const inJar = await this.getAll();
        const cookie = inJar.find(
            (c) =>
                c.details.name == cookieDetails.name &&
                c.details.storeId == cookieDetails.storeId &&
                c.details.url == cookieDetails.url
        );
        return cookie != null;
    }

    async addCookie(cookie) {
        // Bit innefficient innit?
        const inJar = await this.getAll();
        inJar.push(cookie);
        await chrome.storage.local.set({ COOKIE_JAR: inJar });
    }

    async updateCookie(cookieDetails, newCookie) {
        await this.removeCookie(cookieDetails);
        await this.addCookie(newCookie);
    }

    /**
     * @returns Promise<JarCookie>
     */
    async getCookie(cookieDetails) {
        const inJar = await this.getAll();
        const cookie = inJar.find(
            (c) =>
                c.details.name == cookieDetails.name &&
                c.details.storeId == cookieDetails.storeId &&
                c.details.url == cookieDetails.url
        );
        return new JarCookie(cookie, true);
    }

    async removeCookie(cookieDetails) {
        let inJar = await this.getAll();
        // Remove the cookie matching the cookie details
        inJar = inJar.filter(
            (c) =>
                c.details.name != cookieDetails.name ||
                c.details.storeId != cookieDetails.storeId ||
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

    /**
     * @returns Promise<JarCookie[]>
     */
    async getAll(details = {}) {
        // TODO: filter by details
        const stored = await chrome.storage.local.get(COOKIE_JAR);
        const cookies = stored.COOKIE_JAR;

        const jarCookies = [];
        for (const c of cookies) {
            jarCookies.push(new JarCookie(c, true));
        }
        return jarCookies;
    }
}
