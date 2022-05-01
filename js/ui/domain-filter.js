class DomainFilter extends UiElement {
    constructor() {
        super();
        this.createHtmlElement();
    }

    createHtmlElement() {
        this.domainFilterElement = document.createElement("input");
        this.domainFilterElement.type = "text";
    }

    async getHtmlElement() {
        const currTab = await getCurrentTab();
        this.domainFilterElement.value = getUrlDomain(currTab.url);
        return this.domainFilterElement;
    }

    async getCurrentDomain() {
        return this.domainFilterElement.value;
    }
}
