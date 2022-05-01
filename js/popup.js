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

    const viewTabs = new ViewTabs("active");
    const viewTabsElem = await viewTabs.getHtmlElement();
    viewTabsContainer.appendChild(viewTabsElem);

    const domainFilter = new DomainFilter();
    const domainFilterElem = await domainFilter.getHtmlElement();
    domainFilterContainer.appendChild(domainFilterElem);
    await domainFilter.setAsCurrentDomain(); // Set the domain filter to the current tab by default (to avoid loading all cookies)

    const popup = new Popup(
        cookiesManager,
        viewTabs,
        searchInput,
        domainFilter,
        cookiesListContainer,
        loadingIndicator
    );

    viewTabs.handleSelectActive = async () =>
        await popup.selectActiveTab(
            searchInput.value,
            domainFilter.getCurrentDomain()
        );
    viewTabs.handleSelectJar = async () =>
        await popup.selectJarTab(
            searchInput.value,
            domainFilter.getCurrentDomain()
        );
    viewTabs.handleSelectShelf = async () => await popup.selectShelfTab();

    searchButton.addEventListener("click", async () => {
        await popup.search(searchInput.value, domainFilter.getCurrentDomain());
    });

    await popup.selectActiveTab(
        searchInput.value,
        domainFilter.getCurrentDomain()
    );
};

class Popup {
    constructor(
        cookiesManager,
        viewTabs,
        searchInput,
        domainFilter,
        cookiesListContainer,
        loadingIndicator
    ) {
        this.cookiesManager = cookiesManager;
        this.viewTabs = viewTabs;
        this.searchInput = searchInput;
        this.domainFilter = domainFilter;
        this.cookiesListContainer = cookiesListContainer;
        this.loadingIndicator = loadingIndicator;
    }

    async search(searchTerm, domain) {
        console.log(domain);
        console.log(this.viewTabs.selectedTabName);
        const tabName = this.viewTabs.selectedTabName;
        if (tabName === "active") {
            await this.selectActiveTab(searchTerm, domain);
        } else if (tabName === "jar") {
            await this.selectJarTab(searchTerm, domain);
        } else if (tabName === "shelf") {
            // TODO
        }
    }

    async setAllCookieRows(jarCookies) {
        for (const jarCookie of jarCookies) {
            const cookieRow = new CookieRow(jarCookie);
            const elem = await cookieRow.getHtmlElement();
            this.addCookieRow(elem);
        }
    }

    async selectActiveTab(searchTerm, domain) {
        this.clearCookiesList();
        this.showLoading();
        const activeCookies = await this.cookiesManager.getChromeCookies({
            domain,
        });
        await this.setAllCookieRows(activeCookies);
        this.hideLoading();
    }

    async selectJarTab(searchTerm, domain) {
        this.clearCookiesList();
        this.showLoading();
        const jarCookies = await this.cookiesManager.getJarredCookies({
            domain,
        });
        await this.setAllCookieRows(jarCookies);
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
