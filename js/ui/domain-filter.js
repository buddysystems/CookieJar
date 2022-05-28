class DomainFilter extends UiElement {
    constructor() {
        super();
        this.createHtmlElement();
    }

    createHtmlElement() {
        this.domainFilterElement = document.createElement("input");
        this.domainFilterElement.placeholder = "Filter by domain";
        this.domainFilterElement.type = "text";
        this.domainFilterElement.title = "Filter by domain (e.g. google.com)";
    }

    async resetValue() {
        this.domainFilterElement.value = "";
    }

    async setAsCurrentDomain() {
        const currTab = await getCurrentTab();
        const fullDomain = getUrlToplevelDomain(currTab.url);
        this.domainFilterElement.value;
    }

    async getHtmlElement() {
        return this.domainFilterElement;
    }

    getSelectedDomain() {
        const val = this.domainFilterElement.value;
        return val === "" ? null : val;
    }
}
