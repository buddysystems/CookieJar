class CookieRow extends UiElement {
    /**
     * @param {*} refreshCookieRow Callback to be invoked once the cookie row UI needs to be updated
     */
    constructor(
        jarCookie,
        cookiesManager,
        bulkCookieSelector,
        refreshCookieRow
    ) {
        super();
        this.cookie = jarCookie;
        this.isOpen = false;
        this.cookiesManager = cookiesManager;
        this.bulkCookieSelector = bulkCookieSelector;
        this.previousCookieDetails = {
            name: jarCookie.name,
            storeId: jarCookie.storeId,
            url: jarCookie.url,
        };
        this.createHtmlElement();
        this.refreshCookieRow = refreshCookieRow;
    }

    createHtmlElement() {
        // Cookie row
        const cookieRow = document.createElement("div");
        cookieRow.classList.add("cookie-row");

        // Accordian
        const accordianHeader = document.createElement("div");
        cookieRow.appendChild(accordianHeader);
        accordianHeader.classList.add("accordian-header");
        accordianHeader.title = this.cookie.value;
        accordianHeader.addEventListener("click", () => this.toggleForm());

        this.rowCheckbox = document.createElement("input");
        accordianHeader.appendChild(this.rowCheckbox);
        this.rowCheckbox.type = "checkbox";
        this.rowCheckbox.classList.add("cookie-row-selector");
        this.rowCheckbox.title = "Select for bulk action";
        this.rowCheckbox.addEventListener("click", (e) => {
            if (e.currentTarget.checked) {
                this.bulkCookieSelector.selectCookie(this.cookie);
            } else {
                this.bulkCookieSelector.deselectCookie(this.cookie);
            }

            // This stops the click event from toggling the edit form
            e.stopPropagation();
        });

        this.caretImg = document.createElement("img");
        accordianHeader.appendChild(this.caretImg);
        this.caretImg.src = "/assets/caret-right.png";
        this.caretImg.classList.add("caret");

        const accordianInfoContainer = document.createElement("div");
        accordianHeader.appendChild(accordianInfoContainer);

        const mainCookieInfo = document.createElement("div");
        accordianInfoContainer.appendChild(mainCookieInfo);
        mainCookieInfo.classList.add("main-cookie-info");

        const cookieName = document.createElement("span");
        mainCookieInfo.appendChild(cookieName);
        cookieName.classList.add("cookie-name");
        cookieName.innerHTML = truncateString(this.cookie.name, 35);

        const cookieDomain = document.createElement("span");
        mainCookieInfo.appendChild(cookieDomain);
        cookieDomain.classList.add("cookie-domain");
        cookieDomain.innerText = `(${this.cookie.domain})`;

        const secondaryCookieInfo = document.createElement("div");
        accordianInfoContainer.appendChild(secondaryCookieInfo);
        secondaryCookieInfo.classList.add("secondary-cookie-info");
        secondaryCookieInfo.innerHTML = truncateString(this.cookie.value, 45);

        const cookieActions = document.createElement("div");
        accordianHeader.appendChild(cookieActions);
        cookieActions.classList.add("cookie-actions");

        if (!this.cookie.isStored) {
            const jarIconImg = document.createElement("img");
            cookieActions.appendChild(jarIconImg);
            // The action-icon class gives shared styling to icons, such as changing the cursor on hover (see css/cookie-row.css)
            jarIconImg.classList.add("action-icon");
            jarIconImg.classList.add("jar-btn");
            jarIconImg.src = "/assets/icons/action-bar/jar-icon.png";
            jarIconImg.title = "Jar this cookie";
            jarIconImg.addEventListener("click", () => {
                this.cookiesManager.storeCookie(this.cookie);
                this.deleteCookieRow();
            });
        } else {
            const unjarIconImg = document.createElement("img");
            cookieActions.appendChild(unjarIconImg);
            unjarIconImg.classList.add("action-icon");
            unjarIconImg.classList.add("unjar-btn");
            unjarIconImg.src = "/assets/icons/action-bar/unjar-png.png";
            unjarIconImg.title = "Unjar this cookie";
            unjarIconImg.addEventListener("click", () => {
                this.cookiesManager.restoreCookie(this.cookie);
                this.deleteCookieRow();
            });
        }

        const trashIconImg = document.createElement("img");
        cookieActions.appendChild(trashIconImg);
        trashIconImg.classList.add("action-icon");
        trashIconImg.classList.add("trash-btn");
        trashIconImg.src = "/assets/icons/action-bar/trash-icon.png";
        trashIconImg.title = "Delete this cookie";
        trashIconImg.addEventListener("click", () => {
            this.cookiesManager.deleteCookie(this.cookie);
            this.deleteCookieRow();
        });

        // Cookie row content
        const cookieRowContent = new CookieRowContent(
            this.cookie,
            this.cookiesManager,
            this
        );
        cookieRow.appendChild(cookieRowContent.getHtmlElement());
        this.cookieRowContent = cookieRowContent;

        this.cookieRowElement = cookieRow;
    }

    async checkRowCheckbox() {
        return new Promise((resolve, reject) => {
            if (!this.rowCheckbox.checked) {
                this.rowCheckbox.checked = true;
            }
            resolve();
        });
    }

    async uncheckRowCheckbox() {
        return new Promise((resolve, reject) => {
            if (this.rowCheckbox.checked) {
                this.rowCheckbox.checked = false;
            }
            resolve();
        });
    }

    async getHtmlElement() {
        return new Promise((resolve, reject) => resolve(this.cookieRowElement));
    }

    toggleForm() {
        this.isOpen = !this.isOpen;
        this.cookieRowContent.toggleForm(this.isOpen);
        if (this.isOpen) {
            this.caretImg.src = "/assets/caret-down.png";
        } else {
            this.caretImg.src = "/assets/caret-right.png";
        }
    }

    deleteCookieRow() {
        this.cookieRowElement.remove();
    }
}

