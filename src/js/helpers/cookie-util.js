export function getCookieUrl(cookie) {
    let domain = cookie.domain;
    if (domain?.charAt(0) === ".") {
        domain = domain.slice(1);
    }

    return "http" + (cookie.secure ? "s" : "") + "://" + domain + cookie.path;
}

/**
 * Ensure that we have a place to store the jarred cookies (must be run at least once before attempting to jar any cookies).
 */
export function ensureCookieJarStorageCreated(localStorageKey = "COOKIE_JAR") {
    // Create an empty list for our stored cookies if it doesn't already exist
    chrome.storage.local.get(localStorageKey).then((alreadyStored) => {
        if (!alreadyStored.COOKIE_JAR) {
            console.info("Creating empty cookie jar.");
            chrome.storage.local
                .set({ COOKIE_JAR: [] })
                .catch((e) => console.error(e));
        }
    });
}

export function filterCookieList(cookieList, filterTerm) {
    return cookieList.filter(
        (cookie) =>
            cookie.name.toUpperCase().includes(filterTerm) ||
            cookie.value.toUpperCase().includes(filterTerm) ||
            cookie.details.url.toUpperCase().includes(filterTerm)
    );
}
