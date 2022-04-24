const cookieTable = document.getElementById("cookieTable");
const loadingIndicator = document.getElementById("loadingIndicator");
const activeBtn = document.getElementById("active-btn");
const jarBtn = document.getElementById("jar-btn");

activeBtn.addEventListener("click", () => clearCookieTable());
jarBtn.addEventListener("click", () => clearCookieTable());

function showLoadingIndicator() {
    cookieTable.classList.add("hidden");
    loadingIndicator.classList.remove("hidden");
}

function removeLoadingIndicator() {
    cookieTable.classList.remove("hidden");
    loadingIndicator.classList.add("hidden");
}

window.onload = async function() {
    await ensureCookieJarStorageCreated();
    await populateCookieTable();
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
    storeBtn.addEventListener("click", async() => {
        await cookie.store();
        await setCookieTableRowData(tableRow, cookie);
    });
    storeCell.appendChild(storeBtn);

    restoreCell = document.createElement("td");
    restoreBtn = document.createElement("button");
    restoreBtn.innerHTML = "Restore";
    restoreBtn.disabled = !cookie.isStored;
    restoreBtn.addEventListener("click", async() => {
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

async function populateCookieTable() {
    showLoadingIndicator();

    const cookies = await getCookies();
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

function clearCookieTable() {
    let i, displayedCookies;

    displayedCookies = document.getElementsByClassName("cookie-row");
    for (i = displayedCookies.length - 1; i >= 0; i--) {
        displayedCookies[i].remove();
    }
    console.log('page should be cleared!')
}

const editView = document.getElementById("test-edit-view");

async function switchToEditView(cookieBeingEdited) {
    console.log(`Cookie being edited: ${cookieBeingEdited}`);
    cookieTable.classList.add("hidden");
    editView.classList.remove("hidden");
}

async function switchToTableView() {
    editView.classList.add("hidden");
    cookieTable.classList.remove("hidden");
}

const testEditButton = document.getElementById("test-edit-button");
testEditButton.addEventListener(
    "click",
    async() => await switchToEditView(null)
);

const closeEditView = document.getElementById("close-edit-view");
closeEditView.addEventListener("click", switchToTableView);