window.onload = async function () {
    const viewTabContainer = document.getElementById("view-tab-container");
    const loadingIndicator = document.getElementById("loading-indicator");
    const cookiesListContainer = document.getElementById("cookies-list");

    const popup = new Popup(
        viewTabContainer,
        loadingIndicator,
        cookiesListContainer
    );

    await popup.selectActiveTab();
};

class Popup {
    constructor(viewTabsContainer, loadingIndicator, cookiesListContainer) {
        this.viewTabs = new ViewTabs(
            this.selectActiveTab,
            this.selectJarTab,
            this.selectShelfTab
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
        this.showLoading();
        const activeCookies = await this.cookiesManager.getChromeCookies({});
        for (const jarCookie of activeCookies) {
            this.cookiesListContainer.appendChild(
                new CookieRow(jarCookie).getHtmlElement()
            );
        }
        this.hideLoading();
    }

    async selectJarTab() {}

    async selectShelfTab() {}

    showLoading() {
        this.loadingIndicator.style.display = "flex";
    }

    hideLoading() {
        this.loadingIndicator.style.display = "none";
    }
}
