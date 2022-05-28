class CookieRow extends UiElement {
    constructor(jarCookie, cookiesManager, bulkCookieSelector, isStored) {
        super();
        this.cookie = jarCookie;
        this.isOpen = false;
        this.cookiesManager = cookiesManager;
        this.bulkCookieSelector = bulkCookieSelector;
        this.isStored = isStored;
        this.createHtmlElement();
        this.previousCookieDetails = {
            name: jarCookie.name,
            storeId: jarCookie.storeId,
            url: jarCookie.url,
        };
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
                console.log(this.cookie);
                this.cookiesManager.storeCookie(this.cookie);
                this.deleteCookieRow();
                console.log(this.cookie);
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
        const cookieRowContent = new CookieRowContent(this.cookie, this.cookiesManager);
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
        console.log(this.cookieRowElement)
        this.cookieRowElement.remove();
    }
}

class CookieRowContent extends UiElement {
    constructor(jarCookie, cookiesManager) {
        super();
        this.cookie = jarCookie;
        this.cookiesManager = cookiesManager;
        this.createHtmlElement();
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
        nameInput.value = "test value"
        console.log(nameInput.value);
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
        expirationInput.value = this.cookie.expiration;
        cookieEditForm.appendChild(expirationInput);

        const sameSiteLabel = document.createElement("label");
        sameSiteLabel.innerText = "SameSite";
        cookieEditForm.appendChild(sameSiteLabel);

        const sameSiteSelect = document.createElement("select");
        cookieEditForm.appendChild(sameSiteSelect);
        sameSiteSelect.name = "same-site";
        sameSiteSelect.innerHTML = `
            <select id="sameSite">
                <option value="No Restriction">
                    No Restriction
                </option>
                <option value="Lax">Lax</option>
                <option value="Strict">Strict</option>
            </select>
            `;


        sameSiteSelect.value = this.cookie.sameSite;

        cookieEditForm.innerHTML += `
            <div class="cookie-bools">
                <div>
                    <label>HostOnly</label>
                    <input type="checkbox" id="hostOnly" ${
                        this.cookie.hostOnly ? "checked" : ""
                    } />
                </div>
                <div>
                    <label>Session</label>
                    <input type="checkbox" id="session" ${
                        this.cookie.session ? "checked" : ""
                    }
                     />
                </div>
                <div>
                    <label>Secure</label>
                    <input type="checkbox" id="secure" ${
                        this.cookie.secure ? "checked" : ""
                    } />
                </div>
                <div>
                    <label>HttpOnly</label>
                    <input type="checkbox" id="httpOnly" ${
                        this.cookie.httpOnly ? "checked" : ""
                    } />
                </div>
            </div>`;

        const formActionsContainer = document.createElement("div");
        cookieEditForm.appendChild(formActionsContainer);
        formActionsContainer.classList.add("form-actions");

        const cancelButton = document.createElement("button");
        formActionsContainer.appendChild(cancelButton);
        cancelButton.innerText = "Cancel";
        cancelButton.addEventListener("click", () => console.log("cancel"));

        const saveButton = document.createElement("button");
        saveButton.type = 'button';
        formActionsContainer.appendChild(saveButton);
        saveButton.innerText = "Save";
        saveButton.addEventListener("click", () => {
            console.log("save");
            this.cookiesManager.upsertCookie(this.cookie);
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

    readCookieRowContent() {
        this.cookieRowContent
    }
}