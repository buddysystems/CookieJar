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

        await this.chromeCookieStore.setCookie(cookie);
        await this.cookieJarStore.removeCookie(cookie.details);
    }

    /**
     * Either add the cookie to the appropriate store if not already present, or update it in that store if already present.
     */
    async upsertCookie(cookie) {
        const filterDetails = {
            name: cookie.details.name,
            domain: cookie.domain,
            storeId: cookie.details.storeId,
        };
        // Jarred cookie
        if (cookie.isStored) {
            // TODO
            if (await this.cookieJarStore.cookieExists(cookie.details)) {
                await this.cookieJarStore.updateCookie(cookie.details, cookie);
            } else {
                await this.cookieJarStore.addCookie(cookie);
            }
        }
        // Active cookie
        else {
            const matchingCookies = await this.chromeCookieStore.getAll(
                filterDetails
            );
            const existingCookie = await this.chromeCookieStore.getCookie(
                cookie.details
            );
            /* In fringe cases where the same cookie is set for multiple domains (which is a terrible but exceedingly rare practice by other websites),
            we cannot set the cookie, so we will give the user an error about duplicate cookies.
             */
            const setMayFailDueToSubdomain = !existingCookie && matchingCookies;
            try {
                await this.chromeCookieStore.setCookie(cookie);
            } catch (e) {
                if (setMayFailDueToSubdomain) {
                    throw new DOMException(
                        `Duplicate cookie could not be set (cookie named \n\t'${cookie.name}'\nat domain \n\t'${cookie.domain}').`
                    );
                } else {
                    throw e;
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
            await this.chromeCookieStore.setCookie(updatedCookie);
        }
    }

    async deleteCookie(cookieDetails) {
        // TODO
    }
}
