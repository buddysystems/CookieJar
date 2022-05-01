const viewTabContainer = document.getElementById("view-tab-container");
const loadingIndicator = document.getElementById("loading-indicator");
const cookiesListContainer = document.getElementById("cookies-list");

const searchInput = document.getElementById("search-box");
const domainFilterContainer = document.getElementById(
    "domain-filter-container"
);

window.onload = async function () {
    const popup = new Popup(
        viewTabContainer,
        loadingIndicator,
        cookiesListContainer,
        searchInput,
        domainFilterContainer
    );
    await popup.loadElements();

    await popup.selectActiveTab();
};

class Popup {
    constructor(
        viewTabsContainer,
        loadingIndicator,
        cookiesListContainer,
        searchInput,
        domainFilterContainer
    ) {
        this.viewTabsContainer = viewTabsContainer;
        this.loadingIndicator = loadingIndicator;
        this.cookiesListContainer = cookiesListContainer;
        this.searchInput = searchInput;
        this.domainFilterContainer = domainFilterContainer;

        this.viewTabs = new ViewTabs(
            async () => await this.selectActiveTab(),
            async () => await this.selectJarTab(),
            async () => await this.selectShelfTab()
        );

        const chromeCookieStore = new ChromeCookieStore();
        const cookieJarStore = new CookieJarStore();
        this.cookiesManager = new CookiesManager(
            chromeCookieStore,
            cookieJarStore
        );

        this.domainFilter = new DomainFilter();
    }

    async loadElements() {
        const viewTabsElem = await this.viewTabs.getHtmlElementAsync();
        this.viewTabsContainer.appendChild(viewTabsElem);

        const domainFilterElem = await this.domainFilter.getHtmlElementAsync();
        this.domainFilterContainer.appendChild(domainFilterElem);
    }

    async selectActiveTab() {
        this.clearCookiesList();
        this.showLoading();

        const elem = await this.domainFilter.getHtmlElementAsync();
        this.domainFilterContainer.appendChild(elem);

        const domain = await this.domainFilter.getCurrentDomain();
        const activeCookies = await this.cookiesManager.getChromeCookies({
            domain: domain,
        });
        for (const jarCookie of activeCookies) {
            const cookieRow = new CookieRow(jarCookie);
            const elem = await cookieRow.getHtmlElementAsync();
            this.addCookieRow(elem);
        }

        this.hideLoading();
    }

    async selectJarTab() {
        this.clearCookiesList();
        this.showLoading();
        const jarCookies = await this.cookiesManager.getJarredCookies({
            domain: this.domainFilter.getSelectedDomain(),
        });
        for (const jarCookie of jarCookies) {
            const cookieRow = new CookieRow(jarCookie);
            const elem = await cookieRow.getHtmlElementAsync();
            this.addCookieRow(elem);
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
