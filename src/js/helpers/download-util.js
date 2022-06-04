export function downloadJson(jsonObj) {
    const blob = new Blob([JSON.stringify(jsonObj, null, 2)], {
        type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    chrome.downloads.download({ url });
}

export function downloadPlainText(text) {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    chrome.downloads.download({ url });
}
