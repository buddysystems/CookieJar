import { truncateString } from "../helpers/string-util.js";
import { UiElement } from "./ui-element.js";
import { JarCookie } from "../cookies/jar-cookie.js";
import { createCookieForm } from "../helpers/ui-creators.js";

export class CookieRow extends UiElement {
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
        this.caretImg.src = "assets/img/caret-right.png";
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
            const jarIconContainer = document.createElement("div");
            cookieActions.appendChild(jarIconContainer);
            jarIconContainer.classList.add("action-button");
            jarIconContainer.innerHTML += `
                    <img
                        src="assets/img/jar-icon.png"
                        class="action-icon"
                        title="Jar this cookie"
                    />
                    `;
            jarIconContainer.addEventListener("click", () => {
                this.cookiesManager.storeCookie(this.cookie);
                this.deleteCookieRow();
            });
        } else {
            const unjarIconContainer = document.createElement("div");
            cookieActions.appendChild(unjarIconContainer);

            unjarIconContainer.classList.add("action-button");
            unjarIconContainer.innerHTML += `
                    <img
                        src="assets/img/unjar-png.png"
                        class="action-icon"
                        title="Un-jar this cookie"
                    />
                    `;
            unjarIconContainer.addEventListener("click", () => {
                this.cookiesManager.restoreCookie(this.cookie);
                this.deleteCookieRow();
            });
        }

        const trashIconContainer = document.createElement("div");
        cookieActions.appendChild(trashIconContainer);
        trashIconContainer.classList.add("action-button");
        trashIconContainer.innerHTML += `
                    <img
                        src="assets/img/trash-icon.png"
                        class="action-icon"
                        title="Delete this cookie"
                    />
                    `;
        trashIconContainer.addEventListener("click", () => {
            this.cookiesManager.deleteCookie(this.cookie);
            this.deleteCookieRow();
        });

        const exportIconContainer = document.createElement("div");
        cookieActions.appendChild(exportIconContainer);
        exportIconContainer.classList.add("action-button");
        exportIconContainer.innerHTML += `
                    <img
                        src="assets/img/export-icon.svg"
                        class="action-icon"
                        title="Export this cookie"
                    />
                    `;

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
            this.caretImg.src = "assets/img/caret-down.png";
        } else {
            this.caretImg.src = "assets/img/caret-right.png";
        }
    }

    deleteCookieRow() {
        this.cookieRowElement.remove();
    }
}

export class CookieRowContent extends UiElement {
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

        const cookieEditForm = createCookieForm(
            this.cookie,
            this.handleCancelEditCookie,
            this.handleSaveCookieEdit
        );
        cookieInfoContainer.appendChild(cookieEditForm);

        this.cookieRowContent = cookieRowContent;
    }

    handleCancelEditCookie = async () => {
        // TODO: reset form values to original cookie values
        this.cookieRowElement.toggleForm();
    };

    handleSaveCookieEdit = async (updatedCookie) => {
        // get previous cookie details from this.cookie
        const prevDetails = this.snapshotDetails();

        await this.cookiesManager.updateCookie(prevDetails, updatedCookie);
        await this.cookieRowElement.refreshCookieRow();
    };

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
