import { UiElement } from "./ui-element.js";
import { BulkCookieSelector } from "../cookies/bulk-cookie-selector.js";
import { ExportCookieModal } from "./export-cookie-modal.js";
import { DomainFilter } from "./domain-filter.js";
import { CookieRow } from "./cookie-row.js";

import rightCaret from "../../assets/img/caret-right.png";
import downCaret from "../../assets/img/caret-down.png";
import jarIcon from "../../assets/img/jar-icon.png";
import unjarIcon from "../../assets/img/unjar-png.png";
import trashIcon from "../../assets/img/trash-icon.png";

export class CookieTab extends UiElement {
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
        bulkRow.appendChild(cookieActionsContainer);
        cookieActionsContainer.classList.add("bulk-actions");

        if (this.isJar) {
            const unjarActionContainer = document.createElement("div");
            cookieActionsContainer.appendChild(unjarActionContainer);
            unjarActionContainer.classList.add("action-button");
            unjarActionContainer.innerHTML += `
            <span>unJar selected</span>
            <img
                src=${unjarIcon}
                class="action-icon"
            />
            `;
            unjarActionContainer.title = "Move the selected cookies to active";
            unjarActionContainer.addEventListener("click", async () => {
                await this.cookiesManager.restoreCookies(
                    this.bulkCookieSelector.selectedCookies
                );
                this.show();
            });
        } else {
            const jarActionContainer = document.createElement("div");
            cookieActionsContainer.appendChild(jarActionContainer);
            jarActionContainer.classList.add("action-button");
            jarActionContainer.innerHTML += `
            <span>Jar selected</span>
            <img
                src=${jarIcon}
                class="action-icon"
            />
            `;
            jarActionContainer.title = "Move the selected cookies to the jar";
            jarActionContainer.addEventListener("click", async () => {
                await this.cookiesManager.storeCookies(
                    this.bulkCookieSelector.selectedCookies
                );
                this.show();
            });
        }

        const deleteActionContainer = document.createElement("div");
        cookieActionsContainer.appendChild(deleteActionContainer);
        deleteActionContainer.classList.add("action-button");
        deleteActionContainer.innerHTML += `
            <span>Delete selected</span>
            <img
                src=${trashIcon}
                class="action-icon"
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
            <span>Export selected</span>
            <!-- <img
                src=${trashIcon}
                class="action-icon"
            /> -->
            `;
        exportActionContainer.title = "Export the selected cookies";
        exportActionContainer.addEventListener(
            "click",
            async () => await exportCookieModal.showModal()
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
        console.error("getCookies not implemented by CookieTab subclass.");
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
        // No functionality in base class
    }
}
