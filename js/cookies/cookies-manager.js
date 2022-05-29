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

    async storeCookies(cookies) {
        for (const cookie of cookies) {
            await this.storeCookie(cookie);
        }
    }

    async restoreCookie(cookie) {
        // Don't restore if restore
        if (!cookie.isStored) return;
        cookie.isStored = false;

        await this.chromeCookieStore.setCookie(cookie);
        await this.cookieJarStore.removeCookie(cookie.details);
    }

    async restoreCookies(cookies) {
        for (const cookie of cookies) {
            await this.restoreCookie(cookie);
        }
    }

    /**
     * Either add the cookie to the appropriate store if not already present, or update it in that store if already present.
     */
    async upsertCookie(cookie, previousCookieDetails) {
        console.log(previousCookieDetails);
        // REMINDER FOR ELIJAH: test import functionality
        const filterDetails = previousCookieDetails;
        console.log(filterDetails);
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

    // async editCookie(currentCookie) {
    //     let domain;
    //     let path;
    //     let expiration;
    //     let sameSite;
    //     let hostOnly;
    //     let session;
    //     let secure;
    //     let httpOnly;

    //     const name = document.getElementById("name").value;
    //     const value = document.getElementById("value").value;
    //     domain = document.getElementById("domain").value;
    //     path = document.getElementById("path").value;
    //     expiration = document.getElementById("expiration").value;
    //     //sameSite = document.getElementById("sameSite").value;
    //     sameSite = "no_restriction";
    //     hostOnly = document.getElementById("hostOnly").checked;
    //     session = document.getElementById("session").checked;
    //     secure = document.getElementById("secure").checked;
    //     httpOnly = document.getElementById("httpOnly").checked;

    //     let editedCookie = currentCookie;
    //     editedCookie.name = name;
    //     editedCookie.value = value;
    //     editedCookie.domain = domain;
    //     editedCookie.path = path;
    //     editedCookie.expiration = expiration;
    //     editedCookie.sameSite = sameSite;
    //     editedCookie.hostOnly = hostOnly;
    //     editedCookie.session = session;
    //     editedCookie.secure = secure;
    //     editedCookie.httpOnly = httpOnly;

    //     // await this.deleteCookie(currentCookie);
    //     // await this.upsertCookie(editedCookie);

    //     //await this.chromeCookieStore.setCookie(editedCookie)

    //     await this.updateCookie(currentCookie.details, editedCookie);

    //     // const cookieDetails = {
    //     //     domain: domain,
    //     //     httpOnly: httpOnly,
    //     //     name: name,
    //     //     path: path,
    //     //     sameSite: sameSite,
    //     //     secure: secure,
    //     //     storeId: currentCookie.storeId,
    //     //     url: currentCookie.details.url,
    //     //     value: value,
    //     // };
    //     // await chrome.cookies.set(cookieDetails)

    // }

    /**
     * @param {{name: str, storeId: number, url: str}} previousCookieDetails The details used to identify the cookie to be updated
     */
    async updateCookie(previousCookieDetails, updatedCookie) {
        console.log(previousCookieDetails);
        console.log(updatedCookie);
        if (updatedCookie.isStored) {
            // Is in cookie jar, need to update in local storage
            await this.cookieJarStore.removeCookie(previousCookieDetails);
            await this.cookieJarStore.addCookie(updatedCookie);
        } else {
            // Is in browser cookies
            console.log(updatedCookie);
            await this.chromeCookieStore.setCookie(updatedCookie);
        }
    }

    async deleteCookie(cookie) {
        if (cookie.isStored) {
            // Is in cookie jar, remove from there
            await this.cookieJarStore.removeCookie(cookie.details);
        } else {
            // Is in browser cookies, remove from active
            await this.chromeCookieStore.removeCookie(cookie.details);
        }
    }

    async deleteCookies(cookies) {
        for (const cookie of cookies) {
            await this.deleteCookie(cookie);
        }
    }

}