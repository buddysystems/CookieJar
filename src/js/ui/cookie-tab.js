import { UiElement } from "./ui-element.js";
import { BulkCookieSelector } from "../cookies/bulk-cookie-selector.js";
import { ExportCookieModal } from "./export-cookie-modal.js";
import { DomainFilter } from "./domain-filter.js";
import { CookieRow } from "./cookie-row.js";
import { CookieFormModal } from "./cookie-form-modal.js";

export class CookieTab extends UiElement {
    cookieSource = "all";
    hasAnyCookiesSelected = false;

    constructor(cookiesManager) {
        super();
        this.isLoaded = false;
        this.cookiesManager = cookiesManager;
        this.bulkCookieSelector = new BulkCookieSelector(cookiesManager, () =>
            this.updateBulkActionVisibility()
        );
        this.hasElementBeenCreated = false;
        this.cookieRows = [];
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

        // New cookie modal
        const newCookieModal = new CookieFormModal(this.cookiesManager);
        const cookieModalElem = await newCookieModal.getHtmlElement();
        this.cookieTabElement.appendChild(cookieModalElem);

        // Filters (search, domain filter)
        const cookieFiltersContainer = document.createElement("form");
        this.cookieTabElement.appendChild(cookieFiltersContainer);
        cookieFiltersContainer.classList.add("cookie-filters");

        const searchContainer = document.createElement("div");
        searchContainer.classList.add("labeled-input");
        cookieFiltersContainer.appendChild(searchContainer);
        const searchLabel = document.createElement("label");
        searchContainer.appendChild(searchLabel);
        searchLabel.innerText = "Search term";

        this.searchBox = document.createElement("input");
        searchContainer.appendChild(this.searchBox);
        this.searchBox.type = "search";
        this.searchBox.placeholder = 'e.g. "user"';
        this.searchBox.title = "Filter by name, value, or domain";

        const domainContainer = document.createElement("div");
        domainContainer.classList.add("labeled-input");
        cookieFiltersContainer.appendChild(domainContainer);

        const domainLabel = document.createElement("label");
        domainContainer.appendChild(domainLabel);
        domainLabel.innerText = "Domain filter";

        this.domainFilter = new DomainFilter();
        await this.setDomainFilterValue(this.domainFilter);
        const domainFilterElem = await this.domainFilter.getHtmlElement();
        domainContainer.appendChild(domainFilterElem);

        // Cookie source
        const cookieSourceContainer = document.createElement("div");
        cookieSourceContainer.classList.add("labeled-input");
        cookieFiltersContainer.appendChild(cookieSourceContainer);

        const sourceLabel = document.createElement("label");
        cookieSourceContainer.appendChild(sourceLabel);
        sourceLabel.innerText = "Cookie source";

        const sourceSelect = document.createElement("select");
        cookieSourceContainer.appendChild(sourceSelect);
        sourceSelect.innerHTML = `
            <option value="all">All cookies</option>
            <option value="active">Active cookies</option>
            <option value="jar">Jarred cookies</option>
        `;
        sourceSelect.style.marginRight = "270px";
        sourceSelect.addEventListener("change", () => {
            this.cookieSource = sourceSelect.value;
            this.updateBulkActionVisibility();
        });

        const search = async (_) =>
            await this.search(
                this.searchBox.value,
                this.domainFilter.getSelectedDomain()
            );
        // Update on enter or when clear button is pressed (clear btn is native to search input)
        this.searchBox.addEventListener("search", search);
        domainFilterElem.addEventListener("search", search);

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
        bulkRowCheckbox.addEventListener("click", async (e) => {
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
        this.cookieActionsContainer = cookieActionsContainer;
        bulkRow.appendChild(cookieActionsContainer);
        cookieActionsContainer.classList.add("bulk-actions");
        cookieActionsContainer.style.display = "none";

        const unjarActionContainer = document.createElement("div");
        this.unjarActionContainer = unjarActionContainer;
        this.unjarActionContainer.style.display = "none";
        cookieActionsContainer.appendChild(unjarActionContainer);
        unjarActionContainer.classList.add("action-button");
        unjarActionContainer.innerHTML += `
            <img
                src="assets/img/unjar-png.png"
                class="action-icon"
                title="Unjar selected"
            />
            `;
        unjarActionContainer.title = "Move the selected cookies to active";
        unjarActionContainer.addEventListener("click", async () => {
            await this.cookiesManager.restoreCookies(
                this.bulkCookieSelector.selectedCookies
            );
            this.show();
        });

        const jarActionContainer = document.createElement("div");
        this.jarActionContainer = jarActionContainer;
        this.jarActionContainer.style.display = "none";
        cookieActionsContainer.appendChild(jarActionContainer);
        jarActionContainer.classList.add("action-button");
        jarActionContainer.innerHTML += `
        <img
            src="assets/img/jar-icon.png"
            class="action-icon"
            title="Jar selected"
        />
        `;
        jarActionContainer.title = "Move the selected cookies to the jar";
        jarActionContainer.addEventListener("click", async () => {
            await this.cookiesManager.storeCookies(
                this.bulkCookieSelector.selectedCookies
            );
            this.show();
        });

        const deleteActionContainer = document.createElement("div");
        cookieActionsContainer.appendChild(deleteActionContainer);
        deleteActionContainer.classList.add("action-button");
        deleteActionContainer.innerHTML += `
            <img
                src="assets/img/trash-icon.png"
                class="action-icon"
                title="Delete selected"
            />
            `;
        deleteActionContainer.title = "Permanently delete the selected cookies";
        deleteActionContainer.addEventListener("click", async () => {
            await this.cookiesManager.deleteCookies(
                this.bulkCookieSelector.selectedCookies
            );
            this.show();
        });

        const exportActionContainer = document.createElement("div");
        cookieActionsContainer.appendChild(exportActionContainer);
        exportActionContainer.classList.add("action-button");
        exportActionContainer.innerHTML += `
            <img
                src="assets/img/export-icon.svg"
                class="action-icon"
                title="Export selected"
            />
            `;
        exportActionContainer.title = "Export the selected cookies";
        exportActionContainer.addEventListener(
            "click",
            async () => await exportCookieModal.showModal()
        );

        const rulesActionContainer = document.createElement("div");
        cookieActionsContainer.appendChild(rulesActionContainer);
        rulesActionContainer.classList.add("action-button");
        rulesActionContainer.innerHTML += `
            <img
                src="assets/img/rules-icon.svg"
                class="action-icon"
                title="Create rule for selected"
            />
            `;

        // New cookie btn
        const newCookieButton = document.createElement("button");
        bulkRow.appendChild(newCookieButton);
        newCookieButton.classList.add("new-button");
        newCookieButton.title = "Create a new cookie";

        const newCookieIcon = document.createElement("img");
        newCookieIcon.src = "assets/img/simple-cookie-icon-white.svg";
        newCookieButton.appendChild(newCookieIcon);

        newCookieButton.innerHTML += "New";
        newCookieButton.addEventListener(
            "click",
            async () => await newCookieModal.showModal()
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

        // No results
        this.noResultsLabel = document.createElement("div");
        cookiesContainer.appendChild(this.noResultsLabel);
        this.noResultsLabel.classList.add("no-results");
        this.noResultsLabel.innerHTML = "No results";
        this.hideNoResults();
    }

    updateBulkActionVisibility() {
        this.cookieActionsContainer.style.display =
            this.bulkCookieSelector.selectedCookies.length > 0
                ? "flex"
                : "none";

        if (this.cookieSource === "active") {
            this.jarActionContainer.style.display = "flex";
            this.unjarActionContainer.style.display = "none";
        } else if (this.cookieSource === "jar") {
            this.jarActionContainer.style.display = "none";
            this.unjarActionContainer.style.display = "flex";
        }
    }

    async search(searchTerm, domainFilterTerm) {
        await this.loadCookieRows(searchTerm, domainFilterTerm);
    }

    queuedCookiesToLoad = [];

    async loadCookieRows(searchTerm, domainFilterTerm) {
        this.hideNoResults();
        this.showLoading();
        await this.clearCookieRows();

        const cookies = await this.getCookies(searchTerm, domainFilterTerm);
        this.queuedCookiesToLoad = cookies;
        this.hideLoading();

        if (cookies.length == 0) this.showNoResults();

        for (const jarCookie of cookies) {
            if (this.queuedCookiesToLoad.includes(jarCookie)) {
                this.addCookieRow(jarCookie);
                this.queuedCookiesToLoad = this.queuedCookiesToLoad.filter(
                    (c) => c !== jarCookie
                );

                // Throttle the addition of cookie rows to avoid sucking up all ram and preventing the page from updating while loading
                await new Promise((resolve) => setTimeout(resolve, 1));
            }
        }

        this.isLoaded = true;
    }

    async addCookieRow(cookie) {
        const cookieRow = new CookieRow(
            cookie,
            this.cookiesManager,
            this.bulkCookieSelector,
            // This refreshes the entire tab when a single cookie is updated, which is not idea
            // TODO: refresh a single cookie row element instead of the entire tab
            async () => {
                const searchTerm = this.searchBox.value;
                const domain = this.domainFilter.getSelectedDomain();
                await this.loadCookieRows(searchTerm, domain);
            }
        );
        this.cookieRows.push(cookieRow);
        let elem = await cookieRow.getHtmlElement();
        await new Promise((resolve, reject) => {
            this.cookieRowList.appendChild(elem);
            resolve();
        });
    }

    async getCookies(searchTerm, domainFilter) {
        let cookies = await this.cookiesManager.getChromeCookies({
            domain: domainFilter,
        });
        if (searchTerm !== null && searchTerm !== "") {
            const searchTermNormalized = searchTerm.trim().toUpperCase();
            cookies = filterCookieList(cookies, searchTermNormalized);
        }
        return cookies;
    }

    async clearCookieRows() {
        this.queuedCookiesToLoad = [];
        this.cookieRows = [];
        while (this.cookieRowList.firstChild) {
            this.cookieRowList.removeChild(this.cookieRowList.lastChild);
        }
    }

    async show() {
        this.cookieTabElement.style.display = "block";
        // TODO: possibly reenable if we figure out a way to add/remove/update specific CookieRows so that the entire list is only loaded once
        const searchTerm = this.searchBox.value;
        const domain = this.domainFilter.getSelectedDomain();
        await this.loadCookieRows(searchTerm, domain);
    }

    async hide() {
        this.cookieTabElement.style.display = "none";
    }

    showLoading() {
        this.loadingIndicator.style.display = "flex";
    }

    hideLoading() {
        this.loadingIndicator.style.display = "none";
    }

    showNoResults() {
        this.noResultsLabel.style.display = "flex";
    }

    hideNoResults() {
        this.noResultsLabel.style.display = "none";
    }

    async setDomainFilterValue(domainFilter) {
        await domainFilter.setAsCurrentDomain();
    }
}
