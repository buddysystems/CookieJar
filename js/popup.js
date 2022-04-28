const cookieTable = document.getElementById("cookieTable");
const loadingIndicator = document.getElementById("loadingIndicator");
const activeBtn = document.getElementById("active-btn");
const jarBtn = document.getElementById("jar-btn");
const deleteAllBtn = document.getElementById("delete-all-btn");
const jarAllBtn = document.getElementById("store-all-btn");
const unjarAllBtn = document.getElementById("unstore-all-btn");
const searchInput = document.getElementById("search-input");

activeBtn.addEventListener("click", () => displayActiveTab());
jarBtn.addEventListener("click", () => displayJarTab());
deleteAllBtn.addEventListener("click", () => searchFunction());
jarAllBtn.addEventListener("click", () => chromeCookieStore.storeAllCookies());
unjarAllBtn.addEventListener("click", () => cookieJar.restoreAllCookies());
searchInput.addEventListener("keyup", () => searchFunction());
function showLoadingIndicator() {
    cookieTable.classList.add("hidden");
    loadingIndicator.classList.remove("hidden");
}

function searchFunction() {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("search-input");
    filter = input.value.toUpperCase();
    table = document.getElementById("cookieTable");
    tr = table.getElementsByTagName("tr");

    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[2];
        if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            tr[i].style.display = "";
        } else {
            tr[i].style.display = "none";
        }
        }
    }
}

function removeLoadingIndicator() {
    cookieTable.classList.remove("hidden");
    loadingIndicator.classList.add("hidden");
}

window.onload = async function() {
    await ensureCookieJarStorageCreated();
    await displayActiveTab();
};

