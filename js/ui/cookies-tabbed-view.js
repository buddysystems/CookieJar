class CookiesTabbedView extends UiElement {
    constructor(cookiesManager) {
        super();
        this.cookiesManager = cookiesManager;

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

        const viewTabs = new ViewTabs("active");
        const viewTabsElem = await viewTabs.getHtmlElement();
        viewTabContainer.appendChild(viewTabsElem);

        // Active view
        this.activeTab = new ActiveTab(this.cookiesManager);
        const activeViewElem = await this.activeTab.getHtmlElement();
        this.cookieTabbedViewElement.appendChild(activeViewElem);
        await this.activeTab.hide();

        // Jar view
        this.jarTab = new JarTab(this.cookiesManager);
        const jarViewElem = await this.jarTab.getHtmlElement();
        this.cookieTabbedViewElement.appendChild(jarViewElem);
        await this.jarTab.hide();

        // Shelf tab:
        this.shelfTab = new ShelfTab(this.cookiesManager);
        const shelfTabElem = await this.shelfTab.getHtmlElement();
        this.cookieTabbedViewElement.appendChild(shelfTabElem);
        await this.shelfTab.hide();

        // Tab button functionality
        viewTabs.handleSelectActive = async () => {
            await this.jarTab.hide();
            await this.shelfTab.hide();
            await this.activeTab.show();
        };
        viewTabs.handleSelectJar = async () => {
            await this.activeTab.hide();
            await this.shelfTab.hide();
            await this.jarTab.show();
        };

        viewTabs.handleSelectShelf = async () => {
            await this.jarTab.hide();
            await this.activeTab.hide();
            await this.shelfTab.show();
        };
    }
}
