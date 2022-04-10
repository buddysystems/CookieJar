
const cookieTable = popup.getElementById("cookieTable");



async function populateCookieTable() {
    const cookies = await getCookies();
    for (const cookie of cookies) {
        const cookieTableRowItem = document.createElement("tr");
        cookieTableRowItem.style.marginBottom = "10px";
        cookieTableRowItem.innerHTML = `$<td>{cookie.domain}</td>`;
        cookieTable.appendChild(cookieTableRowItem);
    }

}

getCookiesBtn.addEventListener("click", getCookies);
