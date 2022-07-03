# Phase II - The Cookie Jar

The basic goals of Phase III are as follows:
* further provide transparency & integrity to the adtech space
* further improve security for users
* further enable and support developers and non-developers in controlling their data

To achieve these goals, we will
* enable users to automatically block or delete cookies
* enable users to "nuke" cookies
* allow users to apply rules for which cookies to remove, and in what manner to remove them
    * allow users to apply rules for sites, specific cookies, and other differentiators
    * allow users to permanently delete cookies after closing tabs or restarting the browser
    * allow users to jar cookies after closing tabs or restarting the browser

## Requirements

### "Rules" tab

As a refresher, a basic "rule" allows users to choose which cookies are deleted, jarred, or kept once the active tab is closed. We will take to using the following terminology:
* **Whitelist**: whitelisted cookies shall remain in the browser until the user manually deletes or jars them
* **Graylist**: graylisted cookies shall automatically be moved to the cookie jar once the active tab is closed. 
* **Blacklist**: blacklisted cookies shall be permanently deleted once the active tab is closed

To enable the users to interact with these rules, there shall be a new "Rules" tab which provides a centralized place for users to add, modify, and delete rules. 

There is room for change here, but a basic mockup is shown below:
