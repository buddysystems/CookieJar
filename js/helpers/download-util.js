function downloadJson(jsonObj) {
    const blob = new Blob([JSON.stringify(jsonObj, null, 2)], {
        type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    chrome.downloads.download({ url });
}
