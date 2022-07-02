import { JarCookie } from "../cookies/jar-cookie.js";
import { createCookieForm, createRuleForm } from "../helpers/ui-creators.js";
import { Rule } from "../rules/rule.js";
import { UiElement } from "./ui-element.js";

export class RuleFormModal extends UiElement {
    constructor(rulesManager) {
        super();
        this.rulesManager = rulesManager;
        this.createHtmlElement();
    }

    createHtmlElement() {
        this.modalElement = document.createElement("div");
        this.modalElement.classList.add("modal");

        const modalContentContainer = document.createElement("div");
        this.modalElement.appendChild(modalContentContainer);
        modalContentContainer.classList.add("modal-content");
        modalContentContainer.classList.add("fullscreen");

        const mainContent = document.createElement("div");
        mainContent.classList.add("main-content");
        modalContentContainer.appendChild(mainContent);

        const title = document.createElement("h1");
        mainContent.appendChild(title);
        title.classList.add("title");
        title.innerText = "Create new rule";

        const ruleForm = createRuleForm(
            new Rule(),
            this.handleCancel,
            this.handleSave
        );
        mainContent.appendChild(ruleForm);
    }

    handleCancel = async () => {
        await this.hideModal();
    };

    handleSave = async (updatedCookie) => {
        await this.hideModal();
    };

    async showModal() {
        this.modalElement.style.display = "block";
    }

    async hideModal() {
        this.modalElement.style.display = "none";
    }

    async getHtmlElement() {
        return new Promise((resolve, reject) => resolve(this.modalElement));
    }
}
