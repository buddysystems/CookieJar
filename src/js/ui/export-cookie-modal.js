import { cookiesToJson } from "../helpers/cookie-json-util.js";
import { UiElement } from "./ui-element.js";
import { encryptText } from "../helpers/encryption.js";
import { downloadJson } from "../helpers/download-util.js";

export class ExportCookieModal extends UiElement {
    constructor(cookiesManager, bulkCookieSelector) {
        super();
        this.cookiesManager = cookiesManager;
        this.bulkCookieSelector = bulkCookieSelector;
        this.createHtmlElement();
    }

    createHtmlElement() {
        this.modalElement = document.createElement("div");
        this.modalElement.classList.add("modal");

        const modalContentContainer = document.createElement("div");
        this.modalElement.appendChild(modalContentContainer);
        modalContentContainer.classList.add("modal-content");

        const exportForm = this.createExportForm();
        modalContentContainer.appendChild(exportForm);

        const exportActionsContainer = document.createElement("div");
        modalContentContainer.appendChild(exportActionsContainer);
        exportActionsContainer.classList.add("form-actions");

        const cancelButton = document.createElement("button");
        exportActionsContainer.appendChild(cancelButton);
        cancelButton.type = "button";
        cancelButton.innerText = "Cancel";
        cancelButton.addEventListener(
            "click",
            async () => await this.hideModal()
        );

        const exportButton = document.createElement("button");
        exportActionsContainer.appendChild(exportButton);
        exportButton.type = "button";
        exportButton.innerText = "Export";

        exportButton.addEventListener("click", async () =>
            this.handleExport(this.passwordInput.value)
        );
    }

    // We violate the DRY principle a bit by copying from pantry-tab.js. That's how we know we are good developers :)
    createExportForm() {
        const exportForm = document.createElement("form");

        exportForm.innerHTML += `<h2 class="form-heading">Export selected cookies</h2>`;

        this.infoParagraph = document.createElement("p");
        exportForm.appendChild(this.infoParagraph);
        this.infoParagraph.classList.add("secondary");

        this.exportLabel = document.createElement("label");
        exportForm.appendChild(this.exportLabel);
        this.hideExportLabel();

        const exportSourceContainer = document.createElement("div");
        exportSourceContainer.classList.add("labeled-input");
        exportForm.appendChild(exportSourceContainer);

        const passwordContainer = document.createElement("div");
        exportForm.appendChild(passwordContainer);
        passwordContainer.classList.add("labeled-input");

        const passwordLabel = document.createElement("label");
        passwordContainer.appendChild(passwordLabel);
        passwordLabel.innerText = "Encryption password?";

        this.passwordInput = document.createElement("input");
        passwordContainer.appendChild(this.passwordInput);
        this.passwordInput.type = "password";

        return exportForm;
    }

    hideExportLabel() {
        this.exportLabel.classList = [];
        this.exportLabel.style.display = "none";
    }

    showInvalidExportLabel(message) {
        this.exportLabel.classList.add("error-label");
        this.exportLabel.innerText = message;
        this.exportLabel.style.display = "block";
    }

    showSuccessExportLabel(message) {
        this.exportLabel.classList.add("success-label");
        this.exportLabel.innerText = message;
        this.exportLabel.style.display = "block";
    }

    async handleExport(encryptionPassword) {
        const cookiesToExport = this.bulkCookieSelector.selectedCookies;
        const cookiesJson = cookiesToJson(cookiesToExport);
        try {
            if (encryptionPassword) {
                const encryptedFileText = encryptText(
                    JSON.stringify(cookiesJson),
                    encryptionPassword
                );
                downloadJson({
                    data: encryptedFileText,
                });
            } else {
                downloadJson(cookiesJson);
            }

            await this.hideModal();
        } catch (e) {
            console.error(e);
            this.showInvalidExportLabel("Could not parse cookies into JSON.");
        }
    }

    async showModal() {
        this.infoParagraph.innerText = `${this.bulkCookieSelector.selectedCookies.length} cookies selected.`;
        this.modalElement.style.display = "block";
    }

    async hideModal() {
        this.modalElement.style.display = "none";
    }

    async getHtmlElement() {
        return new Promise((resolve, reject) => resolve(this.modalElement));
    }
}
