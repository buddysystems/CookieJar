class CookiesManager {
    constructor(chromeCookieStore, cookieJarStore) {
        this.chromeCookieStore = chromeCookieStore;
        this.cookieJarStore = cookieJarStore;
    }

    async getAll(details) {
        const chromeCookies = await this.chromeCookieStore.getAll(details);
        const jarCookies = await this.cookieJarStore.getAll(details);

        let allCookies = chromeCookies;
        return allCookies.concat(jarCookies);
    }

    async getJarredCookies(details = {}) {
        return this.cookieJarStore.getAll(details);
    }

    async getChromeCookies(details = {}) {
        return this.chromeCookieStore.getAll(details);
    }

    async storeCookie(cookie) {
        if (cookie.isStored) return;
        cookie.isStored = true;

        await this.cookieJarStore.addCookie(cookie);
        await this.chromeCookieStore.removeCookie(cookie.details);
    }

    async restoreCookie(cookie) {
        // Don't restore if restore
        if (!cookie.isStored) return;
        cookie.isStored = false;

        await this.chromeCookieStore.addCookie(cookie);
        await this.cookieJarStore.removeCookie(cookie.details);
    }

    /**
     * @param {{name: str, storeId: number, url: str}} previousCookieDetails The details used to identify the cookie to be updated
     */
    async updateCookie(previousCookieDetails, updatedCookie) {
        if (updatedCookie.isStored) {
            // Is in cookie jar, need to update in local storage
            await this.cookieJarStore.removeCookie(previousCookieDetails);
            await this.cookieJarStore.addCookie(updatedCookie);
        } else {
            // Is in browser cookies
            await this.chromeCookieStore.removeCookie(previousCookieDetails);
            await this.chromeCookieStore.addCookie(updatedCookie);
        }
    }

    async deleteCookie(cookieDetails) {
        // TODO
    }
}
