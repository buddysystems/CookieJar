class CookieTab extends UiElement {
    constructor(cookiesManager, isJar) {
        super();
        this.isLoaded = false;
        this.cookiesManager = cookiesManager;
        this.bulkCookieSelector = new BulkCookieSelector(cookiesManager);
        this.hasElementBeenCreated = false;
        this.cookieRows = [];
        this.isJar = isJar;
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

        // Bulk row export modal
        const exportCookieModal = new ExportCookieModal(
            this.cookiesManager,
            this.bulkCookieSelector
        );
        const exportCookieModalElemn = await exportCookieModal.getHtmlElement();
        this.cookieTabElement.appendChild(exportCookieModalElemn);

        // Filters (search, domain filter)
        const cookieFiltersContainer = document.createElement("div");
        this.cookieTabElement.appendChild(cookieFiltersContainer);
        cookieFiltersContainer.classList.add("cookie-filters");

        this.searchBox = document.createElement("input");
        cookieFiltersContainer.appendChild(this.searchBox);
        this.searchBox.type = "text";
        this.searchBox.placeholder = "Search for cookies";
        this.searchBox.title = "Filter by name, value, or domain";

        this.domainFilter = new DomainFilter();
        await this.setDomainFilterValue(this.domainFilter);
        const domainFilterElem = await this.domainFilter.getHtmlElement();
        cookieFiltersContainer.appendChild(domainFilterElem);

        const searchButton = document.createElement("button");
        cookieFiltersContainer.appendChild(searchButton);
        searchButton.innerText = "Search";
        searchButton.type = "button";
        searchButton.addEventListener("click", async() => {
            await this.search(
                this.searchBox.value,
                this.domainFilter.getSelectedDomain()
            );
        });

        // Cookie rows
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
        bulkRowCheckbox.title = "Select all for bulk actions";
        bulkRowCheckbox.addEventListener("click", async(e) => {
            const allCookies = this.cookieRows.map(
                (cookieRow) => cookieRow.cookie
            );
            if (e.currentTarget.checked) {
                this.bulkCookieSelector.selectCookies(allCookies);
                for (const cookieRow of this.cookieRows) {
                    await cookieRow.checkRowCheckbox();
                }
            } else {
                this.bulkCookieSelector.deselectAllCookies();
                for (const cookieRow of this.cookieRows) {
                    await cookieRow.uncheckRowCheckbox();
                }
            }
        });

        const cookieActionsContainer = document.createElement("div");
        bulkRow.appendChild(cookieActionsContainer);
        cookieActionsContainer.classList.add("bulk-actions");

        if (this.isJar) {
            const unjarActionContainer = document.createElement("div");
            cookieActionsContainer.appendChild(unjarActionContainer);
            unjarActionContainer.classList.add("action-button");
            unjarActionContainer.innerHTML += `
            <span>unJar selected</span>
            <img
                src="/assets/icons/action-bar/unjar-png.png"
                class="action-icon"
            />
            `;
            unjarActionContainer.title = "Move the selected cookies to active";
            unjarActionContainer.addEventListener(
                "click",
                async() => {
                    this.cookiesManager.restoreCookies(this.bulkCookieSelector.selectedCookies)
                }
            );
        } else {
            const jarActionContainer = document.createElement("div");
            cookieActionsContainer.appendChild(jarActionContainer);
            jarActionContainer.classList.add("action-button");
            jarActionContainer.innerHTML += `
            <span>Jar selected</span>
            <img
                src="/assets/icons/action-bar/jar-icon.png"
                class="action-icon"
            />
            `;
            jarActionContainer.title = "Move the selected cookies to the jar";
            jarActionContainer.addEventListener(
                "click",
                async() => {
                    this.cookiesManager.storeCookies(this.bulkCookieSelector.selectedCookies)
                }

            );
        }

        const deleteActionContainer = document.createElement("div");
        cookieActionsContainer.appendChild(deleteActionContainer);
        deleteActionContainer.classList.add("action-button");
        deleteActionContainer.innerHTML += `
            <span>Delete selected</span>
            <img
                src="/assets/icons/action-bar/trash-icon.png"
                class="action-icon"
            />
            `;
        deleteActionContainer.title = "Permanently delete the selected cookies";
        deleteActionContainer.addEventListener(
            "click",
            async() => console.log('test')
        );

        const exportActionContainer = document.createElement("div");
        cookieActionsContainer.appendChild(exportActionContainer);
        exportActionContainer.classList.add("action-button");
        exportActionContainer.innerHTML += `
            <span>Export selected</span>
            <!-- <img
                src="/assets/icons/action-bar/trash-icon.png"
                class="action-icon"
            /> -->
            `;
        exportActionContainer.title = "Export the selected cookies";
        exportActionContainer.addEventListener(
            "click",
            async() => await exportCookieModal.showModal()
        );

        // Cookies list
        const cookieRowList = document.createElement("div");
        cookiesContainer.appendChild(cookieRowList);
        this.cookieRowList = cookieRowList;
        this.cookieRowList.classList.add("cookie-row-items");

        // Loading indicator
        const loadingIndicator = document.createElement("div");
        cookiesContainer.appendChild(loadingIndicator);
        loadingIndicator.classList.add("loading-indicator");
        loadingIndicator.innerHTML = "Loading&hellip;";
        this.loadingIndicator = loadingIndicator;
        this.hideLoading();
    }

    async search(searchTerm, domainFilterTerm) {
        await this.loadCookieRows(searchTerm, domainFilterTerm);
    }

    async loadCookieRows(searchTerm, domainFilterTerm) {
        // this.showLoading();
        await this.clearCookieRows();

        const cookies = await this.getCookies(searchTerm, domainFilterTerm);
        // this.hideLoading();
        for (const jarCookie of cookies) {
            await this.addCookieRow(jarCookie);
            // Throttle the addition of cookie rows to avoid sucking up all ram and preventing the page from updating while loading
            await new Promise((resolve) => setTimeout(resolve, 10));
        }

        this.isLoaded = true;
    }

    async addCookieRow(cookie) {
        const cookieRow = new CookieRow(
            cookie,
            this.cookiesManager,
            this.bulkCookieSelector
        );
        this.cookieRows.push(cookieRow);
        const elem = await cookieRow.getHtmlElement();
        await new Promise((resolve, reject) => {
            this.cookieRowList.appendChild(elem);
            console.log("cookie row appended");
            resolve();
        });
    }

    async getCookies(searchTerm, domainFilter) {
        console.error("getCookies not implemented by CookieTab subclass.");
    }

    async clearCookieRows() {
        this.cookieRows = [];
        while (this.cookieRowList.firstChild) {
            this.cookieRowList.removeChild(this.cookieRowList.lastChild);
        }
    }

    async show() {
        this.cookieTabElement.style.display = "block";
        // TODO: possibly reenable if we figure out a way to add/remove/update specific CookieRows so that the entire list is only loaded once
        // if (!this.isLoaded) {
        const searchTerm = this.searchBox.value;
        const domain = this.domainFilter.getSelectedDomain();
        await this.loadCookieRows(searchTerm, domain);
        // }
    }

    async hide() {
        this.cookieTabElement.style.display = "none";
    }

    showLoading() {
        console.log("showLoading");
        // this.loadingIndicator.style.display = "flex";
    }

    hideLoading() {
        this.loadingIndicator.style.display = "none";
    }

    async setDomainFilterValue(domainFilter) {
        // No functionality in base class
    }
}