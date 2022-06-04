import { UiElement } from "./ui-element.js";
import {
    readFilesAsTextAsync,
    readFileAsTextAsync,
} from "../helpers/file-reader-util.js";
import { jsonToCookies } from "../helpers/cookie-json-util.js";
import { decryptText } from "../helpers/encryption.js";

export class PantryTab extends UiElement {
    constructor(cookiesManager, showing = false) {
        super();
        this.cookiesManager = cookiesManager;

        this.createHtmlElement();
    }

    async handleImport(importSourceFiles, decryptionPassword) {
        this.hideImportFileLabel();
        for (const file of importSourceFiles) {
            if (file.type !== "application/json") {
                console.warn("Tried importing file which wasn't .json");
                this.showInvalidImportFileLabel(
                    `${file.name} has an invalid file type (must be .json file)`
                );
                return;
            }
        }

        let cookies = [];
        try {
            let fileContents = await readFilesAsTextAsync(importSourceFiles);

            if (decryptionPassword) {
                const fileData = JSON.parse(fileContents);
                if (!("data" in fileData)) {
                    throw new Error(
                        "Tried to decrypt invalid or unencrypted file."
                    );
                }
                fileContents = decryptText(fileData.data, decryptionPassword);
            }
            cookies = jsonToCookies(fileContents);
        } catch (e) {
            console.warn(e);
            this.showInvalidImportFileLabel(
                "Could not parse file. If file is encrypted, ensure the right password is used."
            );
            return;
        }

        let ignoredCookies = 0;
        for (const cookie of cookies) {
            try {
                await this.cookiesManager.upsertCookie(cookie);
            } catch (e) {
                ignoredCookies++;
                if (e instanceof DOMException) {
                    console.warn(e);
                } else {
                    this.showInvalidImportFileLabel(
                        `Error when trying to import one or more cookies. ${ignoredCookies} ignored and not added.`
                    );
                }
            }
        }

        if (ignoredCookies == 0) {
            this.showSuccessImportFileLabel(
                "Successfully imported all cookies from file(s)."
            );
        } else {
            this.showSuccessImportFileLabel(
                `Successfully imported cookies from file(s). ${ignoredCookies} duplicate cookies which couldn't be added were ignored.`
            );
        }
    }

    async handleExport(selectedExportDestination, encryptionPassword) {
        let cookiesToExport = [];
        try {
            if (selectedExportDestination === "all") {
                cookiesToExport = await this.cookiesManager.getAll();
            } else if (selectedExportDestination === "active") {
                cookiesToExport = await this.cookiesManager.getChromeCookies();
            } else if (selectedExportDestination === "jar") {
                cookiesToExport = await this.cookiesManager.getJarredCookies();
            } else {
                this.showInvalidExportLabel("Invalid export source.");
                console.error(
                    "Invalid export destination selected. Should be one of 'active' or 'jar'."
                );
            }
        } catch (e) {
            console.error(e);
            this.showInvalidExportLabel(
                "An error occured when retrieving cookies to export."
            );
        }
        try {
            const cookiesJson = cookiesToJson(cookiesToExport);

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

            this.showSuccessExportLabel(
                `Successfully exported ${selectedExportDestination.toLowerCase()} cookies.`
            );
        } catch (e) {
            console.error(e);
            this.showInvalidExportLabel("Could not parse cookies into JSON.");
        }
    }

    createHtmlElement() {
        this.pantryTabElement = document.createElement("div");
        this.pantryTabElement.classList.add("pantry-tab");

        const importForm = this.createImportForm();
        this.pantryTabElement.appendChild(importForm);

        const exportForm = this.createExportForm();
        this.pantryTabElement.appendChild(exportForm);
    }

