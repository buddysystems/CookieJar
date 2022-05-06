class ShelfTab extends UiElement {
    constructor(cookiesManager, showing = false) {
        super();
        this.cookiesManager = cookiesManager;

        this.createHtmlElement();
    }

    async handleExport(selectedExportDestination) {
        let cookiesToExport = [];
        if (selectedExportDestination === "active") {
            cookiesToExport = await this.cookiesManager.getChromeCookies();
        } else if (selectedExportDestination === "jar") {
            cookiesToExport = await this.cookiesManager.getJarredCookies();
        } else {
            console.error(
                "Invalid export destination selected. Should be one of 'active' or 'jar'."
            );
        }
        const fileJson = cookiesToJson(cookiesToExport);
        downloadJson(fileJson);
    }

    createHtmlElement() {
        this.shelfTabElement = document.createElement("div");
        this.shelfTabElement.classList.add("shelf-tab");

        const importForm = this.createImportForm();
        this.shelfTabElement.appendChild(importForm);

        const exportForm = this.createExportForm();
        this.shelfTabElement.appendChild(exportForm);
    }

    createImportForm() {
        const importForm = document.createElement("form");
        importForm.classList.add("shelf-form");

        importForm.innerHTML += `<h2 class="form-heading">Import cookies</h2>`;

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

        const destinationContainer = document.createElement("div");
        destinationContainer.classList.add("labeled-input");
        importForm.appendChild(destinationContainer);

        const importLabel = document.createElement("label");
        destinationContainer.appendChild(importLabel);
        importLabel.innerText = "Import destination";

        const destinationSelect = document.createElement("select");
        destinationContainer.appendChild(destinationSelect);
        destinationSelect.innerHTML = `
            <option value="active">Active cookies</option>
            <option value="jar">Jarred cookies</option>
        `;

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
        importButton.addEventListener("click", () => console.log("import"));

        return importForm;
    }

    createExportForm() {
        const exportForm = document.createElement("form");
        exportForm.classList.add("shelf-form");

        exportForm.innerHTML += `<h2 class="form-heading">Export cookies</h2>`;

        const exportSourceContainer = document.createElement("div");
        exportSourceContainer.classList.add("labeled-input");
        exportForm.appendChild(exportSourceContainer);

        const exportLabel = document.createElement("label");
        exportSourceContainer.appendChild(exportLabel);
        exportLabel.innerText = "Export Source";

        const sourceSelect = document.createElement("select");
        exportSourceContainer.appendChild(sourceSelect);
        sourceSelect.innerHTML = `
            <option value="active">Active cookies</option>
            <option value="jar">Jarred cookies</option>
        `;

        const checkboxLabelContainer = document.createElement("div");
        checkboxLabelContainer.classList.add("labeled-input");
        exportForm.appendChild(checkboxLabelContainer);

        const encryptLabel = document.createElement("label");
        checkboxLabelContainer.appendChild(encryptLabel);

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
        exportButton.addEventListener("click", () => console.log("export"));

        exportButton.addEventListener("click", async () =>
            this.handleExport(sourceSelect.value)
        );

        return exportForm;
    }

    async getHtmlElement() {
        return this.shelfTabElement;
    }

    async show() {
        this.shelfTabElement.style.display = "flex";
    }

    async hide() {
        this.shelfTabElement.style.display = "none";
    }
}
