import { getCookieUrl } from "../helpers/cookie-util.js";
/**
 *  A JarCookie represents the apps representation of a traditional browser cookie.
 * In addition the normal fields you would find on Chrome's Cookie object, you can find
 * details on whether it is stored or not, as well as methods to store/restore it.
 */
export class JarCookie {
    /**
     * @param {*} cookie The chrome cookie object (returned from chrome.cookies API)
     */
    constructor(cookie, isStored = false, isSelected = false) {
        this.domain = cookie.domain;
        this.name = cookie.name;
        this.storeId = cookie.storeId;
        this.expirationDate = cookie.expirationDate;
        this.hostOnly = cookie.hostOnly;
        this.httpOnly = cookie.httpOnly;
        this.path = cookie.path;
        this.sameSite = cookie.sameSite;
        this.secure = cookie.secure;
        this.session = cookie.session;
        this.value = cookie.value;
        this.details = {
            name: cookie.name,
            storeId: cookie.storeId,
            url: getCookieUrl(this),
        };
        this.isStored = isStored;
        this.isSelected = isSelected;
    }
}
