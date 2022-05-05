class JarTab extends CookieTab {
    constructor(cookiesManager, showing = false) {
        super(showing);
        this.cookiesManager = cookiesManager;
    }

    async getCookies(searchTerm, domainFilter) {
        // TODO: use search term
        return await this.cookiesManager.getJarredCookies({
            domain: domainFilter,
        });
    }

    async setDomainFilterValue(domainFilter) {
        await domainFilter.resetValue();
    }
}
