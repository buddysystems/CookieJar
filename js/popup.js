const cookiesTabbedViewContainer = document.getElementById(
    "cookies-tabbed-view-container"
);

window.onload = async function () {
    const chromeCookieStore = new ChromeCookieStore();
    const cookieJarStore = new CookieJarStore();
    const cookiesManager = new CookiesManager(
        chromeCookieStore,
        cookieJarStore
    );

    const cookiesTabbedView = new CookiesTabbedView(cookiesManager);
    const cookiesTabbedViewElem = await cookiesTabbedView.getHtmlElement();
    cookiesTabbedViewContainer.appendChild(cookiesTabbedViewElem);

    await cookiesTabbedView.activeTab.show();
};
