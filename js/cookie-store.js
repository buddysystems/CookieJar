class Cookie {
    
    store() {
        var cookieDetails;
        chrome.stroage.local.set({cookieDetails: this})

        chrome.cookies.remove(cookieDetails)
    }
    
    restore() {
    
    }
}

function getCookies() {
    var cookies = chrome.cookies.getAll()
    return cookies;
}