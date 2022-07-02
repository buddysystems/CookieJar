export class BulkCookieSelector {
    constructor(cookiesManager, onStateChanged) {
        this.cookiseManager = cookiesManager;
        this.selectedCookies = [];
        this.onStateChanged = onStateChanged;
    }

    selectCookie(cookie) {
        if (this.selectedCookies.includes(cookie)) {
            return;
        }
        this.selectedCookies.push(cookie);
        this.onStateChanged();
    }

    deselectCookie(cookie) {
        this.selectedCookies = this.selectedCookies.filter((c) => c !== cookie);
        this.onStateChanged();
    }

    selectCookies(cookies) {
        const uniqueNewCookies = cookies.filter(
            (item) => this.selectedCookies.indexOf(item) < 0
        );
        this.selectedCookies = this.selectedCookies.concat(uniqueNewCookies);
        this.onStateChanged();
    }

    deselectCookies(cookies) {
        this.selectedCookies = this.selectedCookies.filter(
            (item) => !cookies.includes(item)
        );
        this.onStateChanged();
    }

    deselectAllCookies() {
        this.selectedCookies = [];
        this.onStateChanged();
    }
}
