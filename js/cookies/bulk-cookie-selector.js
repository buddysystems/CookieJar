class BulkCookieSelector {
    constructor(cookiesManager) {
        this.cookiseManager = cookiesManager;
        this.selectedCookies = [];
    }

    selectCookie(cookie) {
        if (this.selectedCookies.includes(cookie)) {
            return;
        }
        this.selectedCookies.push(cookie);
    }

    deselectCookie(cookie) {
        this.selectedCookies = this.selectedCookies.filter((c) => c !== cookie);
    }

    selectCookies(cookies) {
        const uniqueNewCookies = cookies.filter(
            (item) => this.selectedCookies.indexOf(item) < 0
        );
        this.selectedCookies = this.selectedCookies.concat(uniqueNewCookies);
    }

    deselectCookies(cookies) {
        this.selectedCookies = this.selectedCookies.filter(
            (item) => !cookies.includes(item)
        );
    }

    deselectAllCookies() {
        this.selectedCookies = [];
    }
}
