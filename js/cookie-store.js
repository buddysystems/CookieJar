class Cookie {

    constructor(chromeCookie) {
        this.domain = chromeCookie.domain;
        this.name = chromeCookie.name;
        this.storeId = chromeCookie.storeId;
        this.expirationDate = chromeCookie.expirationDate;
        this.hostOnly = chromeCookie.hostOnly;
        this.httpOnly = chromeCookie.httpOnly;
        this.path = chromeCookie.path;
        this.sameSite = chromeCookie.sameSite;
        this.secure = chromeCookie.secure;
        this.session = chromeCookie.session;
        this.value = chromeCookie.value;
        this.details = {
            name: chromeCookie.name,
            storeId: chromeCookie.storeId,
            url: chromeCookie.url
        }
    }
    
    store() {
        var cookieDetails;
        chrome.stroage.local.set({cookieDetails: this})

        chrome.cookies.remove(cookieDetails)
    }
    
    restore() {
    
    }
}


function getCookies() {
    // Possible issue here with cooies not appending to cookies list (:
    var cookies = chrome.cookies.getAll()

    for (var cookie of cookies) {
        cookie = new Cookie(cookie);
    }

    return cookies;
}