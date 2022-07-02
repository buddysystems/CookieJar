import { UiElement } from "./ui-element.js";
import { ViewTabs } from "./view-tabs.js";
import { CookieTab } from "./cookie-tab.js";
import { PantryTab } from "./pantry-tab.js";
import { RulesTab } from "./rules-tab.js";

export class CookiesTabbedView extends UiElement {
    constructor(cookiesManager, rulesManager) {
        super();
        this.cookiesManager = cookiesManager;
        this.rulesManager = rulesManager;

        this.hasElementBeenCreated = false;
    }

    async getHtmlElement() {
        if (!this.hasElementBeenCreated) {
            this.hasElementBeenCreated = true;
            await this.createBaseTabElement();
        }

        return this.cookieTabbedViewElement;
    }

    async createBaseTabElement() {
        // Container
        this.cookieTabbedViewElement = document.createElement("div");
        this.cookieTabbedViewElement.classList.add("cookie-tab-container");

        // Tab buttons
        const viewTabContainer = document.createElement("div");
        this.cookieTabbedViewElement.appendChild(viewTabContainer);

        const viewTabs = new ViewTabs("cookies");
        const viewTabsElem = await viewTabs.getHtmlElement();
        viewTabContainer.appendChild(viewTabsElem);

        // Cookies view
        this.cookiesTab = new CookieTab(this.cookiesManager, false);
        const activeViewElem = await this.cookiesTab.getHtmlElement();
        this.cookieTabbedViewElement.appendChild(activeViewElem);
        await this.cookiesTab.hide();

        // Rules view
        this.rulesTab = new RulesTab(this.rulesManager);
        const rulesViewElem = await this.rulesTab.getHtmlElement();
        this.cookieTabbedViewElement.appendChild(rulesViewElem);
        await this.rulesTab.hide();

        // Pantry tab:
        this.pantryTab = new PantryTab(this.cookiesManager);
        const pantryTabElem = await this.pantryTab.getHtmlElement();
        this.cookieTabbedViewElement.appendChild(pantryTabElem);
        await this.pantryTab.hide();

        // Tab button functionality
        viewTabs.handleSelectCookies = async () => {
            await this.pantryTab.hide();
            await this.rulesTab.hide();
            await this.cookiesTab.show();
        };

        viewTabs.handleSelectRules = async () => {
            await this.cookiesTab.hide();
            await this.pantryTab.hide();
            await this.rulesTab.show();
        };

        viewTabs.handleSelectPantry = async () => {
            await this.cookiesTab.hide();
            await this.rulesTab.hide();
            await this.pantryTab.show();
        };

        // Help links
        const linksContainer = document.createElement("div");
        linksContainer.classList.add("links-container");
        this.cookieTabbedViewElement.appendChild(linksContainer);

        const helpLink = document.createElement("a");
        helpLink.classList.add("help-link");
        helpLink.href =
            "https://docs.google.com/forms/d/e/1FAIpQLScxwZt7E-LH6BLLs8gVJPkmPQPSBLTts7haAtFkXYGCTtn9cg/viewform?usp=sf_link";
        helpLink.target = "_blank";
        helpLink.innerText = "Report a bug";
        linksContainer.appendChild(helpLink);
    }
}
