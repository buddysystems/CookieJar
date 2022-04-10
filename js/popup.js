const cookieTable = document.getElementById("cookieTable");
const getCookiesBtn = document.getElementById("getCookies");

async function populateCookieTable() {
    const cookies = await getCookies();
    // for (const cookie of cookies) {
    const cookieTableRowItem = document.createElement("tr");
    cookieTableRowItem.style.marginBottom = "10px";
    cookieTableRowItem.innerHTML = `<td>${cookie.domain}</td> <td>${cookie.name}</td> <td>${cookie.path}</td>
    <td>${cookie.secure}</td> <td>${cookie.session}</td> <td>${cookie.storeId}</td> <td>${cookie.url}</td>`;
    cookieTable.appendChild(cookieTableRowItem);
    // }
}

getCookiesBtn.addEventListener("click", populateCookieTable);
