// const cookieTable = document.getElementById("cookieTable");
// const loadingIndicator = document.getElementById("loadingIndicator");
// const activeBtn = document.getElementById("active-btn");
// const jarBtn = document.getElementById("jar-btn");
// const deleteAllBtn = document.getElementById("delete-all-btn");
// const jarAllBtn = document.getElementById("store-all-btn");
// const unjarAllBtn = document.getElementById("unstore-all-btn");

// activeBtn.addEventListener("click", () => displayActiveTab());
// jarBtn.addEventListener("click", () => displayJarTab());
// deleteAllBtn.addEventListener("click", () => deleteAllCookies());
// jarAllBtn.addEventListener("click", () => chromeCookieStore.storeAllCookies());
// unjarAllBtn.addEventListener("click", () => cookieJar.restoreAllCookies());

// function showLoadingIndicator() {
//     cookieTable.classList.add("hidden");
//     loadingIndicator.classList.remove("hidden");
// }

// function removeLoadingIndicator() {
//     cookieTable.classList.remove("hidden");
//     loadingIndicator.classList.add("hidden");
// }

// window.onload = async function () {
//     await ensureCookieJarStorageCreated();
//     await displayActiveTab();
// };

// async function setCookieTableRowData(tableRow, cookie) {
//     // Update table based on cookie fields
//     const truncatedName = truncateString(cookie.name, 35);
//     const truncatedVal = truncateString(cookie.value, 20);
//     const truncatedUrl = truncateString(cookie.details.url, 20);
//     tableRow.innerHTML = `<td>${truncatedName}</td>
//                 <td>${truncatedVal}</td>
//                 <td>${truncatedUrl}</td>`;
//     // <td>${cookie.secure}</td>
//     // <td>${cookie.sameSite}</td>`;

//     // Dynamically give table select checkboxes
//     const selectCell = document.createElement("td");
//     const selectCheck = document.createElement("input");
//     selectCheck.type = "checkbox";
//     selectCheck.name = cookie.truncatedName;
//     selectCheck.id = cookie.storeId;
//     selectCheck.innerHTML = "Select";
//     selectCheck.checked = cookie.isSelected;
//     selectCheck.addEventListener("click", async () => {
//         cookie.isSelected;
//     });
//     selectCell.appendChild(selectCheck);

//     // Dynamically give table store button
//     const storeCell = document.createElement("td");
//     const storeBtn = document.createElement("button");
//     storeBtn.innerHTML = "Store";
//     storeBtn.disabled = cookie.isStored;
//     storeBtn.addEventListener("click", async () => {
//         await cookie.store();
//         await setCookieTableRowData(tableRow, cookie);
//     });
//     storeCell.appendChild(storeBtn);

//     // Dynamically give table unstore button
//     const restoreCell = document.createElement("td");
//     const restoreBtn = document.createElement("button");
//     restoreBtn.innerHTML = "Restore";
//     restoreBtn.disabled = !cookie.isStored;
//     restoreBtn.addEventListener("click", async () => {
//         await cookie.restore();
//         await setCookieTableRowData(tableRow, cookie);
//     });
//     restoreCell.appendChild(restoreBtn);

//     // Dynamically give table actions
//     const actionCell = document.createElement("td");
//     actionCell.classList = "action";
//     const jarCookieBtn = document.createElement("img");
//     jarCookieBtn.src = "/assets/icons/action-bar/jar-icon.png";
//     jarCookieBtn.style.height = "3em";
//     actionCell.appendChild(jarCookieBtn);
//     jarCookieBtn.addEventListener("click", async () => {
//         await cookie.store();
//         await setCookieTableRowData(tableRow, cookie);
//     });

//     const unjarCookieBtn = document.createElement("img");
//     unjarCookieBtn.src = "/assets/icons/action-bar/unjar-png.png";
//     unjarCookieBtn.style.height = "3em";
//     actionCell.appendChild(unjarCookieBtn);
//     unjarCookieBtn.addEventListener("click", async () => {
//         await cookie.restore();
//         await setCookieTableRowData(tableRow, cookie);
//     });

//     // Remove the jar/unjar button that doesn't belong
//     if (cookie.isStored) {
//         jarCookieBtn.remove();
//     } else {
//         unjarCookieBtn.remove();
//     }
//     const infoCookieBtn = document.createElement("img");
//     infoCookieBtn.src = "/assets/icons/action-bar/info-icon.png";
//     infoCookieBtn.style.height = "3em";
//     actionCell.appendChild(infoCookieBtn);
//     infoCookieBtn.addEventListener("click", async () => {
//         // Build info here
//     });

