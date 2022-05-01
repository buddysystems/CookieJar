class ViewTabs extends UiElement {
    constructor(
        handleSelectActiveAsync,
        handleSelectJarAsync,
        handleSelectShelfAsync
    ) {
        super();
        this.createHtmlElement();
        this.handleSelectActive = handleSelectActiveAsync;
        this.handleSelectJar = handleSelectJarAsync;
        this.handleSelectShelf = handleSelectShelfAsync;
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
        activeCookiesTab.addEventListener("click", async () => {
            this.resetActiveTab();
            activeCookiesTab.classList.add("active-tab");
            await this.handleSelectActive();
        });

        const jarCookiesTab = document.createElement("span");
        this.jarCookiesTab = jarCookiesTab;
        viewTabsElement.appendChild(jarCookiesTab);
        jarCookiesTab.classList.add("view-tab");
        jarCookiesTab.innerText = "Jar Cookies";
        jarCookiesTab.addEventListener("click", async () => {
            this.resetActiveTab();
            jarCookiesTab.classList.add("active-tab");
            await this.handleSelectJar();
        });

        const shelfTab = document.createElement("span");
        this.shelfTab = shelfTab;
        viewTabsElement.appendChild(shelfTab);
        shelfTab.classList.add("view-tab");
        shelfTab.innerText = "Shelf (Import/Export)";
        shelfTab.addEventListener("click", async () => {
            this.resetActiveTab();
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

    getHtmlElement() {
        return this.viewTabsElement;
    }
}
