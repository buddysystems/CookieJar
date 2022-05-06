class CookieTab extends UiElement {
    constructor(showing = false) {
        super();
        this.showing = false;
        this.isLoaded = false;

        this.hasElementBeenCreated = false;
    }

    async getHtmlElement() {
        if (!this.hasElementBeenCreated) {
            this.hasElementBeenCreated = true;
            await this.createBaseTabElement();
        }

        return this.cookieTabElement;
    }

    async createBaseTabElement() {
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
        cookieFiltersContainer.appendChild(domainFilterElem);

        const cookiesContainer = document.createElement("div");
        this.cookieTabElement.appendChild(cookiesContainer);
        cookiesContainer.classList.add("cookie-list");

        // Bulk row
        const bulkRow = document.createElement("div");
        cookiesContainer.appendChild(bulkRow);
        bulkRow.classList.add("bulk-row");

        const bulkRowCheckbox = document.createElement("input");
        bulkRow.appendChild(bulkRowCheckbox);
        bulkRowCheckbox.type = "checkbox";
        bulkRowCheckbox.classList.add("cookie-row-selector");

        const cookieActionsContainer = document.createElement("div");
        bulkRow.appendChild(cookieActionsContainer);
        cookieActionsContainer.classList.add("bulk-actions");

        const jarActionContainer = document.createElement("div");
        bulkRow.appendChild(jarActionContainer);
        jarActionContainer.classList.add("action-button");
        jarActionContainer.innerHTML += `
            <span>Jar selected</span>
            <img
                src="/assets/icons/action-bar/jar-icon.png"
                class="action-icon"
            />
            `;

        const deleteActionContainer = document.createElement("div");
        bulkRow.appendChild(deleteActionContainer);
        deleteActionContainer.classList.add("action-button");
        deleteActionContainer.innerHTML += `
            <span>Delete selected</span>
            <img
                src="/assets/icons/action-bar/trash-icon.png"
                class="action-icon"
            />
            `;

        const exportActionContainer = document.createElement("div");
        bulkRow.appendChild(exportActionContainer);
        exportActionContainer.classList.add("action-button");
        exportActionContainer.innerHTML += `
            <span>Export selected</span>
            <!-- <img
                src="/assets/icons/action-bar/trash-icon.png"
                class="action-icon"
            /> -->
            `;

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
        await this.clearCookieRows();

        this.showLoading();

        const searchTerm = this.searchBox.value;
        const domain = this.domainFilter.getSelectedDomain();
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
