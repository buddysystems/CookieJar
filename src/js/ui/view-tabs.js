import { UiElement } from "./ui-element.js";

export class ViewTabs extends UiElement {
    constructor(selectedTabName) {
        super();
        this.createHtmlElement();
        this.handleSelectCookies = async () => {};
        this.handleSelectPantry = async () => {};
        this.selectedTabName = selectedTabName;
    }

    createHtmlElement() {
        const viewTabsElement = document.createElement("div");
        viewTabsElement.classList.add("view-tabs");

        const cookiesTab = document.createElement("span");
        this.cookiesTab = cookiesTab;
        viewTabsElement.appendChild(cookiesTab);
        cookiesTab.classList.add("view-tab");
        cookiesTab.classList.add("active-tab");
        cookiesTab.innerText = "Cookies";
        cookiesTab.title = "View cookies which are active or jarred.";
        cookiesTab.addEventListener("click", async () => {
            this.resetActiveTab();
            this.selectedTabName = "cookies";
            cookiesTab.classList.add("active-tab");
            await this.handleSelectCookies();
        });

        const pantryTab = document.createElement("span");
        this.pantryTab = pantryTab;
        viewTabsElement.appendChild(pantryTab);
        pantryTab.classList.add("view-tab");
        pantryTab.innerText = "Pantry (Import/Export)";
        pantryTab.title = "Export cookies to use elsewhere";
        pantryTab.addEventListener("click", async () => {
            this.resetActiveTab();
            this.selectedTabName = "pantry";
            pantryTab.classList.add("active-tab");
            await this.handleSelectPantry();
        });

        this.viewTabsElement = viewTabsElement;
    }

    resetActiveTab() {
        this.cookiesTab.classList.remove("active-tab");
        this.pantryTab.classList.remove("active-tab");
    }

    async getHtmlElement() {
        return new Promise((resolve, reject) => resolve(this.viewTabsElement));
    }
}
