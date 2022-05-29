class ViewTabs extends UiElement {
    constructor(selectedTabName) {
        super();
        this.createHtmlElement();
        this.handleSelectActive = async () => {};
        this.handleSelectJar = async () => {};
        this.handleSelectShelf = async () => {};
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

        const shelfTab = document.createElement("span");
        this.shelfTab = shelfTab;
        viewTabsElement.appendChild(shelfTab);
        shelfTab.classList.add("view-tab");
        shelfTab.innerText = "Shelf (Import/Export)";
        shelfTab.title = "Export cookies to use elsewhere";
        shelfTab.addEventListener("click", async () => {
            this.resetActiveTab();
            this.selectedTabName = "shelf";
            shelfTab.classList.add("active-tab");
            await this.handleSelectShelf();
        });

        this.viewTabsElement = viewTabsElement;
    }

    resetActiveTab() {
        this.activeCookiesTab.classList.remove("active-tab");
        this.jarCookiesTab.classList.remove("active-tab");
        this.shelfTab.classList.remove("active-tab");
    }

    async getHtmlElement() {
        return new Promise((resolve, reject) => resolve(this.viewTabsElement));
    }
}
