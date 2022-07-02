import { UiElement } from "./ui-element.js";
import { BulkCookieSelector } from "../cookies/bulk-cookie-selector.js";
import { ExportCookieModal } from "./export-cookie-modal.js";
import { DomainFilter } from "./domain-filter.js";
import { CookieRow } from "./cookie-row.js";
import { CookieFormModal } from "./cookie-form-modal.js";
import { RulesManager } from "../rules/rules-manager.js";
import { Ruleset } from "../rules/rule.js";
import { RuleRow } from "./rule-row.js";

export class RulesTab extends UiElement {
    cookieSource = "all";
    hasAnyCookiesSelected = false;

    /**
     *
     * @param {RulesManager} rulesManager
     */
    constructor(rulesManager) {
        super();
        this.isLoaded = false;
        this.rulesManager = rulesManager;
        this.hasElementBeenCreated = false;
        this.ruleRows = [];
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
        // this.cookieTabElement.classList.add("cookie-tab");

        // Bulk row export modal
        // TODO: export rule modal
        const exportCookieModal = new ExportCookieModal(
            this.cookiesManager,
            this.bulkCookieSelector
        );
        const exportCookieModalElemn = await exportCookieModal.getHtmlElement();
        this.cookieTabElement.appendChild(exportCookieModalElemn);

        // New rule modal
        // TODO: new rule modal
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

        // Ruleset select
        const rulesetContainer = document.createElement("div");
        rulesetContainer.classList.add("labeled-input");
        cookieFiltersContainer.appendChild(rulesetContainer);

        const rulesetLabel = document.createElement("label");
        rulesetContainer.appendChild(rulesetLabel);
        rulesetLabel.innerText = "Ruleset";

        const sourceSelect = document.createElement("select");
        rulesetContainer.appendChild(sourceSelect);
        sourceSelect.innerHTML = `
            <option value="${Ruleset.Whitelist}">${Ruleset.Whitelist}</option>
            <option value="${Ruleset.Graylist}">${Ruleset.Graylist} (jar)</option>
            <option value="${Ruleset.Blacklist}">${Ruleset.Blacklist} (delete)</option>
        `;
        sourceSelect.style.marginRight = "270px";

        // Rule rows
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
            const allCookies = this.ruleRows.map(
                (cookieRow) => cookieRow.cookie
            );
            if (e.currentTarget.checked) {
                this.bulkCookieSelector.selectCookies(allCookies);
                for (const ruleRow of this.ruleRows) {
                    await ruleRow.checkRowCheckbox();
                }
            } else {
                this.bulkCookieSelector.deselectAllCookies();
                for (const ruleRow of this.ruleRows) {
                    await ruleRow.uncheckRowCheckbox();
                }
            }
        });

        const cookieActionsContainer = document.createElement("div");
        this.cookieActionsContainer = cookieActionsContainer;
        bulkRow.appendChild(cookieActionsContainer);
        cookieActionsContainer.classList.add("bulk-actions");
        cookieActionsContainer.style.display = "flex";

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
        deleteActionContainer.title = "Permanently delete the selected rules";
        deleteActionContainer.addEventListener("click", async () => {
            await this.cookiesManager.deleteCookies(
                this.bulkCookieSelector.selectedCookies
            );
            this.show();
        });

        // New rule btn
        const newRuleButton = document.createElement("button");
        bulkRow.appendChild(newRuleButton);
        newRuleButton.classList.add("new-button");
        newRuleButton.title = "Create a new rule";

        const newCookieIcon = document.createElement("img");
        newCookieIcon.src = "assets/img/rules-icon-white.svg";
        newRuleButton.appendChild(newCookieIcon);

        newRuleButton.innerHTML += "New";
        newRuleButton.addEventListener(
            "click",
            async () => await newCookieModal.showModal()
        );

        // Cookies list
        const cookieRowList = document.createElement("div");
        cookiesContainer.appendChild(cookieRowList);
        this.ruleRowList = cookieRowList;
        this.ruleRowList.classList.add("cookie-row-items");

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
        await this.loadRuleRows(searchTerm, domainFilterTerm);
    }

    queuedRulesToLoad = [];

    async loadRuleRows(searchTerm, domainFilterTerm) {
        this.hideNoResults();
        this.showLoading();
        await this.clearRuleRows();

        const rules = await this.rulesManager.getAll();
        this.queuedRulesToLoad = rules;
        this.hideLoading();

        if (rules.length == 0) this.showNoResults();

        for (const rule of rules) {
            if (this.queuedRulesToLoad.includes(rule)) {
                this.addRuleRow(rule);
                this.queuedRulesToLoad = this.queuedRulesToLoad.filter(
                    (c) => c !== rule
                );

                // Throttle the addition of cookie rows to avoid sucking up all ram and preventing the page from updating while loading
                await new Promise((resolve) => setTimeout(resolve, 1));
            }
        }

        this.isLoaded = true;
    }

    async addRuleRow(rule) {
        const ruleRow = new RuleRow(rule);
        this.ruleRows.push(ruleRow);
        let elem = await ruleRow.getHtmlElement();
        await new Promise((resolve, reject) => {
            this.ruleRowList.appendChild(elem);
            resolve();
        });
    }

    async clearRuleRows() {
        this.queuedRulesToLoad = [];
        this.ruleRows = [];
        while (this.ruleRowList.firstChild) {
            this.ruleRowList.removeChild(this.ruleRowList.lastChild);
        }
    }

    async show() {
        this.cookieTabElement.style.display = "block";
        // TODO: possibly reenable if we figure out a way to add/remove/update specific CookieRows so that the entire list is only loaded once
        const searchTerm = this.searchBox.value;
        await this.loadRuleRows(searchTerm);
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
