const cookieTable = document.getElementById("cookieTable");
const loadingIndicator = document.getElementById("loadingIndicator");
const activeBtn = document.getElementById("active-btn");
const jarBtn = document.getElementById("jar-btn");

activeBtn.addEventListener("click", () => displayActiveTab());
jarBtn.addEventListener("click", () => displayJarTab());

function showLoadingIndicator() {
    cookieTable.classList.add("hidden");
    loadingIndicator.classList.remove("hidden");
}

function removeLoadingIndicator() {
    cookieTable.classList.remove("hidden");
    loadingIndicator.classList.add("hidden");
}

window.onload = async function () {
    const chromeCookies = await chromeCookieStore.getChromeCookies();

    await ensureCookieJarStorageCreated();
    await populateCookieTable(chromeCookies);
};

async function setCookieTableRowData(tableRow, cookie) {
    const truncatedName = truncateString(cookie.name, 40);
    const truncatedVal = truncateString(cookie.value, 15);
    const truncatedUrl = truncateString(cookie.details.url, 20);
    tableRow.innerHTML = `<td>${truncatedName}</td> 
                <td>${truncatedVal}</td>
                <td>${truncatedUrl}</td>
                <td>${cookie.secure}</td> 
                <td>${cookie.session}</td> 
                <td>${cookie.storeId}</td>`;

    storeCell = document.createElement("td");
    storeBtn = document.createElement("button");
    storeBtn.innerHTML = "Store";
    storeBtn.disabled = cookie.isStored;
    storeBtn.addEventListener("click", async () => {
        await cookie.store();
        await setCookieTableRowData(tableRow, cookie);
    });
    storeCell.appendChild(storeBtn);

    restoreCell = document.createElement("td");
    restoreBtn = document.createElement("button");
    restoreBtn.innerHTML = "Restore";
    restoreBtn.disabled = !cookie.isStored;
    restoreBtn.addEventListener("click", async () => {
        await cookie.restore();
        await setCookieTableRowData(tableRow, cookie);
    });
    restoreCell.appendChild(restoreBtn);

    // prepend adds element to beginning
    tableRow.prepend(restoreCell);
    tableRow.prepend(storeCell);
}

async function createCookieTableRow(cookie) {
    const cookieTableRowItem = document.createElement("tr");
    cookieTableRowItem.classList += "cookie-row";
    cookieTableRowItem.style.marginBottom = "10px";

    await setCookieTableRowData(cookieTableRowItem, cookie);

    return cookieTableRowItem;
}

async function populateCookieTable(cookies) {
    showLoadingIndicator();

    // turned cookies into a parameter
    // const cookies = await getCookies();
    const sortedCookies = cookies.sort((a, b) =>
        alphabeticalComparison(a.name, b.name)
    );
    console.log(`${sortedCookies.length} sorted cookies being displayed`);

    removeLoadingIndicator();

    for (const cookie of sortedCookies) {
        const cookieTableRowItem = await createCookieTableRow(cookie);
        cookieTable.appendChild(cookieTableRowItem);
    }
}

// Edit cookie view
const editNameInput = document.getElementById("edit-name-input");
const editDomainInput = document.getElementById("edit-domain-input");
const editValueInput = document.getElementById("edit-value-input");
const editExpirationDateInput = document.getElementById(
    "edit-expirationDate-input"
);
const editHostOnlyInput = document.getElementById("edit-hostOnly-input");
const editHttpOnlyInput = document.getElementById("edit-httpOnly-input");
const editPathInput = document.getElementById("edit-path-input");
const editSameSiteInput = document.getElementById("edit-sameSite-input");
const editSecureInput = document.getElementById("edit-secure-input");
const editSessionInput = document.getElementById("edit-session-input");
const editStoreIdInput = document.getElementById("edit-storeId-input");

function populateEditCookieView(cookieBeingEdited) {
    cookieBeingEdited = {
        name: "test name",
        domain: ".lol.lol.com",
        value: "testlkjadsflkjlaksdf",
        expirationDate: "4/20",
        hostOnly: "true",
        httpOnly: "true",
        path: "/",
        sameSite: "false",
        secure: "true",
        session: "youknowthespot",
        storeId: 0,
    };
    editNameInput.value = cookieBeingEdited.name;
    editDomainInput.value = cookieBeingEdited.domain;
    editValueInput.value = cookieBeingEdited.value;
    editExpirationDateInput.value = cookieBeingEdited.expirationDate;
    editHostOnlyInput.value = cookieBeingEdited.expirationDate;
    editHttpOnlyInput.value = cookieBeingEdited.httpOnly;
    editPathInput.value = cookieBeingEdited.path;
    editSameSiteInput.value = cookieBeingEdited.sameSite;
    editSecureInput.value = cookieBeingEdited.secure;
    editSessionInput.value = cookieBeingEdited.session;
    editStoreIdInput.value = cookieBeingEdited.storeId;
}

async function saveEditedCookie(cookieBeingEdited) {
    cookieBeingEdited.name = editNameInput.value;
    cookieBeingEdited.domain = editDomainInput.value;
    cookieBeingEdited.value = editValueInput.value;
    cookieBeingEdited.expirationDate = editExpirationDateInput.value;
    cookieBeingEdited.hostOnly = editHostOnlyInput.value;
    cookieBeingEdited.httpOnly = editHttpOnlyInput.value;
    cookieBeingEdited.path = editPathInput.value;
    cookieBeingEdited.sameSite = editSameSiteInput.value;
    cookieBeingEdited.secure = editSecureInput.value;
    cookieBeingEdited.session = editSessionInput.value;
    cookieBeingEdited.storeId = editStoreIdInput.value;
    // TODO: save to local/jar store
}

async function displayActiveTab() {
    const chromeCookies = await chromeCookieStore.getChromeCookies();
    clearCookieTable();
    populateCookieTable(chromeCookies);
}

async function displayJarTab() {
    const jarCookies = await cookieJar.getJarCookies();
    clearCookieTable();
    populateCookieTable(jarCookies);
}

function clearCookieTable() {
    let i, displayedCookies;

    displayedCookies = document.getElementsByClassName("cookie-row");
    for (i = displayedCookies.length - 1; i >= 0; i--) {
        displayedCookies[i].remove();
    }
    console.log("page should be cleared!");
}

const editView = document.getElementById("test-edit-view");

async function switchToEditView(cookieBeingEdited) {
    cookieTable.classList.add("hidden");
    populateEditCookieView(cookieBeingEdited);
    editView.classList.remove("hidden");
}

async function switchToTableView() {
    editView.classList.add("hidden");
    cookieTable.classList.remove("hidden");
}

const testEditButton = document.getElementById("test-edit-button");
testEditButton.addEventListener("click", () => switchToEditView(null));

const closeEditView = document.getElementById("close-edit-view");
closeEditView.addEventListener("click", switchToTableView);
