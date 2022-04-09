# Phase I - Essential Functionality

A more detailed description of this phase may be found in the README.

## Requirements

-   identify APIs which will be used
    -   test basic functionality
-   determine how to parse and render the cookie list (basic UI)
-   use JS to cache cookies --- when the plugin in open, a button may be pressed to delete the cookie from the browser, then store it as a JS variable.
-   use JS to reload cached cookies --- a load button may be pressed to reload a cookie which was cached

## Basic Project Outline

At this phase, we really have three things to worry about:

1. interacting with the Chrome API to do things such as add/remove cookies
2. coordinating between the UI and the 'backend' logic (e.g. triggering a certain function to run when
   a button is pressed, or updating the UI when a cookie is deleted)
3. creating a UI which displays all the information we need and provides an interface for interacting
   with the cookies

To make things easier to talk about, I will describe these three concerns using the following language:

1. Model
2. Controller
3. View

### APIs

By APIs, we are not talking about REST APIs, but of the native Chrome functions which let us interact with the browser.

The `chrome.cookies` API is used to query and modify cookies, as well as be notifed when the change. Here are some methods we will probably use:

-   [get-all](https://developer.chrome.com/docs/extensions/reference/cookies/#method-getAll)
-   [remove](https://developer.chrome.com/docs/extensions/reference/cookies/#method-remove)
-   [set](https://developer.chrome.com/docs/extensions/reference/cookies/#method-set)
-   [onChanged](https://developer.chrome.com/docs/extensions/reference/cookies/#event-onChanged)

If it turns out to be difficult to cache cookies using JS, we may use the 'chrome.storage' API. [Usage details](https://developer.chrome.com/docs/extensions/reference/storage/#usage)

In a later phase, we will probably use the `chrome.tabs` API to "make note of
which pages caused ... cookies to be served (active tab)." We will also need to use the [`activeTab`](https://developer.chrome.com/docs/extensions/mv3/manifest/activeTab/) permission.

### Model

The model will the the layer which interacts directly with the Chrome API, while providing a nicer API for our controller to use.

Based on the requirements, we will likely need to implement the following methods:

```javascript
/// Return a list of all the cookies stored by the browser
function getAllBrowserCookies() {}

/// Return a list of all the cookies cached by the plugin
function getAllCachedCookies() {}

/// Remove a cookie from the browser and cache it using JS
/// CookieDetails is used to ID cookies -> https://developer.chrome.com/docs/extensions/reference/cookies/#type-CookieDetails
function cacheCookie(cookieDetails) {}

/// Remove a cookie from the cache and add it back to browser storage
function restoreCookie(cookieDetails) {}
```

It is important to note all the fields provided by the `Cookie` class. [See details](https://developer.chrome.com/docs/extensions/reference/cookies/#type-Cookie).

`CookieDetails` don't contain the full cookie information, but enough to identify
individual cookies (think of it like a complex ID). [See details](https://developer.chrome.com/docs/extensions/reference/cookies/#type-CookieDetails).

### Controller

The controller will be used to bridge the UI and the model.

Here are a few examples of dynamically updating the UI:

```html
...
<ul id="test-list"></ul>
<button id="add-item">Add item</button>
...
```

```javascript
// Select the HTML list element so we can add items to it
const uiList = document.getElementById("test-list");

for (let i = 0; i < 5; i++) {
    // Create a new <li> element (but don't yet add it to the document)
    const item = document.createElement("li");
    // Change the text in the list item
    item.innerHTML = `item #${i}`;
    // Add the new <li> element to the <ul>
    uiList.appendChild(item);
}

// Select the button element so we can give it functionality
const addItemBtn = document.getElementById("add-item");

// When the button is clicked, call the addItem method
addItemBtn.addEventListener("click", addItem);

function addItem() {
    const item = document.createElement("li");
    item.innerHTML = "Item added via a button interaction";
    uiList.appendChild(item);
}
```

### View

The UI during this phase can be very simplistic, with minimal styling or attention to UX.

A more [detailed mockup](https://design.penpot.app/#/workspace/51e93290-b5b8-11ec-862a-da95c03a630b/53d06920-b5b8-11ec-862a-da95c03a630b?page-id=53d06921-b5b8-11ec-862a-da95c03a630b) has been created by Elijah.
