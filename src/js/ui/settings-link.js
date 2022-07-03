import { UiElement } from "./ui-element.js";

export class SettingsLink extends UiElement {
    constructor() {
        super();
        this.createHtmlElement();
    }

    createHtmlElement() {
        const container = document.createElement("div");
        container.classList.add("action-button");
        container.addEventListener("click", this.openSettings);

        const icon = document.createElement("img");
        container.appendChild(icon);
        icon.src = "src/assets/img/settings-icon.svg";
        icon.classList.add("action-icon");

        this.link = container;
    }

    openSettings() {
        chrome.runtime.openOptionsPage();
    }
}