class CookieRowContent extends UiElement {
    constructor(jarCookie, cookiesManager, cookieRowElement) {
        super();
        this.cookie = jarCookie;
        this.cookiesManager = cookiesManager;
        this.createHtmlElement();
        this.cookieRowElement = cookieRowElement;
    }

    createHtmlElement() {
        const cookieRowContent = document.createElement("div");
        cookieRowContent.classList.add("cookie-row-content");

        const cookieInfoContainer = document.createElement("div");
        cookieRowContent.appendChild(cookieInfoContainer);
        cookieInfoContainer.classList.add("cookie-info");
        cookieInfoContainer.style.display = "none";
        this.cookieInfoContainer = cookieInfoContainer;

        const cookieEditForm = document.createElement("form");
        cookieInfoContainer.appendChild(cookieEditForm);
        cookieEditForm.classList.add("cookie-edit-form");

        // Inside the edit form
        const nameLabel = document.createElement("label");
        nameLabel.innerText = "Name";
        cookieEditForm.appendChild(nameLabel);

        const nameInput = document.createElement("input");
        nameInput.type = "text";
        nameInput.value = this.cookie.name;
        cookieEditForm.appendChild(nameInput);

        const valueLabel = document.createElement("label");
        valueLabel.innerText = "Value";
        cookieEditForm.appendChild(valueLabel);

        const valueInput = document.createElement("textarea");
        valueInput.cols = "50";
        valueInput.rows = "5";
        valueInput.innerText = this.cookie.value;
        cookieEditForm.appendChild(valueInput);

        const domainLabel = document.createElement("label");
        domainLabel.innerText = "Domain";
        cookieEditForm.appendChild(domainLabel);

        const domainInput = document.createElement("input");
        domainInput.type = "text";
        domainInput.value = this.cookie.domain;
        domainInput.disabled = this.cookie.hostOnly;
        cookieEditForm.appendChild(domainInput);

        const pathLabel = document.createElement("label");
        pathLabel.innerText = "Path";
        cookieEditForm.appendChild(pathLabel);

        const pathInput = document.createElement("input");
        pathInput.type = "text";
        pathInput.value = this.cookie.path;
        cookieEditForm.appendChild(pathInput);

        const expirationLabel = document.createElement("label");
        expirationLabel.innerText = "Expiration";
        cookieEditForm.appendChild(expirationLabel);

        const expirationInput = document.createElement("input");
        expirationInput.type = "text";
        expirationInput.value = this.cookie.expirationDate
            ? new Date(this.cookie.expirationDate * 1000).toUTCString()
            : "";
        expirationInput.disabled = this.cookie.session;
        cookieEditForm.appendChild(expirationInput);

        const sameSiteLabel = document.createElement("label");
        sameSiteLabel.innerText = "SameSite";
        cookieEditForm.appendChild(sameSiteLabel);

        const sameSiteSelect = document.createElement("select");
        cookieEditForm.appendChild(sameSiteSelect);
        sameSiteSelect.name = "same-site";

        const noRestrictionOption = document.createElement("option");
        noRestrictionOption.value = "no_restriction";
        noRestrictionOption.innerText = "No Restriction";
        sameSiteSelect.appendChild(noRestrictionOption);

        const laxOption = document.createElement("option");
        laxOption.value = "lax";
        laxOption.innerText = "Lax";
        sameSiteSelect.appendChild(laxOption);

        const strictOption = document.createElement("option");
        strictOption.value = "strict";
        strictOption.innerText = "Strict";
        sameSiteSelect.appendChild(strictOption);

        const unspecifiedOption = document.createElement("option");
        unspecifiedOption.value = "unspecified";
        unspecifiedOption.innerText = "Unspecified";
        sameSiteSelect.appendChild(unspecifiedOption);

        sameSiteSelect.value = this.cookie.sameSite;

        // cookie bools
        const cookieBooleans = document.createElement("div");
        cookieBooleans.classList.add("cookie-bools");
        cookieEditForm.appendChild(cookieBooleans);

        const hostOnlyDiv = document.createElement("div");
        cookieBooleans.appendChild(hostOnlyDiv);

        const hostOnlyLabel = document.createElement("label");
        hostOnlyLabel.innerText = "HostOnly";
        hostOnlyDiv.appendChild(hostOnlyLabel);

        const hostOnlyInput = document.createElement("input");
        hostOnlyInput.type = "checkbox";
        hostOnlyInput.checked = this.cookie.hostOnly;
        hostOnlyDiv.appendChild(hostOnlyInput);

        // In order to set hostOnly to true, we need to pass in a null domain. Therefore, we need to disable the domain input
        hostOnlyInput.addEventListener("change", (e) => {
            domainInput.disabled = e.currentTarget.checked;
        });

        const sessionDiv = document.createElement("div");
        cookieBooleans.appendChild(sessionDiv);

        const sessionLabel = document.createElement("label");
        sessionLabel.innerText = "Session";
        sessionDiv.appendChild(sessionLabel);

        const sessionInput = document.createElement("input");
        sessionInput.type = "checkbox";
        sessionInput.checked = this.cookie.session;
        sessionDiv.appendChild(sessionInput);
        // In order to set session to true, we need to pass in a null expiration date
        sessionInput.addEventListener("change", (e) => {
            expirationInput.disabled = e.currentTarget.checked;
        });

        const secureDiv = document.createElement("div");
        cookieBooleans.appendChild(secureDiv);

        const secureLabel = document.createElement("label");
        secureLabel.innerText = "Secure";
        secureDiv.appendChild(secureLabel);

        const secureInput = document.createElement("input");
        secureInput.type = "checkbox";
        secureInput.checked = this.cookie.secure;
        secureDiv.appendChild(secureInput);

        const httpOnlyDiv = document.createElement("div");
        cookieBooleans.appendChild(httpOnlyDiv);

        const httpOnlyLabel = document.createElement("label");
        httpOnlyLabel.innerText = "HttpOnly";
        httpOnlyDiv.appendChild(httpOnlyLabel);

        const httpOnlyInput = document.createElement("input");
        httpOnlyInput.type = "checkbox";
        httpOnlyInput.checked = this.cookie.httpOnly;
        httpOnlyDiv.appendChild(httpOnlyInput);

        const formActionsContainer = document.createElement("div");
        cookieEditForm.appendChild(formActionsContainer);
        formActionsContainer.classList.add("form-actions");

        const cancelButton = document.createElement("button");
        cancelButton.type = "button";
        formActionsContainer.appendChild(cancelButton);
        cancelButton.innerText = "Cancel";
        cancelButton.addEventListener("click", () => {
            // TODO: reset form values to original cookie values
            this.cookieRowElement.toggleForm();
        });

        const saveButton = document.createElement("button");
        saveButton.type = "button";
        formActionsContainer.appendChild(saveButton);
        saveButton.innerText = "Save";
        saveButton.addEventListener("click", async () => {
            // get previous cookie details from this.cookie
            const prevDetails = this.snapshotDetails();

            let expirationValue = null;
            if (expirationInput?.value != "undefined") {
                try {
                    const parsedNumber = parseInt(expirationInput.value);
                    if (!isNaN(parsedNumber)) {
                        expirationValue = parsedNumber;
                    } else {
                        let parsedDate = new Date(expirationInput.value);

                        if (isNaN(parsedDate))
                            throw new DOMException("Could not parse date");

                        expirationValue = Math.floor(
                            parsedDate.getTime() / 1000
                        );
                    }
                } catch (e) {
                    console.warn(e);
                    console.warn("Could not parse expiration date input.");
                }
            }
            const updatedCookie = new JarCookie(
                {
                    domain: domainInput.value,
                    name: nameInput.value,
                    storeId: this.cookie.storeId, // TODO: verify we don't need edit functionality for this
                    expirationDate: expirationValue,
                    hostOnly: hostOnlyInput.checked,
                    httpOnly: httpOnlyInput.checked,
                    path: pathInput.value,
                    sameSite: sameSiteSelect.value,
                    secure: secureInput.checked,
                    session: sessionInput.checked,
                    value: valueInput.value,
                },
                this.cookie.isStored,
                this.cookie.isSelected
            );
            if (hostOnlyInput.checked) updatedCookie.domain = null;
            if (sessionInput.checked) updatedCookie.expirationDate = null;

            await this.cookiesManager.updateCookie(prevDetails, updatedCookie);
            await this.cookieRowElement.refreshCookieRow();
        });

        this.cookieRowContent = cookieRowContent;
    }

    getHtmlElement() {
        return this.cookieRowContent;
    }

    toggleForm(isVisible) {
        if (isVisible) {
            this.cookieInfoContainer.style.display = "block";
        } else {
            this.cookieInfoContainer.style.display = "none";
        }
    }

    snapshotDetails() {
        return this.cookie.details;
    }
}
