const cookieTable = document.getElementById("cookieTable");

window.onload = async function() {
    await populateCookieTable();
}

async function populateCookieTable() {
    const cookies = await getCookies();
    for (const cookie of cookies) {
    const cookieTableRowItem = document.createElement("tr");
    cookieTableRowItem.style.marginBottom = "10px";
    buttonStatus = ''
    if (cookie.isStored){
        buttonStatus = '<td><button disabled>Store</Button></td> <td><button >Restore</Button> </td>'
    } else {
        buttonStatus = '<td><button >Store</Button></td> <td><button disabled>Restore</Button></td>'
    }
    cookieTableRowItem.innerHTML = `<td>${cookie.domain}</td> <td>${cookie.name}</td> <td>${cookie.path}</td>
    <td>${cookie.secure}</td> <td>${cookie.session}</td> <td>${cookie.storeId}</td> <td>${cookie.url}`;

    var storeCell = cookieTableRowItem.insertCell(-1);
    storeCell.innerHTML = `<td><button ${cookie.isStored ? "disabled" : ""}>Store</Button></td>`;

    var restoreCell = cookieTableRowItem.insertCell(-1);
    restoreCell.innerHTML = `<td><button ${cookie.isStored ? "" : "disabled"}>Restore</Button></td>`;

    // storeCell = document.createElement("td");
    // storeBtn = document.createElement("button");
    // storeBtn.innerHTML = 'Store';
    // storeBtn.disabled = cookie.isStored;
    // storeCell.appendChild(storeBtn);
    // cookieTableRowItem.appendChild(storeCell)

    // restoreCell = document.createElement("td");
    // restoreBtn = document.createElement("button");
    // restoreBtn.innerHTML = 'Restore';
    // restoreBtn.disabled = !(cookie.isStored);
    // restoreCell.appendChild(restoreBtn)
    // cookieTableRowItem.appendChild(restoreCell)

    cookieTable.appendChild(cookieTableRowItem);
    }
}

getCookiesBtn.addEventListener("click", populateCookieTable);
