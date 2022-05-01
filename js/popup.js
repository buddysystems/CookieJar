const viewTabsContainer = document.getElementById("view-tab-container");
const loadingIndicator = document.getElementById("loading-indicator");
const cookiesListContainer = document.getElementById("cookies-list");

const searchInput = document.getElementById("search-box");
const domainFilterContainer = document.getElementById(
    "domain-filter-container"
);
const searchButton = document.getElementById("search-btn");

window.onload = async function () {
    const chromeCookieStore = new ChromeCookieStore();
    const cookieJarStore = new CookieJarStore();
    const cookiesManager = new CookiesManager(
        chromeCookieStore,
        cookieJarStore
    );

    const viewTabs = new ViewTabs();
    const viewTabsElem = await viewTabs.getHtmlElement();
    viewTabsContainer.appendChild(viewTabsElem);

    const domainFilter = new DomainFilter();
    const domainFilterElem = await domainFilter.getHtmlElement();
    domainFilterContainer.appendChild(domainFilterElem);

    const popup = new Popup(
        cookiesManager,
        viewTabs,
        domainFilter,
        cookiesListContainer,
        loadingIndicator
    );

    viewTabs.handleSelectActive = async () => await popup.selectActiveTab();
    viewTabs.handleSelectJar = async () => await popup.selectJarTab();
    viewTabs.handleSelectShelf = async () => await popup.selectShelfTab();

    await popup.selectActiveTab();

    searchButton.addEventListener("click", async () => {
        const searchTerm = searchInput.value;
        const domain = await domainFilter.getCurrentDomain();
        await popup.search(searchTerm, domain);
    });
};

class Popup {
    constructor(
        cookiesManager,
        viewTabs,
        domainFilter,
        cookiesListContainer,
        loadingIndicator
    ) {
        this.cookiesManager = cookiesManager;
        this.viewTabs = viewTabs;
        this.domainFilter = domainFilter;
        this.cookiesListContainer = cookiesListContainer;
        this.loadingIndicator = loadingIndicator;
    }

    async search(searchTerm, domain) {}

    async selectActiveTab() {
        this.clearCookiesList();
        this.showLoading();

        const domain = await this.domainFilter.getCurrentDomain();
        const activeCookies = await this.cookiesManager.getChromeCookies({
            domain,
        });
        for (const jarCookie of activeCookies) {
            const cookieRow = new CookieRow(jarCookie);
            const elem = await cookieRow.getHtmlElement();
            this.addCookieRow(elem);
        }

        this.hideLoading();
    }

    async selectJarTab() {
        this.clearCookiesList();
        this.showLoading();
        const domain = await this.domainFilter.getCurrentDomain();
        const jarCookies = await this.cookiesManager.getJarredCookies({
            domain,
        });
        for (const jarCookie of jarCookies) {
            const cookieRow = new CookieRow(jarCookie);
            const elem = await cookieRow.getHtmlElement();
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
