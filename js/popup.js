const cookieTable = document.getElementById("cookieTable");
const getCookiesBtn = document.getElementById("getCookies");

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
    <td>${cookie.secure}</td> <td>${cookie.session}</td> <td>${cookie.storeId}</td> <td>${cookie.url}</td> ${buttonStatus}`;
    cookieTable.appendChild(cookieTableRowItem);
    }
}

getCookiesBtn.addEventListener("click", populateCookieTable);
