window.onload = async function () {
    const viewTabContainer = document.getElementById("view-tab-container");
    const loadingIndicator = document.getElementById("loading-indicator");
    const cookiesListContainer = document.getElementById("cookies-list");

    const popup = new Popup(
        viewTabContainer,
        loadingIndicator,
        cookiesListContainer
    );

    await popup.selectJarTab();
};

class Popup {
    constructor(viewTabsContainer, loadingIndicator, cookiesListContainer) {
        this.viewTabs = new ViewTabs(
            async () => await this.selectActiveTab(),
            async () => await this.selectJarTab(),
            async () => await this.selectShelfTab()
        );
        viewTabsContainer.appendChild(this.viewTabs.getHtmlElement());

        this.loadingIndicator = loadingIndicator;

        this.cookiesListContainer = cookiesListContainer;

        const chromeCookieStore = new ChromeCookieStore();
        const cookieJarStore = new CookieJarStore();
        this.cookiesManager = new CookiesManager(
            chromeCookieStore,
            cookieJarStore
        );
    }

    async selectActiveTab() {
        this.clearCookiesList();
        this.showLoading();

        const activeCookies = await this.cookiesManager.getChromeCookies({});
        for (const jarCookie of activeCookies) {
            const cookieRow = new CookieRow(jarCookie).getHtmlElement();
            this.addCookieRow(cookieRow);
        }

        this.hideLoading();
    }

    async selectJarTab() {
        this.clearCookiesList();
        this.showLoading();
        const jarCookies = await this.cookiesManager.getJarredCookies({});
        for (const jarCookie of jarCookies) {
            const cookieRow = new CookieRow(jarCookie).getHtmlElement();
            this.addCookieRow(cookieRow);
        }

        this.hideLoading();
    }

    async selectShelfTab() {}

    addCookieRow(cookieRow) {
        this.cookiesListContainer.appendChild(cookieRow);
    }

    clearCookiesList() {
        while (this.cookiesListContainer.firstChild) {
            this.cookiesListContainer.removeChild(
                this.cookiesListContainer.lastChild
            );
        }
    }

    showLoading() {
        this.loadingIndicator.style.display = "flex";
    }

    hideLoading() {
        this.loadingIndicator.style.display = "none";
    }
}
