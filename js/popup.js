const cookieTable = document.getElementById("cookieTable");

window.onload = async function () {
    console.log("window loaded");
    await populateCookieTable();
};

async function populateCookieTable() {
    const cookies = await getCookies();
    for (const cookie of cookies) {
        const cookieTableRowItem = document.createElement("tr");
        cookieTableRowItem.style.marginBottom = "10px";
        cookieTableRowItem.innerHTML = `<td>${cookie.domain}</td> 
                <td>${cookie.name}</td> 
                <td>${cookie.path}</td>
                <td>${cookie.secure}</td> 
                <td>${cookie.session}</td> 
                <td>${cookie.storeId}</td> 
                <td>${cookie.url}`;

        storeCell = document.createElement("td");
        storeBtn = document.createElement("button");
        storeBtn.innerHTML = "Store";
        storeBtn.disabled = cookie.isStored;
        storeBtn.addEventListener("click", () => cookie.store());
        storeCell.appendChild(storeBtn);
        cookieTableRowItem.appendChild(storeCell);

        restoreCell = document.createElement("td");
        restoreBtn = document.createElement("button");
        restoreBtn.innerHTML = "Restore";
        restoreBtn.disabled = !cookie.isStored;
        restoreBtn.addEventListener("click", () => cookie.restore());
        restoreCell.appendChild(restoreBtn);
        cookieTableRowItem.appendChild(restoreCell);

        cookieTable.appendChild(cookieTableRowItem);
    }
}
