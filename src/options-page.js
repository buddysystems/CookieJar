const dashboardBtn = document.getElementById("dashboard-button");
const settingsBtn = document.getElementById("settings-button");

const dashboardContainer = document.getElementById("dashboard-container");
const settingsContainer = document.getElementById("settings-container");

dashboardBtn.addEventListener("click", () => {
    resetAll();
    settingsContainer.classList.add("inactive");
    dashboardContainer.classList.add("active");
});

settingsBtn.addEventListener("click", () => {
    resetAll();
    dashboardContainer.classList.add("inactive");
    settingsContainer.classList.add("active");
});

function resetAll() {
    dashboardContainer.classList.remove("inactive");
    dashboardContainer.classList.remove("active");
    settingsContainer.classList.remove("inactive");
    settingsContainer.classList.remove("active");
}
