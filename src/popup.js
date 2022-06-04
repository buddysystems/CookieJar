// The order of css imports is important; reset should always go first, as other stylesheets must override it
import "./css/reset.css";
import "./css/cookie-row.css";
import "./css/pantry.css";
import "./css/modal.css";
import "./css/popup.css";

import { ChromeCookieStore } from "./js/cookies/chrome-cookie-store";
import { CookieJarStore } from "./js/cookies/cookie-jar-store";
import { CookiesManager } from "./js/cookies/cookies-manager";
import { CookiesTabbedView } from "./js/ui/cookies-tabbed-view";

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
