class CookieRow extends UiElement {
    constructor(jarCookie) {
        super();
        this.cookie = jarCookie;
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
        cookieName.innerText = this.cookie.name;

        const cookieDomain = document.createElement("span");
        mainCookieInfo.appendChild(cookieDomain);
        cookieDomain.classList.add("cookie-domain");
        cookieDomain.innerText = `(${this.cookie.domain})`;

        const secondaryCookieInfo = document.createElement("div");
        accordianInfoContainer.appendChild(secondaryCookieInfo);
        secondaryCookieInfo.classList.add("secondary-cookie-info");
        secondaryCookieInfo.innerText = this.cookie.value;

        const cookieActions = document.createElement("div");
        accordianHeader.appendChild(cookieActions);
        cookieActions.classList.add("cookie-actions");

        const jarIconImg = document.createElement("img");
        cookieActions.appendChild(jarIconImg);
        jarIconImg.classList.add("action-icon");
        jarIconImg.src = "/assets/icons/action-bar/jar-icon.png";

        const trashIconImg = document.createElement("img");
        cookieActions.appendChild(trashIconImg);
        trashIconImg.classList.add("action-icon");
        trashIconImg.src = "/assets/icons/action-bar/trash-icon.png";

        this.cookieRowElement = cookieRow;
    }

    getHtmlElement() {
        return this.cookieRowElement;
    }

    toggleForm() {}
}
