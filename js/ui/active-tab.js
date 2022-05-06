class ActiveTab extends CookieTab {
    constructor(cookiesManager, showing = false) {
        super(showing);
        this.cookiesManager = cookiesManager;
    }

    async getCookies(searchTerm, domainFilter) {
        let cookies = await this.cookiesManager.getChromeCookies({
            domain: domainFilter,
        });
        if (searchTerm !== null && searchTerm !== "") {
            const searchTermNormalized = searchTerm.trim().toUpperCase();
            cookies = cookies.filter(
                (cookie) =>
                    cookie.name.toUpperCase().includes(searchTermNormalized) ||
                    cookie.value.toUpperCase().includes(searchTermNormalized) ||
                    cookie.details.url
                        .toUpperCase()
                        .includes(searchTermNormalized)
            );
        }
        return cookies;
    }

    async setDomainFilterValue(domainFilter) {
        await domainFilter.setAsCurrentDomain();
    }
}
