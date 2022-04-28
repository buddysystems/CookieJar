const cookieTable = document.getElementById("cookieTable");
const loadingIndicator = document.getElementById("loadingIndicator");
const activeBtn = document.getElementById("active-btn");
const jarBtn = document.getElementById("jar-btn");
const deleteAllBtn = document.getElementById("delete-all-btn");
const jarAllBtn = document.getElementById("store-all-btn");
const unjarAllBtn = document.getElementById("unstore-all-btn");

activeBtn.addEventListener("click", () => displayActiveTab());
jarBtn.addEventListener("click", () => displayJarTab());
deleteAllBtn.addEventListener("click", () => deleteAllCookies());
jarAllBtn.addEventListener("click", () => chromeCookieStore.storeAllCookies());
unjarAllBtn.addEventListener("click", () => cookieJar.restoreAllCookies());

function showLoadingIndicator() {
    cookieTable.classList.add("hidden");
    loadingIndicator.classList.remove("hidden");
}

function removeLoadingIndicator() {
    cookieTable.classList.remove("hidden");
    loadingIndicator.classList.add("hidden");
}

window.onload = async function() {
    const chromeCookies = await chromeCookieStore.getChromeCookies();

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
    selectCell = document.createElement("td");
    selectCheck = document.createElement("input");
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
    storeCell = document.createElement("td");
    storeBtn = document.createElement("button");
    storeBtn.innerHTML = "Store";
    storeBtn.disabled = cookie.isStored;
    storeBtn.addEventListener("click", async() => {
        await cookie.store();
        await setCookieTableRowData(tableRow, cookie);
    });
    storeCell.appendChild(storeBtn);

    // Dynamically give table unstore button
    restoreCell = document.createElement("td");
    restoreBtn = document.createElement("button");
    restoreBtn.innerHTML = "Restore";
    restoreBtn.disabled = !cookie.isStored;
    restoreBtn.addEventListener("click", async() => {
        await cookie.restore();
        await setCookieTableRowData(tableRow, cookie);
    });
    restoreCell.appendChild(restoreBtn);

    // Dynamically give table actions
    imgCell = document.createElement("td");
    imgBtn = document.createElement("img");
    imgBtn.src = '/assets/icons/cookie-48.png'
    imgCell.appendChild(imgBtn)
    imgBtn.addEventListener("click", async() => {
        await cookie.store();
        await setCookieTableRowData(tableRow, cookie);
    });


    // Prepend adds element to beginning
    // tableRow.prepend(restoreCell);
    // tableRow.prepend(storeCell);
    tableRow.prepend(imgCell)
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
    resetActiveTab()
    const chromeCookies = await chromeCookieStore.getChromeCookies();
    clearCookieTable()
    populateCookieTable(chromeCookies)
    activeBtn.className += " active";
}

async function downloadCookiesAsJSON() {
    const chromeCookies = await chromeCookieStore.getChromeCookies();
    const dict = {}
    for (i=0; i<chromeCookies.length; i++) {
        const cookie = chromeCookies[i]
        dict[i] = {"name" : cookie.name,
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
    }
    const blob = new Blob([JSON.stringify(dict, null, 2)], {type : 'application/json'});
    var url = URL.createObjectURL(blob);
    chrome.downloads.download({
        url: url 
    });


}

async function displayJarTab() {
    resetActiveTab()
    const jarCookies = await cookieJar.getJarCookies();
    clearCookieTable()
    populateCookieTable(jarCookies)
    jarBtn.className += " active";
}

async function resetActiveTab() {
    activeBtn.className = "tablinks"
    jarBtn.className = "tablinks"
}

function clearCookieTable() {
    let i, displayedCookies;

    displayedCookies = document.getElementsByClassName("cookie-row");
    for (i = displayedCookies.length - 1; i >= 0; i--) {
        displayedCookies[i].remove();
    }
    console.log('page should be cleared!')
}

async function deleteAllCookies() {
    chromeCookieStore.removeAllCookies()
    cookieJar.removeAllCookies()
}

// Edit View Button workings

const editView = document.getElementById("test-edit-view");

// Changes the view to allow the user to change information about the cookies
async function switchToEditView(cookieBeingEdited) {
    console.log(`Cookie being edited: ${cookieBeingEdited}`);
    cookieTable.classList.add("hidden");
    editView.classList.remove("hidden");
}

// Switches the back to the tables of cookie info
async function switchToTableView() {
    editView.classList.add("hidden");
    cookieTable.classList.remove("hidden");
}

// Event listeners for the cookie menu
const testEditButton = document.getElementById("test-edit-button");
testEditButton.addEventListener(
    "click",
    async() => await switchToEditView(null)
);

const closeEditView = document.getElementById("close-edit-view");
closeEditView.addEventListener("click", switchToTableView);