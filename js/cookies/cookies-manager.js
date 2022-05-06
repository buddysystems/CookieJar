class CookiesManager {
    constructor(chromeCookieStore, cookieJarStore) {
        this.chromeCookieStore = chromeCookieStore;
        this.cookieJarStore = cookieJarStore;
    }

    async getAll(details = {}) {
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
     * For each cookie, either add it to the appropriate store if not already present, or update it in that store if already present.
     */
    async upsertCookies(cookies) {
        for (const cookie of cookies) {
            if (cookie.isStored) {
                if (await this.cookieJarStore.cookieExists(cookie.details)) {
                    await this.cookieJarStore.updateCookie(
                        cookie.details,
                        cookie
                    );
                } else {
                    await this.cookieJarStore.addCookie(cookie);
                }
            } else {
                if (await this.chromeCookieStore.cookieExists(cookie.details)) {
                    await this.chromeCookieStore.updateCookie(
                        cookie.details,
                        cookie
                    );
                } else {
                    await this.chromeCookieStore.addCookie(cookie);
                }
            }
        }
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
