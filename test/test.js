import { CookiesManager } from "../js/cookies/cookies-manager.js";
import { expect } from 'chai';

const cookies = [
  {
    name: "SNID",
    domain: ".google.com",
    storeId: "0",
    expirationDate: 1669169444.091988,
    hostOnly: false,
    httpOnly: true,
    path: "/verify",
    sameSite: "lax",
    secure: true,
    session: false,
    value: "APx-0P1IoMLMgru1xnM4haDuzkPnqgV7CoUIK8pwMQTKHr-QESGocu98_D-nRn7kFsgL-qNrtDy3Ozs__AHMyfEbXKBY",
    details: {
      name: "SNID",
      storeId: "0",
      url: "https://.google.com/verify"
    },
    isStored: false,
    isSelected: false
  },
  {
    name: "1P_JAR",
    domain: ".google.com",
    storeId: "0",
    expirationDate: 1655950325.829038,
    hostOnly: false,
    httpOnly: false,
    path: "/",
    sameSite: "no_restriction",
    secure: true,
    session: false,
    value: "2022-05-24-02",
    details: {
      name: "1P_JAR",
      storeId: "0",
      url: "https://.google.com/"
    },
    isStored: false,
    isSelected: false
  },
  {
    name: "AEC",
    domain: ".google.com",
    storeId: "0",
    expirationDate: 1668910239.302739,
    hostOnly: false,
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: true,
    session: false,
    value: "AakniGOJ3tvje544fYNqSnAL9mdXwZy9EcBejWVVwzo50rWjbPheHeKF0zs",
    details: {
      name: "AEC",
      storeId: "0",
      url: "https://.google.com/"
    },
    isStored: false,
    isSelected: false
  },
  {
    name: "_sp_ses.5c9c",
    domain: "www.urbandictionary.com",
    storeId: "0",
    expirationDate: 1653360071,
    hostOnly: true,
    httpOnly: false,
    path: "/",
    sameSite: "unspecified",
    secure: false,
    session: false,
    value: "*",
    details: {
      name: "_sp_ses.5c9c",
      storeId: "0",
      url: "http://www.urbandictionary.com/"
    },
    isStored: false,
    isSelected: false,
  },
]

const manager = new CookiesManager

