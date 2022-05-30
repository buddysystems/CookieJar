## Phases of Rollout

### 1. Essential Functionality

a) Identify all APIs to be used over the course of the project and test their basic functionality (identify how they work, what they return, assess how the desired functionality will use them, where their potential pitfalls are [eg. can you get all details about a cookie and can you set all those same details]. You should not need to call an API more than 10 times to have plenty of testing data. Also, some may be worth leaving for later, particularly if they’re dependent on responses from other API calls.

b) Determine how to parse and render the full cookie list using html/js(/include a css file but it can be rudimentary). The most important thing here is to fully know all the fields a cookie may potentially use so that when implementing the jar functionality later, nothing is lost.

c) Use JS to ‘cache’ a cookie. This means that when the plugin is open (popup is up), a button can be clicked that will delete the cookie from the browser (using the API), while then storing it as a javascript variable. Then, a second load button can be pressed to reload the cookie again.

### 2. Meat and Potatoes: the Cookie Jar

a) Use the chrome storage API (preferably methods which work across many chrome versions) to store and unload a cookie locally (cookies will persist when the popup is closed and reopened). Will require a second panel that shows the cookies in storage

b) Shelf: take the current cookie jar, export it as a file, and delete the contents of the jar. Alternatively, import such a file and add it to the local storage.

c) Add a button to the main UI to stick a cookie in the cookie jar. Also, add a button to load a cookie from the jar back into the browser.

d) This is gold plate (read: bonus points, time permitting) but it would be very clean to lock data in the jar with a password or encrypt the shelved files

### 3. Live UX: Event Handling during Browsing

a) Update the main list of cookies based on changes (there’s an API for this, question is what it provides and how it works).

The rest of the features for this part will require feedback based on what is found during development. If possible, we are looking to do two things; first, wherever possible, prevent the loading of cookies. This means cookies can be served from a webpage to the browser, but we want to try and stop them before they get loaded into the browser. If this fails, the next thing we want to do is determine whether cookies only change based on the activity we’re currently doing. For example, some cookies may just delete when they expire. If they only change based on user activity, then we can assume that new cookies are coming from the currently active tab; a user may then default to automatically delete any new such cookies. If the page refuses to work without their stupid cookie, then we need a way to keep the cookie loaded until the active tab navigates away from their website or is closed. Finally, the really juicy feature is the ability to respond to queries for certain cookies by responding with cookies currently in the cookie jar. This means the user can allow their google cookie with their login credentials to be returned when visiting a whitelisted site (eg. Drive, Gmail) but otherwise said cookie effectively does not exist.

#### Notes

[This guy](https://github.com/Moustachauve/cookie-editor) has expanded his original plugin to do parts of what is possible, but it’s made primarily for developers, adding support for every platform slows him down, he uses a bunch of weird external dependencies, and the architecture of his code base will eventually bite him in the ass. Also, the GUI is a mess, and it’s not made to automate a user’s desired cookie behavior patterns.

Also, [this plugin](https://chrome.google.com/webstore/detail/i-dont-care-about-cookies/fihnjjcciajhdojfnbdddfaoknhalnja) might be worth reverse engineering at some point. Might as well auto-accept cookies if you’re going to delete them later, or better yet have them be served to you only to then go immediately in the jar.

https://www.codejam.info/2022/03/clearing-cookies-spec-vs-browsers.html
