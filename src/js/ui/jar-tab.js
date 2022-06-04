import { CookieTab } from "./cookie-tab.js";

export class JarTab extends CookieTab {
    constructor(cookiesManager) {
        super(cookiesManager, true);
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
