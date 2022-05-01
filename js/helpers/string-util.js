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

function getUrlDomain(url) {
    const u = new URL(url);
    return u.hostname.replace("www", "");
}
