const cookieRowContent = document.getElementById("TEST-cookie-row-header");
const cookieInfo = document.getElementById("TEST-cookie-info");
const testCaret = document.getElementById("TEST-caret");

cookieInfo.style.display = "none";

cookieRowContent.addEventListener("click", () => {
    if (cookieInfo.style.display == "none") {
        cookieInfo.style.display = "block";
        testCaret.src = "/assets/caret-down.png";
    } else {
        cookieInfo.style.display = "none";
        testCaret.src = "/assets/caret-right.png";
    }
});
