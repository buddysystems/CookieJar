const cookieRowContent = document.getElementById("TEST-cookie-row-content");
const cookieInfo = document.getElementById("TEST-cookie-info");

cookieRowContent.addEventListener("click", () => {
    console.log("cookie row clicked");
    if (cookieInfo.style.display == "none") {
        cookieInfo.style.display = "block";
    } else {
        cookieInfo.style.display = "none";
    }
});

// function cookieRow(/* cookie */){

// }
