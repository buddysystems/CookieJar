class JarTab extends CookieTab {
    constructor(cookiesManager, showing = false) {
        super(showing);
        this.cookiesManager = cookiesManager;
    }

    async getCookies(searchTerm, domainFilter) {
        let cookies = await this.cookiesManager.getJarredCookies({
            domain: domainFilter,
        });

        if (searchTerm !== null && searchTerm !== "") {
            const searchTermNormalized = searchTerm.trim().toUpperCase();
            cookies = filterCookieList(cookies, searchTermNormalized);
        }
        return cookies;
    }

    async setDomainFilterValue(domainFilter) {
        await domainFilter.resetValue();
    }
}
