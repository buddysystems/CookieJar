function getCookieUrl(cookie) {
    return (
        "http" +
        (cookie.secure ? "s" : "") +
        "://" +
        cookie.domain +
        cookie.path
    );
}

/**
 * Ensure that we have a place to store the jarred cookies (must be run at least once before attempting to jar any cookies).
 */
function ensureCookieJarStorageCreated(localStorageKey = "COOKIE_JAR") {
    // Create an empty list for our stored cookies if it doesn't already exist
    chrome.storage.local.get(localStorageKey).then((alreadyStored) => {
        console.dir(alreadyStored);
        if (!alreadyStored.COOKIE_JAR) {
            console.info("Creating empty cookie jar.");
            chrome.storage.local
                .set({ COOKIE_JAR: [] })
                .catch((e) => console.error(e));
        }
    });
}
