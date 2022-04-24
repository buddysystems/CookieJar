# Phase II - The Cookie Jar

## Requirements

**Already completed from Phase I**:

-   use chrome storage API to store cookies

*   add buttons to main UI to store cookies in jar and restore cookies

**Need to be completed**:

-   create two panels for viewing active cookies and cookies which are in the jar
-   add 'Shelf' feature where user may export or import a cookie jar
-   add "empty jar" functionality
-   add "delete all cookies" functionality
-   add "restore all cookies from jar" functionality
-   add "add all cookies to jar" functionality
-   stretch goal: encrypt exported cookie jar with a password

## Basic Phase Outline

### UI

Most of the hard work of this phase have to do with creating new views. We will need
to modify the main popup so that two panels (with support for more) can be selected.

One panel will have the list of active cookies, with buttons pertinent to the active cookies (e.g. delete all cookies, store all cookies, etc.).

The other panel will have the list of cookies in the jar, with buttons pertintent to the
stored cookies (e.g. restore all cookies, export/shelve jar, etc.).

More details can be found in issue #4.

The other hard part is the details modal, which will allow users to see all fields for
a particular cookie and optionally edit the fields.

More details can be found in issue #12.

### Backend

The backend is more straightforward since we already have a good base to work with. The only difficult feature will be the export/import feature, which will need new code.

For the other features, we can modify the classes in `cookie-store.js`, adding methods like

-   `ChromeCookieStore.deleteAllCookies()`,
-   `ChromeCookieStore.storeAllCookies()`, and
-   `CookieJar.restoreAllCookies()`.
