const cookieTable = document.getElementById("cookieTable");
const getCookiesBtn = document.getElementById("getCookies")



async function populateCookieTable() {
    // const cookies = await getCookies();
    testList = TestCookie.getTestCookieList
    for (const cookie of testList) {
    var cookieTableRowItem = document.createElement("tr");
    cookieTableRowItem.style.marginBottom = "10px";
    cookieTableRowItem.innerHTML = `<td>${cookie.domain}</td> <td>2</td>`;
    cookieTable.appendChild(cookieTableRowItem);
    }

}

getCookiesBtn.addEventListener("click", populateCookieTable);


class TestCookie {
    constructor(domain, name, storeId, isStored=false) {
        this.domain = chromeCookie.domain;
        this.name = chromeCookie.name;
        this.storeId = chromeCookie.storeId;
        this.isStored = isStored
    }

    getTestCookieList() {
        var testCookieList
        for(i = 0; i < 10; i++) {
            newTestCookie = TestCookie("Domain", "Name", "storeID", false)
            testCookieList.appendChild(newTestCookie)
        }
        return testCookieList
    }
}