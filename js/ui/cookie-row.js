class CookieRow extends UiElement {
    constructor(jarCookie, cookiesManager) {
        super();
        this.cookie = jarCookie;
        this.createHtmlElement();
        this.isOpen = false;
        this.cookiesManager = cookiesManager
    }

    createHtmlElement() {
        // Cookie row
        const cookieRow = document.createElement("div");
        cookieRow.classList.add("cookie-row");

        // Accordian
        const accordianHeader = document.createElement("div");
        cookieRow.appendChild(accordianHeader);

        accordianHeader.classList.add("accordian-header");

        const rowCheckbox = document.createElement("input");
        accordianHeader.appendChild(rowCheckbox);
        rowCheckbox.type = "checkbox";
        rowCheckbox.classList.add("cookie-row-selector");
        // TODO: checkbox behavior

        const caretImg = document.createElement("img");
        accordianHeader.appendChild(caretImg);
        caretImg.src = "/assets/caret-right.png";
        caretImg.classList.add("caret");

        const accordianInfoContainer = document.createElement("div");
        accordianHeader.appendChild(accordianInfoContainer);

        const mainCookieInfo = document.createElement("div");
        accordianInfoContainer.appendChild(mainCookieInfo);
        mainCookieInfo.classList.add("main-cookie-info");

        const cookieName = document.createElement("span");
        mainCookieInfo.appendChild(cookieName);
        cookieName.classList.add("cookie-name");
        cookieName.innerHTML = truncateString(this.cookie.name, 40);

        const cookieDomain = document.createElement("span");
        mainCookieInfo.appendChild(cookieDomain);
        cookieDomain.classList.add("cookie-domain");
        cookieDomain.innerText = `(${this.cookie.domain})`;

        const secondaryCookieInfo = document.createElement("div");
        accordianInfoContainer.appendChild(secondaryCookieInfo);
        secondaryCookieInfo.classList.add("secondary-cookie-info");
        secondaryCookieInfo.innerHTML = truncateString(this.cookie.value, 50);

        const cookieActions = document.createElement("div");
        accordianHeader.appendChild(cookieActions);
        cookieActions.classList.add("cookie-actions");

        const jarIconImg = document.createElement("img");
        cookieActions.appendChild(jarIconImg);
        jarIconImg.classList.add("action-icon");
        // Not sure if 'action-icon' is redundant - leaving it for now assuming it has significance somewhere
        jarIconImg.classList.add("jar-btn")
        jarIconImg.src = "/assets/icons/action-bar/jar-icon.png";
        jarIconImg.addEventListener("click", () => this.cookiesManager.storeCookie(this.cookie));

        const trashIconImg = document.createElement("img");
        cookieActions.appendChild(trashIconImg);
        trashIconImg.classList.add("action-icon");
        // Not sure if 'action-icon' is redundant - leaving it for now assuming it has significance somewhere
        trashIconImg.classList.add("trash-btn")
        trashIconImg.src = "/assets/icons/action-bar/trash-icon.png";
        trashIconImg.addEventListener("click", () => console.log('TODO add trash functionality'));

        // Cookie row content
        const cookieRowContent = new CookieRowContent(this.cookie);
        cookieRow.appendChild(cookieRowContent.getHtmlElement());
        this.cookieRowContent = cookieRowContent;
        accordianHeader.addEventListener("click", () => this.toggleForm());

        this.cookieRowElement = cookieRow;
    }

    async getHtmlElement() {
        return new Promise((resolve, reject) => resolve(this.cookieRowElement));
    }

    toggleForm() {
        this.isOpen = !this.isOpen;
        this.cookieRowContent.toggleForm(this.isOpen);
    }
}

class CookieRowContent extends UiElement {
    constructor(jarCookie) {
        super();
        this.cookie = jarCookie;
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

        cookieEditForm.innerHTML = `
            <label>Name</label>
            <input
                type="text"
                name=""
                id=""
                value="${this.cookie.name}"
            />
            <label>Value</label>
            <textarea cols="50" rows="5"
            >${this.cookie.value}</textarea>
            <label>Domain</label>
            <input
                type="text"
                value="${this.cookie.domain}"
            />
            <label>Path</label>
            <input type="text" value="${this.cookie.path}" />
            <label>Expiration</label>
            <input
                type="datetime"
                value="${this.cookie.expiration}"
            />
            <label>SameSite</label>
            `;
        const sameSiteSelect = document.createElement("select");
        cookieEditForm.appendChild(sameSiteSelect);
        sameSiteSelect.name = "same-site";
        sameSiteSelect.innerHTML = `
             <select name="same-site">
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
                    <input type="checkbox" ${
                        this.cookie.hostOnly ? "checked" : ""
                    } />
                </div>
                <div>
                    <label>Session</label>
                    <input type="checkbox" ${
                        this.cookie.session ? "checked" : ""
                    }
                     />
                </div>
                <div>
                    <label>Secure</label>
                    <input type="checkbox" ${
                        this.cookie.secure ? "checked" : ""
                    } />
                </div>
                <div>
                    <label>HttpOnly</label>
                    <input type="checkbox" ${
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
        formActionsContainer.appendChild(saveButton);
        saveButton.innerText = "Save";
        saveButton.addEventListener("click", () => console.log("save"));

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
}