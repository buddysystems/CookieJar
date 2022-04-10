class Cookie {

    constructor(chromeCookie, isStored=false) {
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
        this.isStored = isStored
    }
    
    store() {
        if (this.isStored) return;
        else {
            this.isStored = true
            const key = JSON.stringify(this.details)
            chrome.stroage.local.set({key: this})
            chrome.cookies.remove(this.details)
        }
    }
    
    restore() {
        if (this.isStored) {
            this.isStored = false
            const key = JSON.stringify(this.details)
            transferCookie = chrome.storage.local.get(key)

        }
    }
}


function getCookies() {
    // Possible issue here with cooies not appending to cookies list (:
    var cookies = chrome.cookies.getAll({})

    for (var cookie of cookies) {
        cookie = new Cookie(cookie)
    }

    return cookies;
}