async function setCookieTableRowData(tableRow, cookie) {
    // Update table based on cookie fields
    const truncatedName = truncateString(cookie.name, 40);
    const truncatedVal = truncateString(cookie.value, 15);
    const truncatedUrl = truncateString(cookie.details.url, 20);
    tableRow.innerHTML = `<td>${truncatedName}</td> 
                <td>${truncatedVal}</td>
                <td>${truncatedUrl}</td>
                <td>${cookie.secure}</td> 
                <td>${cookie.sameSite}</td>`;

    // Dynamically give table select checkboxes
    const selectCell = document.createElement("td");
    const selectCheck = document.createElement("input");
    selectCheck.type = "checkbox";
    selectCheck.name = cookie.truncatedName;
    selectCheck.id = cookie.storeId;
    selectCheck.innerHTML = "Select";
    selectCheck.checked = cookie.isSelected;
    selectCheck.addEventListener("click", async() => {
        cookie.isSelected;
    });
    selectCell.appendChild(selectCheck);

    // Dynamically give table store button
    const storeCell = document.createElement("td");
    const storeBtn = document.createElement("button");
    storeBtn.innerHTML = "Store";
    storeBtn.disabled = cookie.isStored;
    storeBtn.addEventListener("click", async() => {
        await cookie.store();
        await setCookieTableRowData(tableRow, cookie);
    });
    storeCell.appendChild(storeBtn);

    // Dynamically give table unstore button
    const restoreCell = document.createElement("td");
    const restoreBtn = document.createElement("button");
    restoreBtn.innerHTML = "Restore";
    restoreBtn.disabled = !cookie.isStored;
    restoreBtn.addEventListener("click", async() => {
        await cookie.restore();
        await setCookieTableRowData(tableRow, cookie);
    });
    restoreCell.appendChild(restoreBtn);

    // Dynamically give table actions
    const actionCell = document.createElement("td");
    const jarCookieBtn = document.createElement("img");
    jarCookieBtn.src = "/assets/icons/action-bar/jar-icon.png";
    jarCookieBtn.style.height = "50px";
    actionCell.appendChild(jarCookieBtn);
    jarCookieBtn.addEventListener("click", async() => {
        await cookie.store();
        await setCookieTableRowData(tableRow, cookie);
    });

    const unjarCookieBtn = document.createElement("img");
    unjarCookieBtn.src = "/assets/icons/action-bar/unjar-png.png";
    unjarCookieBtn.style.height = "50px";
    actionCell.appendChild(unjarCookieBtn);
    unjarCookieBtn.addEventListener("click", async() => {
        await cookie.restore();
        await setCookieTableRowData(tableRow, cookie);
    });

    const editCookieBtn = document.createElement("button");
    editCookieBtn.innerHTML = "Test edit btn";
    editCookieBtn.addEventListener("click", async() => {
        await switchToEditView(cookie);
    });
    actionCell.appendChild(editCookieBtn);

    // Prepend adds element to beginning
    // tableRow.prepend(restoreCell);
    // tableRow.prepend(storeCell);
    tableRow.prepend(actionCell);
    tableRow.prepend(selectCell);
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

async function displayActiveTab() {
    resetActiveTab();
    const chromeCookies = await chromeCookieStore.getChromeCookies();
    clearCookieTable();
    populateCookieTable(chromeCookies);
    activeBtn.className += " active";
}

async function downloadCookiesAsJSON() {
    const chromeCookies = await chromeCookieStore.getChromeCookies();
    const list = []
    for (i=0; i<chromeCookies.length; i++) {
        const cookie = chromeCookies[i]
        const dict = {"name" : cookie.name,
        "domain": cookie.domain,
        "storeId" : cookie.storeId,
        "expirationDate " : cookie.expirationDate,
        "hostOnly " : cookie.hostOnly,
        "httpOnly " : cookie.httpOnly,
        "path " : cookie.path,
        "sameSite " : cookie.sameSite,
        "secure " : cookie.secure,
        "session " : cookie.session,
        "value " : cookie.value,
        "details " : {
            name: cookie.name,
            storeId: cookie.storeId,
            url: getCookieUrl(this),
        },
        "isStored " : cookie.isStored,
        "isSelected " : cookie.isSelected,
        }
        list.push(dict)
    }
    const blob = new Blob([JSON.stringify(list, null, 2)], {type : 'application/json'});
    var url = URL.createObjectURL(blob);
    chrome.downloads.download({
        url: url 
    });


}

async function displayJarTab() {
    resetActiveTab();
    const jarCookies = await cookieJar.getJarCookies();
    clearCookieTable();
    populateCookieTable(jarCookies);
    jarBtn.className += " active";
}

async function resetActiveTab() {
    activeBtn.className = "tablinks";
    jarBtn.className = "tablinks";
}

function clearCookieTable() {
    let i, displayedCookies;

    displayedCookies = document.getElementsByClassName("cookie-row");
    for (i = displayedCookies.length - 1; i >= 0; i--) {
        displayedCookies[i].remove();
    }
    console.log("page should be cleared!");
}

async function deleteAllCookies() {
    chromeCookieStore.removeAllCookies();
    cookieJar.removeAllCookies();
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

function castToBoolean(str) {
    return str === "true";
}

async function saveEditedCookie(cookieBeingEdited) {
    const previousCookieDetails = {
        name: cookieBeingEdited.name,
        storeId: cookieBeingEdited.storeId,
        url: cookieBeingEdited.details.url,
    };
    cookieBeingEdited.name = editNameInput.value;
    cookieBeingEdited.domain = editDomainInput.value;
    cookieBeingEdited.value = editValueInput.value;
    cookieBeingEdited.expirationDate = editExpirationDateInput.value;
    cookieBeingEdited.hostOnly = editHostOnlyInput.value;
    cookieBeingEdited.httpOnly = castToBoolean(editHttpOnlyInput.value);
    cookieBeingEdited.path = editPathInput.value;
    cookieBeingEdited.sameSite = editSameSiteInput.value;
    cookieBeingEdited.secure = castToBoolean(editSecureInput.value);
    cookieBeingEdited.session = castToBoolean(editSessionInput.value);
    cookieBeingEdited.storeId = editStoreIdInput.value;
    await cookieBeingEdited.updateCookie(previousCookieDetails);
}

const editView = document.getElementById("edit-view");

// Changes the view to allow the user to change information about the cookies
async function switchToEditView(cookieBeingEdited) {
    // Remove all event listeners
    let oldElement = document.getElementById("save-edited-cookie-btn");
    let saveEditedCookieBtn = oldElement.cloneNode(true);
    oldElement.parentNode.replaceChild(saveEditedCookieBtn, oldElement);

    cookieTable.classList.add("hidden");
    populateEditCookieView(cookieBeingEdited);
    saveEditedCookieBtn.addEventListener("click", async() =>
        saveEditedCookie(cookieBeingEdited)
    );
    editView.classList.remove("hidden");
}

// Switches the back to the tables of cookie info
async function switchToTableView() {
    editView.classList.add("hidden");
    cookieTable.classList.remove("hidden");
}

// Event listeners for the cookie menu

const closeEditView = document.getElementById("close-edit-view");
closeEditView.addEventListener("click", switchToTableView);