//     const editCookieBtn = document.createElement("img");
//     editCookieBtn.src = "/assets/icons/action-bar/edit-icon.png";
//     editCookieBtn.style.height = "3em";
//     actionCell.appendChild(editCookieBtn);
//     editCookieBtn.addEventListener("click", async () => {
//         await switchToEditView(cookie, tableRow);
//     });
//     actionCell.appendChild(editCookieBtn);

//     tableRow.prepend(actionCell);
//     tableRow.prepend(selectCell);
// }

// async function createCookieTableRow(cookie) {
//     const cookieTableRowItem = document.createElement("tr");
//     cookieTableRowItem.classList += "cookie-row";
//     cookieTableRowItem.style.marginBottom = "10px";

//     await setCookieTableRowData(cookieTableRowItem, cookie);

//     return cookieTableRowItem;
// }

// async function populateCookieTable(cookies) {
//     showLoadingIndicator();

//     // turned cookies into a parameter
//     // const cookies = await getCookies();
//     const sortedCookies = cookies.sort((a, b) =>
//         alphabeticalComparison(a.name, b.name)
//     );
//     console.log(`${sortedCookies.length} sorted cookies being displayed`);

//     removeLoadingIndicator();

//     for (const cookie of sortedCookies) {
//         const cookieTableRowItem = await createCookieTableRow(cookie);
//         cookieTable.appendChild(cookieTableRowItem);
//     }
// }

// async function displayActiveTab() {
//     resetActiveTab();
//     const chromeCookies = await chromeCookieStore.getChromeCookies();
//     clearCookieTable();
//     populateCookieTable(chromeCookies);
//     activeBtn.className += " active";
// }

// // import feature

// async function importJsonToJar(jsonJar) {
//     for (cookieJson in jsonJar) {
//         const cookie = {
//             domain: cookieJson.domain,
//             expirationDate: cookieJson.expirationDate,
//             hostOnly: cookieJson.hostOnly,
//             httpOnly: cookieJson.httpOnly,
//             name: cookieJson.name,
//             path: cookieJson.path,
//             sameSite: cookie.sameSite,
//             secure: cookie.secure,
//             session: cookie.session,
//             storeId: cookie.storeId,
//             value: cookie.value,
//         };
//         const jarCookie = new JarCookie(cookie);
//         await jarCookie.store();
//     }
// }

// // export feature
// const exportCookieJarBtn = document.getElementById("export-cookie-jar-btn");
// exportCookieJarBtn.addEventListener("click", async () =>
//     downloadCookiesAsJSON()
// );

// async function downloadCookiesAsJSON() {
//     const chromeCookies = await chromeCookieStore.getChromeCookies();
//     const cookieList = [];
//     for (i = 0; i < chromeCookies.length; i++) {
//         const cookie = chromeCookies[i];
//         cookieList.push({
//             name: cookie.name,
//             domain: cookie.domain,
//             storeId: cookie.storeId,
//             "expirationDate ": cookie.expirationDate,
//             "hostOnly ": cookie.hostOnly,
//             "httpOnly ": cookie.httpOnly,
//             "path ": cookie.path,
//             "sameSite ": cookie.sameSite,
//             "secure ": cookie.secure,
//             "session ": cookie.session,
//             "value ": cookie.value,
//             "details ": {
//                 name: cookie.name,
//                 storeId: cookie.storeId,
//                 url: getCookieUrl(this),
//             },
//             "isStored ": cookie.isStored,
//             "isSelected ": cookie.isSelected,
//         });
//     }
//     const blob = new Blob([JSON.stringify(cookieList, null, 2)], {
//         type: "application/json",
//     });
//     var url = URL.createObjectURL(blob);
//     console.dir(chrome);
//     chrome.downloads.download({
//         url: url,
//     });
// }

// async function displayJarTab() {
//     resetActiveTab();
//     const jarCookies = await cookieJar.getJarCookies();
//     clearCookieTable();
//     populateCookieTable(jarCookies);
//     jarBtn.className += " active";
// }

// async function resetActiveTab() {
//     activeBtn.className = "tablinks";
//     jarBtn.className = "tablinks";
// }

// function clearCookieTable() {
//     let i, displayedCookies;

//     displayedCookies = document.getElementsByClassName("cookie-row");
//     for (i = displayedCookies.length - 1; i >= 0; i--) {
//         displayedCookies[i].remove();
//     }
//     console.log("page should be cleared!");
// }

