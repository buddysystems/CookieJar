import { UiElement } from "./ui-element";
import { getCurrentTab } from "../helpers/chrome-tabs-util";
import { getUrlTopLevelDomain } from "../helpers/string-util";

export class DomainFilter extends UiElement {
    constructor() {
        super();
        this.createHtmlElement();
    }

    createHtmlElement() {
        this.domainFilterElement = document.createElement("input");
        this.domainFilterElement.placeholder = 'e.g. "google.com"';
        this.domainFilterElement.type = "search";
        this.domainFilterElement.title = "Filter by domain (e.g. google.com)";
    }

    async resetValue() {
        this.domainFilterElement.value = "";
    }

    async setAsCurrentDomain() {
        const currTab = await getCurrentTab();
        const topLevelDomain = getUrlTopLevelDomain(currTab.url);
        this.domainFilterElement.value = topLevelDomain;
    }

    async getHtmlElement() {
        return this.domainFilterElement;
    }

    getSelectedDomain() {
        const val = this.domainFilterElement.value;
        return val === "" ? null : val;
    }
}
