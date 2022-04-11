const cookieTable = document.getElementById("cookieTable");

window.onload = async function () {
    console.log("window loaded");
    await populateCookieTable();
};

function truncateString(str, n) {
    return str.length > n ? str.substr(0, n - 1) + "&hellip;" : str;
}

function alphabeticalComparison(a, b) {
    if (a < b) {
        return -1;
    }
    if (a > b) {
        return 1;
    }
    return 0;
}
async function populateCookieTable() {
    const cookies = await getCookies();
    const sortedCookies = cookies.sort((a, b) =>
        alphabeticalComparison(a.name, b.name)
    );
    console.log(`${sortedCookies.length} sorted cookies being displayed`);
    for (const cookie of sortedCookies) {
        const cookieTableRowItem = document.createElement("tr");
        cookieTableRowItem.classList += "cookie-row";
        cookieTableRowItem.style.marginBottom = "10px";

        const truncatedName = truncateString(cookie.name, 40);
        const truncatedVal = truncateString(cookie.value, 15);
        const truncatedUrl = truncateString(cookie.details.url, 20);
        cookieTableRowItem.innerHTML += `<td>${truncatedName}</td> 
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
            // For now, when the click the store button, we will store the cookie then reset the entire table. This is not performant
            await cookie.store();
            await resetCookieTable();
            await populateCookieTable(); // Who said we wouldn't use recursion?
        });
        storeCell.appendChild(storeBtn);

        restoreCell = document.createElement("td");
        restoreBtn = document.createElement("button");
        restoreBtn.innerHTML = "Restore";
        restoreBtn.disabled = !cookie.isStored;
        restoreBtn.addEventListener("click", async () => {
            // See store handler for how this is not performant
            await cookie.restore();
            await resetCookieTable();
            await populateCookieTable();
        });
        restoreCell.appendChild(restoreBtn);

        // prepend adds element to beginning
        cookieTableRowItem.prepend(restoreCell);
        cookieTableRowItem.prepend(storeCell);

        cookieTable.appendChild(cookieTableRowItem);
    }
}

async function resetCookieTable() {
    const tableRows = cookieTable.getElementsByClassName("cookie-row");
    while (tableRows.length > 0) {
        tableRows[0].parentNode.removeChild(tableRows[0]);
    }
}
