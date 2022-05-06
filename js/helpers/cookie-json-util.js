function cookiesToJson(cookies) {
    const cookiesList = [];
    for (const cookie of cookies) {
        cookiesList.push(cookieToJson(cookie));
    }
    return cookiesList;
}

function cookieToJson(cookie) {
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

function jsonToCookies(jsonList) {
    // TODO: may need to do some error handling if not valid json
    return JSON.parse(jsonList);
}