// async function deleteAllCookies() {
//     chromeCookieStore.removeAllCookies();
//     cookieJar.removeAllCookies();
// }

// // Edit cookie view
// const editNameInput = document.getElementById("edit-name-input");
// const editDomainInput = document.getElementById("edit-domain-input");
// const editValueInput = document.getElementById("edit-value-input");
// const editExpirationDateInput = document.getElementById(
//     "edit-expirationDate-input"
// );
// const editHostOnlyInput = document.getElementById("edit-hostOnly-input");
// const editHttpOnlyInput = document.getElementById("edit-httpOnly-input");
// const editPathInput = document.getElementById("edit-path-input");
// const editSameSiteInput = document.getElementById("edit-sameSite-input");
// const editSecureInput = document.getElementById("edit-secure-input");
// const editSessionInput = document.getElementById("edit-session-input");
// const editStoreIdInput = document.getElementById("edit-storeId-input");

// function populateEditCookieView(cookieBeingEdited) {
//     editNameInput.value = cookieBeingEdited.name;
//     editDomainInput.value = cookieBeingEdited.domain;
//     editValueInput.value = cookieBeingEdited.value;
//     editExpirationDateInput.value = cookieBeingEdited.expirationDate;
//     editHostOnlyInput.value = cookieBeingEdited.expirationDate;
//     editHttpOnlyInput.value = cookieBeingEdited.httpOnly;
//     editPathInput.value = cookieBeingEdited.path;
//     editSameSiteInput.value = cookieBeingEdited.sameSite;
//     editSecureInput.value = cookieBeingEdited.secure;
//     editSessionInput.value = cookieBeingEdited.session;
//     editStoreIdInput.value = cookieBeingEdited.storeId;
// }

// function castToBoolean(str) {
//     return str === "true";
// }

// async function saveEditedCookie(cookieBeingEdited, tableRow) {
//     const previousCookieDetails = {
//         name: cookieBeingEdited.name,
//         storeId: cookieBeingEdited.storeId,
//         url: cookieBeingEdited.details.url,
//     };
//     cookieBeingEdited.name = editNameInput.value;
//     cookieBeingEdited.domain = editDomainInput.value;
//     cookieBeingEdited.value = editValueInput.value;
//     cookieBeingEdited.expirationDate = editExpirationDateInput.value;
//     cookieBeingEdited.hostOnly = editHostOnlyInput.value;
//     cookieBeingEdited.httpOnly = castToBoolean(editHttpOnlyInput.value);
//     cookieBeingEdited.path = editPathInput.value;
//     cookieBeingEdited.sameSite = editSameSiteInput.value;
//     cookieBeingEdited.secure = castToBoolean(editSecureInput.value);
//     cookieBeingEdited.session = castToBoolean(editSessionInput.value);
//     cookieBeingEdited.storeId = editStoreIdInput.value;
//     await cookieBeingEdited.updateCookie(previousCookieDetails);

//     await setCookieTableRowData(tableRow, cookieBeingEdited);
// }

// const editView = document.getElementById("edit-view");

// // Changes the view to allow the user to change information about the cookies
// async function switchToEditView(cookieBeingEdited, cookieRow) {
//     // Remove all event listeners
//     let oldElement = document.getElementById("save-edited-cookie-btn");
//     let saveEditedCookieBtn = oldElement.cloneNode(true);
//     oldElement.parentNode.replaceChild(saveEditedCookieBtn, oldElement);

//     populateEditCookieView(cookieBeingEdited);
//     saveEditedCookieBtn.addEventListener("click", async () =>
//         saveEditedCookie(cookieBeingEdited, cookieRow)
//     );
//     cookieTable.classList.add("hidden");
//     editView.classList.remove("hidden");
// }

// // Switches the back to the tables of cookie info
// async function switchToTableView() {
//     editView.classList.add("hidden");
//     cookieTable.classList.remove("hidden");
// }

// // Event listeners for the cookie menu

// const closeEditView = document.getElementById("close-edit-view");
// closeEditView.addEventListener("click", switchToTableView);

// // Import cookie jar feature
// const jsonFileInput = document.getElementById("json-file-input");
// const reader = new FileReader();
// reader.onload = async function (e) {};
// async function importCookieJsonFile() {
//     console.log("reading json file...");
//     selectedJsonFile = jsonFileInput.files[0];
//     reader.readAsText(selectedJsonFile);
// }
// const importCookieJarBtn = document.getElementById("import-cookies-btn");
// importCookieJarBtn.addEventListener(
//     "click",
//     async () => await importCookieJsonFile()
// );
