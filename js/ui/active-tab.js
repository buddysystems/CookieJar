class ActiveTab extends CookieTab {
    constructor(cookiesManager) {
        super(cookiesManager, false);
    }

    async getCookies(searchTerm, domainFilter) {
        let cookies = await this.cookiesManager.getChromeCookies({
            domain: domainFilter,
        });
        if (searchTerm !== null && searchTerm !== "") {
            const searchTermNormalized = searchTerm.trim().toUpperCase();
            cookies = filterCookieList(cookies, searchTermNormalized);
        }
        return cookies;
    }

    async setDomainFilterValue(domainFilter) {
        await domainFilter.setAsCurrentDomain();
    }

}