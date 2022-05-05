class CookieTab extends UiElement {
    constructor(showing = false) {
        super();
        this.showing = false;
        this.isLoaded = false;

        this.hasElementBeenCreated = false;
    }

    async getHtmlElement() {
        console.log("get html elem");
        if (!this.hasElementBeenCreated) {
            this.hasElementBeenCreated = true;
            await this.createBaseTabElement();
        }

        return this.cookieTabElement;
    }

    async createBaseTabElement() {
        console.log("create base elem");
        this.cookieTabElement = document.createElement("div");
        this.cookieTabElement.classList.add("cookie-tab");

        // TODO: cookie filters
        const cookieFiltersContainer = document.createElement("div");
        this.cookieTabElement.appendChild(cookieFiltersContainer);
        cookieFiltersContainer.classList.add("cookie-filters");

        this.searchBox = document.createElement("input");
        cookieFiltersContainer.appendChild(this.searchBox);
        this.searchBox.type = "text";
        this.searchBox.placeholder = "Search for cookies";

        this.domainFilter = new DomainFilter();
        await this.setDomainFilterValue(this.domainFilter);
        const domainFilterElem = await this.domainFilter.getHtmlElement();
        console.log(this.domainFilter.getSelectedDomain());
        cookieFiltersContainer.appendChild(domainFilterElem);

        const cookiesContainer = document.createElement("div");
        this.cookieTabElement.appendChild(cookiesContainer);
        cookiesContainer.classList.add("cookie-list");

        // Bulk row
        const bulkRow = document.createElement("div");
        cookiesContainer.appendChild(bulkRow);
        bulkRow.classList.add("bulk-row");
        bulkRow.innerHTML = "TODO: BULK ROW";

        // Cookies list
        const cookieRowList = document.createElement("div");
        cookiesContainer.appendChild(cookieRowList);
        this.cookieRowList = cookieRowList;

        // Loading indicator
        const loadingIndicator = document.createElement("div");
        cookiesContainer.appendChild(loadingIndicator);
        loadingIndicator.classList.add("loading-indicator");
        loadingIndicator.innerHTML = "Loading&hellip;";
        this.loadingIndicator = loadingIndicator;
    }

    async loadCookieRows() {
        console.log("load cookie rows");

        await this.clearCookieRows();

        this.showLoading();

        const searchTerm = this.searchBox.value;
        const domain = this.domainFilter.getSelectedDomain();
        console.log(domain);
        const cookies = await this.getCookies(searchTerm, domain);

        for (const jarCookie of cookies) {
            const cookieRow = new CookieRow(jarCookie);
            const elem = await cookieRow.getHtmlElement();
            this.cookieRowList.appendChild(elem);
        }

        this.hideLoading();

        this.isLoaded = true;
    }

    async getCookies(searchTerm, domainFilter) {
        console.error("getCookies not implemented by CookieTab subclass.");
    }

    async clearCookieRows() {
        while (this.cookieRowList.firstChild) {
            this.cookieRowList.removeChild(this.cookieRowList.lastChild);
        }
    }

    showLoading() {
        this.loadingIndicator.style.display = "flex";
    }

    hideLoading() {
        this.loadingIndicator.style.display = "none";
    }

    async show() {
        if (!this.isLoaded) {
            await this.loadCookieRows();
        }
        this.showing = true;
        this.cookieTabElement.style.display = "block";
    }

    async hide() {
        this.showing = false;
        this.cookieTabElement.style.display = "none";
    }

    async setDomainFilterValue(domainFilter) {
        // No functionality in base class
    }
}
