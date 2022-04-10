const cookieTable = document.getElementById("cookieTable");
const getCookiesBtn = document.getElementById("getCookies");

async function populateCookieTable() {
    const cookies = await getCookies();
    console.log(cookies);
    // for (const cookie of cookies) {
    const cookieTableRowItem = document.createElement("tr");
    cookieTableRowItem.style.marginBottom = "10px";
    cookieTableRowItem.innerHTML = `<td>cookie domain test</td> <td>2</td>`;
    cookieTable.appendChild(cookieTableRowItem);
    // }
}

getCookiesBtn.addEventListener("click", populateCookieTable);