    createImportForm() {
        const importForm = document.createElement("form");
        importForm.classList.add("pantry-form");

        importForm.innerHTML += `<h2 class="form-heading">Import cookies</h2>`;

        this.importFileLabel = document.createElement("label");
        importForm.appendChild(this.importFileLabel);
        this.hideImportFileLabel();

        const fileSelectorContainer = document.createElement("div");
        importForm.appendChild(fileSelectorContainer);
        fileSelectorContainer.classList.add("labeled-input");

        const fileSelectorLabel = document.createElement("label");
        fileSelectorContainer.appendChild(fileSelectorLabel);
        fileSelectorLabel.innerText = "Cookie jar file (.json)";

        const fileSelectorInput = document.createElement("input");
        fileSelectorContainer.append(fileSelectorInput);
        fileSelectorInput.type = "file";
        fileSelectorInput.accept = ".json";

        const passwordContainer = document.createElement("div");
        importForm.appendChild(passwordContainer);
        passwordContainer.classList.add("labeled-input");

        const passwordLabel = document.createElement("label");
        passwordContainer.appendChild(passwordLabel);
        passwordLabel.innerText = "Decryption password?";

        const passwordInput = document.createElement("input");
        passwordContainer.appendChild(passwordInput);
        passwordInput.type = "password";

        const exportActionsContainer = document.createElement("div");
        importForm.appendChild(exportActionsContainer);
        exportActionsContainer.classList.add("form-actions");

        const importButton = document.createElement("button");
        exportActionsContainer.appendChild(importButton);
        importButton.innerText = "Import";
        importButton.type = "button"; // Defaults to 'submit' which refreshes the extension

        importButton.addEventListener("click", async () =>
            this.handleImport(fileSelectorInput.files, passwordInput.value)
        );

        return importForm;
    }

    hideImportFileLabel() {
        this.importFileLabel.classList = [];
        this.importFileLabel.style.display = "none";
    }

    showInvalidImportFileLabel(message) {
        this.importFileLabel.classList.add("error-label");
        this.importFileLabel.innerText = message;
        this.importFileLabel.style.display = "block";
    }

    showSuccessImportFileLabel(message) {
        this.importFileLabel.classList.add("success-label");
        this.importFileLabel.innerText = message;
        this.importFileLabel.style.display = "block";
    }

    createExportForm() {
        const exportForm = document.createElement("form");
        exportForm.classList.add("pantry-form");

        exportForm.innerHTML += `<h2 class="form-heading">Export cookies</h2>`;

        this.exportLabel = document.createElement("label");
        exportForm.appendChild(this.exportLabel);
        this.hideExportLabel();

        const exportSourceContainer = document.createElement("div");
        exportSourceContainer.classList.add("labeled-input");
        exportForm.appendChild(exportSourceContainer);

        const exportLabel = document.createElement("label");
        exportSourceContainer.appendChild(exportLabel);
        exportLabel.innerText = "Export Source";

        const sourceSelect = document.createElement("select");
        exportSourceContainer.appendChild(sourceSelect);
        sourceSelect.innerHTML = `
            <option value="all">All cookies</option>
            <option value="active">Active cookies</option>
            <option value="jar">Jarred cookies</option>
        `;

        const passwordContainer = document.createElement("div");
        exportForm.appendChild(passwordContainer);
        passwordContainer.classList.add("labeled-input");

        const passwordLabel = document.createElement("label");
        passwordContainer.appendChild(passwordLabel);
        passwordLabel.innerText = "Encryption password?";

        const passwordInput = document.createElement("input");
        passwordContainer.appendChild(passwordInput);
        passwordInput.type = "password";

        const exportActionsContainer = document.createElement("div");
        exportForm.appendChild(exportActionsContainer);
        exportActionsContainer.classList.add("form-actions");

        const exportButton = document.createElement("button");
        exportActionsContainer.appendChild(exportButton);
        exportButton.type = "button"; // Button type defaults ot 'submit' within forms, which will cause the extension to reload
        exportButton.innerText = "Export";

        exportButton.addEventListener("click", async () =>
            this.handleExport(sourceSelect.value, passwordInput.value)
        );

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

    async getHtmlElement() {
        return this.pantryTabElement;
    }

    async show() {
        this.pantryTabElement.style.display = "flex";
    }

    async hide() {
        this.pantryTabElement.style.display = "none";
    }
}