describe("CookiesManager", () => {

  it("Test storing many cookies", () => {
    const firstCookie = {
      name: "SNID",
      domain: ".google.com",
      storeId: "0",
      expirationDate: 1669169444.091988,
      hostOnly: false,
      httpOnly: true,
      path: "/verify",
      sameSite: "lax",
      secure: true,
      session: false,
      value: "APx-0P1IoMLMgru1xnM4haDuzkPnqgV7CoUIK8pwMQTKHr-QESGocu98_D-nRn7kFsgL-qNrtDy3Ozs__AHMyfEbXKBY",
      details: {
        name: "SNID",
        storeId: "0",
        url: "https://.google.com/verify"
      },
      isStored: false,
      isSelected: false
    }
    const secondCookie = {
      name: "Lets Gooo",
      domain: ".google.com",
      storeId: "0",
      expirationDate: 1669169444.091988,
      hostOnly: false,
      httpOnly: true,
      path: "/verify",
      sameSite: "lax",
      secure: true,
      session: false,
      value: "APx-0P1IoMLMgru1xnM4haDuzkPnqgV7CoUIK8pwMQTKHr-QESGocu98_D-nRn7kFsgL-qNrtDy3Ozs__AHMyfEbXKBY",
      details: {
        name: "SNID",
        storeId: "0",
        url: "https://.google.com/verify"
      },
      isStored: false,
      isSelected: true
    }
    const testCookies = [firstCookie, secondCookie];

    manager.storeCookies(testCookies)
    expect(firstCookie.isStored).to.be.true;
    expect(secondCookie.isStored).to.be.true;
  });

  it("Test storing a single cookie", () => {
    const testCookie = {
      name: "SNID",
      domain: ".google.com",
      storeId: "0",
      expirationDate: 1669169444.091988,
      hostOnly: false,
      httpOnly: true,
      path: "/verify",
      sameSite: "lax",
      secure: true,
      session: false,
      value: "APx-0P1IoMLMgru1xnM4haDuzkPnqgV7CoUIK8pwMQTKHr-QESGocu98_D-nRn7kFsgL-qNrtDy3Ozs__AHMyfEbXKBY",
      details: {
        name: "SNID",
        storeId: "0",
        url: "https://.google.com/verify"
      },
      isStored: false,
      isSelected: false
    };

    manager.storeCookie(testCookie)
    expect(testCookie.isStored).to.be.true;
  });

  it("Test restoring many cookies", () => {
    const firstCookie = {
      name: "SNID",
      domain: ".google.com",
      storeId: "0",
      expirationDate: 1669169444.091988,
      hostOnly: false,
      httpOnly: true,
      path: "/verify",
      sameSite: "lax",
      secure: true,
      session: false,
      value: "APx-0P1IoMLMgru1xnM4haDuzkPnqgV7CoUIK8pwMQTKHr-QESGocu98_D-nRn7kFsgL-qNrtDy3Ozs__AHMyfEbXKBY",
      details: {
        name: "SNID",
        storeId: "0",
        url: "https://.google.com/verify"
      },
      isStored: true,
      isSelected: false
    }
    const secondCookie = {
      name: "Lets Gooo",
      domain: ".google.com",
      storeId: "0",
      expirationDate: 1669169444.091988,
      hostOnly: false,
      httpOnly: true,
      path: "/verify",
      sameSite: "lax",
      secure: true,
      session: false,
      value: "APx-0P1IoMLMgru1xnM4haDuzkPnqgV7CoUIK8pwMQTKHr-QESGocu98_D-nRn7kFsgL-qNrtDy3Ozs__AHMyfEbXKBY",
      details: {
        name: "SNID",
        storeId: "0",
        url: "https://.google.com/verify"
      },
      isStored: true,
      isSelected: true
    }
    const testCookies = [firstCookie, secondCookie];

    manager.restoreCookies(testCookies)
    expect(firstCookie.isStored).to.be.false;
    expect(secondCookie.isStored).to.be.false;
  });

  it("Test restoring a single cookie", () => {
    const testCookie = {
      name: "SNID",
      domain: ".google.com",
      storeId: "0",
      expirationDate: 1669169444.091988,
      hostOnly: false,
      httpOnly: true,
      path: "/verify",
      sameSite: "lax",
      secure: true,
      session: false,
      value: "APx-0P1IoMLMgru1xnM4haDuzkPnqgV7CoUIK8pwMQTKHr-QESGocu98_D-nRn7kFsgL-qNrtDy3Ozs__AHMyfEbXKBY",
      details: {
        name: "SNID",
        storeId: "0",
        url: "https://.google.com/verify"
      },
      isStored: true,
      isSelected: false
    };

    manager.restoreCookie(testCookie)
    expect(testCookie.isStored).to.be.false;
  });

  it("Test that getJarredCookies works properly", () => {
    const jarCookies = {
      name: "SNID",
      domain: ".google.com",
      storeId: "0",
      expirationDate: 1669169444.091988,
      hostOnly: false,
      httpOnly: true,
      path: "/verify",
      sameSite: "lax",
      secure: true,
      session: false,
      value: "APx-0P1IoMLMgru1xnM4haDuzkPnqgV7CoUIK8pwMQTKHr-QESGocu98_D-nRn7kFsgL-qNrtDy3Ozs__AHMyfEbXKBY",
      details: {
        name: "SNID",
        storeId: "0",
        url: "https://.google.com/verify"
      },
      isStored: true,
      isSelected: false
    };

    const chromeCookies = {
      name: "Lets Gooo",
      domain: ".google.com",
      storeId: "0",
      expirationDate: 1669169444.091988,
      hostOnly: false,
      httpOnly: true,
      path: "/verify",
      sameSite: "lax",
      secure: true,
      session: false,
      value: "APx-0P1IoMLMgru1xnM4haDuzkPnqgV7CoUIK8pwMQTKHr-QESGocu98_D-nRn7kFsgL-qNrtDy3Ozs__AHMyfEbXKBY",
      details: {
        name: "SNID",
        storeId: "0",
        url: "https://.google.com/verify"
      },
      isStored: false,
      isSelected: true
    };

    const cookiesManager = new CookiesManager(jarCookies, chromeCookies);
    const returnedCookie = cookiesManager.getJarredCookies()
    expect(returnedCookie).to.equal(jarCookies.details);
  });

  it("Test that cookies update properly", () => {
    const jarCookies = {
      name: "SNID",
      domain: ".google.com",
      storeId: "0",
      expirationDate: 1669169444.091988,
      hostOnly: false,
      httpOnly: true,
      path: "/verify",
      sameSite: "lax",
      secure: true,
      session: false,
      value: "APx-0P1IoMLMgru1xnM4haDuzkPnqgV7CoUIK8pwMQTKHr-QESGocu98_D-nRn7kFsgL-qNrtDy3Ozs__AHMyfEbXKBY",
      details: {
        name: "SNID",
        storeId: "0",
        url: "https://.google.com/verify"
      },
      isStored: true,
      isSelected: false
    };

    const chromeCookies = {
      name: "Lets Gooo",
      domain: ".google.com",
      storeId: "0",
      expirationDate: 1669169444.091988,
      hostOnly: false,
      httpOnly: true,
      path: "/verify",
      sameSite: "lax",
      secure: true,
      session: false,
      value: "APx-0P1IoMLMgru1xnM4haDuzkPnqgV7CoUIK8pwMQTKHr-QESGocu98_D-nRn7kFsgL-qNrtDy3Ozs__AHMyfEbXKBY",
      details: {
        name: "SNID",
        storeId: "0",
        url: "https://.google.com/verify"
      },
      isStored: false,
      isSelected: true
    };

    const cookiesManager = new CookiesManager(jarCookies, chromeCookies);
    const returnedCookie = cookiesManager.getJarredCookies()
    expect(returnedCookie).to.equal(jarCookies.details);
  });
});