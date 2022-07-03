import { ChromeCookieStore } from "./cookies/chrome-cookie-store.js";
import { CookieJarStore } from "./cookies/cookie-jar-store.js";
import { CookiesManager } from "./cookies/cookies-manager.js";
import { RulesManager } from "./rules/rules-manager.js";
import { CookiesTabbedView } from "./ui/cookies-tabbed-view.js";

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

    const rulesManager = new RulesManager();

    const cookiesTabbedView = new CookiesTabbedView(
        cookiesManager,
        rulesManager
    );
    const cookiesTabbedViewElem = await cookiesTabbedView.getHtmlElement();
    cookiesTabbedViewContainer.appendChild(cookiesTabbedViewElem);

    await cookiesTabbedView.cookiesTab.show();
};
