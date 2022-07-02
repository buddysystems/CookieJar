import { JarCookie } from "../cookies/jar-cookie.js";
import { createCookieForm } from "../helpers/ui-creators.js";
import { UiElement } from "./ui-element.js";

export class CookieFormModal extends UiElement {
    constructor(cookiesManager) {
        super();
        this.cookiesManager = cookiesManager;
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
        title.innerText = "Create new cookie";

        const cookieForm = createCookieForm(
            new JarCookie(),
            this.handleCancel,
            this.handleSave
        );
        mainContent.appendChild(cookieForm);
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
