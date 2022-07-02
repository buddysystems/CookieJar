import { JarCookie } from "../cookies/jar-cookie.js";

export function createCookieForm(cookie, handleCancel, handleSave) {
    const cookieEditForm = document.createElement("form");
    cookieEditForm.classList.add("cookie-form");

    // Inside the edit form
    const nameLabel = document.createElement("label");
    nameLabel.innerText = "Name";
    cookieEditForm.appendChild(nameLabel);

    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.value = cookie.name;
    cookieEditForm.appendChild(nameInput);

    const valueLabel = document.createElement("label");
    valueLabel.innerText = "Value";
    cookieEditForm.appendChild(valueLabel);

    const valueInput = document.createElement("textarea");
    valueInput.cols = "50";
    valueInput.rows = "5";
    valueInput.innerText = cookie.value;
    cookieEditForm.appendChild(valueInput);

    const domainLabel = document.createElement("label");
    domainLabel.innerText = "Domain";
    cookieEditForm.appendChild(domainLabel);

    const domainInput = document.createElement("input");
    domainInput.type = "text";
    domainInput.value = cookie.domain;
    domainInput.disabled = cookie.hostOnly;
    cookieEditForm.appendChild(domainInput);

    const pathLabel = document.createElement("label");
    pathLabel.innerText = "Path";
    cookieEditForm.appendChild(pathLabel);

    const pathInput = document.createElement("input");
    pathInput.type = "text";
    pathInput.value = cookie.path;
    cookieEditForm.appendChild(pathInput);

    const expirationLabel = document.createElement("label");
    expirationLabel.innerText = "Expiration";
    cookieEditForm.appendChild(expirationLabel);

    const expirationInput = document.createElement("input");
    expirationInput.type = "text";
    expirationInput.value = cookie.expirationDate
        ? new Date(cookie.expirationDate * 1000).toUTCString()
        : "";
    expirationInput.disabled = cookie.session;
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

    sameSiteSelect.value = cookie.sameSite;

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
    hostOnlyInput.checked = cookie.hostOnly;
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
    sessionInput.checked = cookie.session;
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
    secureInput.checked = cookie.secure;
    secureDiv.appendChild(secureInput);

    const httpOnlyDiv = document.createElement("div");
    cookieBooleans.appendChild(httpOnlyDiv);

    const httpOnlyLabel = document.createElement("label");
    httpOnlyLabel.innerText = "HttpOnly";
    httpOnlyDiv.appendChild(httpOnlyLabel);

    const httpOnlyInput = document.createElement("input");
    httpOnlyInput.type = "checkbox";
    httpOnlyInput.checked = cookie.httpOnly;
    httpOnlyDiv.appendChild(httpOnlyInput);

    const formActionsContainer = document.createElement("div");
    cookieEditForm.appendChild(formActionsContainer);
    formActionsContainer.classList.add("form-actions");

    const cancelButton = document.createElement("button");
    cancelButton.type = "button";
    formActionsContainer.appendChild(cancelButton);
    cancelButton.innerText = "Cancel";
    cancelButton.addEventListener("click", handleCancel);

    const saveButton = document.createElement("button");
    saveButton.type = "button";
    formActionsContainer.appendChild(saveButton);
    saveButton.innerText = "Save";
    saveButton.addEventListener("click", async () => {
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

                    expirationValue = Math.floor(parsedDate.getTime() / 1000);
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
                storeId: cookie.storeId,
                expirationDate: expirationValue,
                hostOnly: hostOnlyInput.checked,
                httpOnly: httpOnlyInput.checked,
                path: pathInput.value,
                sameSite: sameSiteSelect.value,
                secure: secureInput.checked,
                session: sessionInput.checked,
                value: valueInput.value,
            },
            cookie.isStored,
            cookie.isSelected
        );
        if (hostOnlyInput.checked) updatedCookie.domain = null;
        if (sessionInput.checked) updatedCookie.expirationDate = null;

        await handleSave(updatedCookie);
    });

    return cookieEditForm;
}
