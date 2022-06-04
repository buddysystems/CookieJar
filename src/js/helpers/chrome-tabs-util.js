export async function getCurrentTab() {
    const activeTabs = await chrome.tabs.query({
        active: true,
        lastFocusedWindow: true,
    });
    return activeTabs[0];
}
