# Cookie Jar

### Purpose

Cookie Jar is a simple extension made to allow users to easily interact with the cookies stored by their browser.
Our hope is to provide transparency and integrity to the adtech space while also improving security.

### Installation

The plugin can be downloaded from its page on the [Chrome Web Store](https://chrome.google.com/webstore/detail/cookie-jar/gbnoafhkohnlkfbgbdkmljlifdecblop) or loaded manually from the zip file under the [Releases](https://github.com/buddysystems/CookieJar/releases) page.

### Functionality

1. View all cookies and potentially delete selected ones

2. Search through active or stored cookies by domain or term

3. Identify when new cookies have been loaded into the browser

4. Make note of which pages caused these cookies to be served (active tab)

5. Automatically delete these cookies when the page closes

6. Unload and load a selected cookie (store into local storage, delete it, unload it from local storage API, add the cookie back)

7. Edit active or stored cookies

## Cloning and building the project

To clone and build the project locally, you must have the following programs installed:

-   [git](https://git-scm.com/downloads)
-   [node (npm)](https://nodejs.org/en/download/)

Copy the project with git:

```
git clone https://github.com/buddysystems/CookieJar.git
```

Inside the newly created project directory, you must install necessary dependencies:

```
npm install
```

To load the extension in a chromium-based browser, [load the unpacked extension](https://developer.chrome.com/docs/extensions/mv3/getstarted/#unpacked) through the extension page.

## Testing the project

Unit tests may be found in the `test/` directory.

To run these tests, use `npm test` or `npm run test`.
