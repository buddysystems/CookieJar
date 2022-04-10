
const cookieTable = popup.getElementById("cookieTable");


async function getCookies() {
    const cookies = await cookieWorker.getAllCookiesAsync();
    for (const cookie of cookies) {
        const cookieTableRowItem = document.createElement("tr");
        cookieTableRowItem.style.marginBottom = "10px";
        cookieTableRowItem.innerHTML = `$<td>{cookie.domain}</td>`;
        cookieTable.appendChild(cookieTableRowItem);
    }

}

getCookiesBtn.addEventListener("click", getCookies);