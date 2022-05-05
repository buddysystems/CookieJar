class DomainFilter extends UiElement {
    constructor() {
        super();
        this.createHtmlElement();
    }

    createHtmlElement() {
        this.domainFilterElement = document.createElement("input");
        this.domainFilterElement.placeholder = "Filter by domain";
        this.domainFilterElement.type = "text";
    }

    async resetValue() {
        this.domainFilterElement.value = "";
    }

    async setAsCurrentDomain() {
        const currTab = await getCurrentTab();
        this.domainFilterElement.value = getUrlDomain(currTab.url);
    }

    async getHtmlElement() {
        return this.domainFilterElement;
    }

    getSelectedDomain() {
        const val = this.domainFilterElement.value;
        return val === "" ? null : val;
    }
}
