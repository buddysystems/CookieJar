import { getCookieUrl } from "./cookie-util.js";

export function cookiesToJson(cookies) {
    const cookiesList = [];
    for (const cookie of cookies) {
        cookiesList.push(cookieToJson(cookie));
    }
    return cookiesList;
}

export function cookieToJson(cookie) {
    return {
        name: cookie.name,
        domain: cookie.domain,
        storeId: cookie.storeId,
        expirationDate: cookie.expirationDate,
        hostOnly: cookie.hostOnly,
        httpOnly: cookie.httpOnly,
        path: cookie.path,
        sameSite: cookie.sameSite,
        secure: cookie.secure,
        session: cookie.session,
        value: cookie.value,
        details: {
            name: cookie.name,
            storeId: cookie.storeId,
            url: getCookieUrl(cookie),
        },
        isStored: cookie.isStored,
        isSelected: cookie.isSelected,
    };
}

export function jsonToCookies(jsonList) {
    const list = JSON.parse(jsonList);
    if (!Array.isArray(list)) throw new Error();
    for (const o of list) {
        if (!("name" in o)) throw new Error();
        if (!("domain" in o)) throw new Error();
        if (!("storeId" in o)) throw new Error();
    }
    return list;
}
