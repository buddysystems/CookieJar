class ViewTabs extends UiElement {
    constructor(selectedTabName) {
        super();
        this.createHtmlElement();
        this.handleSelectActive = async () => {};
        this.handleSelectJar = async () => {};
        this.handleSelectPantry = async () => {};
        this.selectedTabName = selectedTabName;
    }

    createHtmlElement() {
        const viewTabsElement = document.createElement("div");
        viewTabsElement.classList.add("view-tabs");

        const activeCookiesTab = document.createElement("span");
        this.activeCookiesTab = activeCookiesTab;
        viewTabsElement.appendChild(activeCookiesTab);
        activeCookiesTab.classList.add("view-tab");
        activeCookiesTab.classList.add("active-tab");
        activeCookiesTab.innerText = "Active Cookies";
        activeCookiesTab.title = "Enabled cookies active in the browser";
        activeCookiesTab.addEventListener("click", async () => {
            this.resetActiveTab();
            this.selectedTabName = "active";
            activeCookiesTab.classList.add("active-tab");
            await this.handleSelectActive();
        });

        const jarCookiesTab = document.createElement("span");
        this.jarCookiesTab = jarCookiesTab;
        viewTabsElement.appendChild(jarCookiesTab);
        jarCookiesTab.classList.add("view-tab");
        jarCookiesTab.innerText = "Jar Cookies";
        jarCookiesTab.title = "Disabled cookies not active in the browser";
        jarCookiesTab.addEventListener("click", async () => {
            this.resetActiveTab();
            this.selectedTabName = "jar";
            jarCookiesTab.classList.add("active-tab");
            await this.handleSelectJar();
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
        this.activeCookiesTab.classList.remove("active-tab");
        this.jarCookiesTab.classList.remove("active-tab");
        this.pantryTab.classList.remove("active-tab");
    }

    async getHtmlElement() {
        return new Promise((resolve, reject) => resolve(this.viewTabsElement));
    }
}
