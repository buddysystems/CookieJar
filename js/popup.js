const cookieTable = document.getElementById("cookieTable");
const getCookiesBtn = document.getElementById("getCookies");

async function populateCookieTable() {
<<<<<<< HEAD
    // const cookies = await getCookies();
    testList = TestCookie.getTestCookieList
    for (const cookie of testList) {
    var cookieTableRowItem = document.createElement("tr");
=======
    const cookies = await getCookies();
    console.log(cookies);
    // for (const cookie of cookies) {
    const cookieTableRowItem = document.createElement("tr");
>>>>>>> c81832c5a2ce502cf4da21f52df88458d7543df4
    cookieTableRowItem.style.marginBottom = "10px";
    cookieTableRowItem.innerHTML = `<td>cookie domain test</td> <td>2</td>`;
    cookieTable.appendChild(cookieTableRowItem);
<<<<<<< HEAD
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
=======
    // }
}

getCookiesBtn.addEventListener("click", populateCookieTable);
>>>>>>> c81832c5a2ce502cf4da21f52df88458d7543df4
