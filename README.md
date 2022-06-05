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

Once that is complete, you may build the project with `npm run build`. This will build the project to the `dist/` directory.

To load the extension in a chromium-based browser, [load the unpacked extension](https://developer.chrome.com/docs/extensions/mv3/getstarted/#unpacked) through the extension page. Make sure to load the `dist/` directory, not the project (`CookieJar`) directory.

## Developing the project

If you want to develop the project locally and automatically update the build every time you save a change, run `npm run start`. This will essentially build to the `dist/` directory every time a save to the source code is saved. Type `Ctrl+C` to stop the auto-build process.

You can also run `npm run build` manually instead when you want to apply changes.

## Testing the project

Unit tests may be found in the `test/` directory.

To run these tests, use `npm test` or `npm run test`.
