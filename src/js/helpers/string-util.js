export function truncateString(str, n) {
    return str.length > n ? str.substr(0, n - 1) + "&hellip;" : str;
}

export function alphabeticalComparison(a, b) {
    if (a < b) {
        return -1;
    }
    if (a > b) {
        return 1;
    }
    return 0;
}

export function getUrlDomain(url) {
    try {
        const u = new URL(url);
        return u.hostname.replace("www", "");
    } catch (TypeError) {
        console.warn("Couldn't get url of webpage");
        // If we are visiting a non-webpage (such as chrome://extensions), we can't parse a URL
        return "";
    }
}

export function getUrlTopLevelDomain(url) {
    const domain = getUrlDomain(url);
    const domainParts = domain.split(".");
    if (domainParts.length <= 2) return domain;
    return domainParts.slice(-2).join(".");
}
