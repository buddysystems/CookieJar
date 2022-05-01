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

    /**
     * @returns Promise<JarCookie>
     */
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

    async removeAllCookies() {
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

    /**
     * @returns Promise<JarCookie[]>
     */
    async getAll(details) {
        // TODO: use details to filter
        const chromeCookies = await chrome.cookies.getAll({});

        const jarCookies = [];
        for (const cc of chromeCookies) {
            jarCookies.push(new JarCookie(cc, false));
        }
        return jarCookies;
    }
}
