import { truncateString } from "../helpers/string-util.js";
import { UiElement } from "./ui-element.js";
import { createRuleForm } from "../helpers/ui-creators.js";
import { Rule } from "../rules/rule.js";
import { formatDateShort } from "../helpers/date-util.js";

export class RuleRow extends UiElement {
    /**
     * @param {Rule} rule
     */
    constructor(rule) {
        super();
        this.rule = rule;
        console.dir(rule);
        this.isOpen = false;
        this.createHtmlElement();
    }

    createHtmlElement() {
        // Cookie row
        const cookieRow = document.createElement("div");
        cookieRow.classList.add("cookie-row");

        // Accordian
        const accordianHeader = document.createElement("div");
        cookieRow.appendChild(accordianHeader);
        accordianHeader.classList.add("accordian-header");
        accordianHeader.classList.add("rule");
        accordianHeader.title = this.rule.name;
        accordianHeader.addEventListener("click", () => this.toggleForm());

        this.rowCheckbox = document.createElement("input");
        accordianHeader.appendChild(this.rowCheckbox);
        this.rowCheckbox.type = "checkbox";
        this.rowCheckbox.classList.add("cookie-row-selector");
        this.rowCheckbox.title = "Select for bulk action";
        this.rowCheckbox.addEventListener("click", (e) => {
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
        cookieName.innerHTML = truncateString(this.rule.name, 35);

        const cookieDomain = document.createElement("span");
        mainCookieInfo.appendChild(cookieDomain);
        cookieDomain.classList.add("cookie-domain");
        cookieDomain.innerText = `${this.rule.ruleset}`;

        const secondaryCookieInfo = document.createElement("div");
        accordianInfoContainer.appendChild(secondaryCookieInfo);
        secondaryCookieInfo.classList.add("secondary-cookie-info");
        secondaryCookieInfo.innerHTML = truncateString(
            this.rule.filterExpression,
            45
        );

        const dateContainer = document.createElement("div");
        accordianHeader.appendChild(dateContainer);
        dateContainer.classList.add("rule-date");
        const dateElem = document.createElement("span");
        dateContainer.appendChild(dateElem);
        dateElem.innerText = formatDateShort(this.rule.date);

        const cookieActions = document.createElement("div");
        accordianHeader.appendChild(cookieActions);
        cookieActions.classList.add("rule-actions");

        const trashIconContainer = document.createElement("div");
        cookieActions.appendChild(trashIconContainer);
        trashIconContainer.classList.add("action-button");
        trashIconContainer.innerHTML += `
                    <img
                        src="assets/img/trash-icon.png"
                        class="action-icon"
                        title="Delete this rule"
                    />
                    `;

        const exportIconContainer = document.createElement("div");
        cookieActions.appendChild(exportIconContainer);
        exportIconContainer.classList.add("action-button");
        exportIconContainer.innerHTML += `
                    <img
                        src="assets/img/rules-icon.svg"
                        class="action-icon"
                        title="See affected cookies"
                    />
                    `;

        // Cookie row content
        const ruleRowContent = new RuleRowContent(this.rule, this);
        cookieRow.appendChild(ruleRowContent.getHtmlElement());
        this.ruleRowContent = ruleRowContent;

        this.ruleRowElement = cookieRow;
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
        return new Promise((resolve, reject) => resolve(this.ruleRowElement));
    }

    toggleForm() {
        this.isOpen = !this.isOpen;
        this.ruleRowContent.toggleForm(this.isOpen);
        if (this.isOpen) {
            this.caretImg.src = "assets/img/caret-down.png";
        } else {
            this.caretImg.src = "assets/img/caret-right.png";
        }
    }

    deleteCookieRow() {
        this.ruleRowElement.remove();
    }
}

export class RuleRowContent extends UiElement {
    constructor(rule, ruleRow) {
        super();
        this.rule = rule;
        this.ruleRow = ruleRow;
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

        const cookieEditForm = createRuleForm(
            this.rule,
            () => handleCancelEditCookie(),
            () => this.handleSaveCookieEdit()
        );
        cookieInfoContainer.appendChild(cookieEditForm);

        this.cookieRowContent = cookieRowContent;
    }

    handleCancelEditCookie = async () => {
        // TODO: reset form values to original cookie values
        this.ruleRow.toggleForm();
    };

    handleSaveCookieEdit = async (updatedCookie) => {
        this.ruleRow.toggleForm();
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
