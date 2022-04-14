function getCookieUrl(cookie) {
    return (
        "http" +
        (cookie.secure ? "s" : "") +
        "://" +
        cookie.domain +
        cookie.path
    );
}

function truncateString(str, n) {
    return str.length > n ? str.substr(0, n - 1) + "&hellip;" : str;
}

function alphabeticalComparison(a, b) {
    if (a < b) {
        return -1;
    }
    if (a > b) {
        return 1;
    }
    return 0;
}

async function ensureCookieJarStorageCreated() {
    // Create an empty list for our stored cookies if it doesn't already exist
    const alreadyStored = await chrome.storage.local.get(COOKIE_JAR);
    if (!alreadyStored.COOKIE_JAR) {
        console.info("Creating empty cookie jar.");
        await chrome.storage.local.set({ COOKIE_JAR: [] });
    }
}
