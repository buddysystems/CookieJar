import BulkCookieSelector from "bulk-cookie-selector.js";

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

const selector = BulkCookieSelector

describe("BulkCookieSelector", () => {

  test("Test ", () => {
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

    selectCookie(testCookie)
    expect(testCookie.isSelected).toBeTruthy();
  });

  test("it should filter by a search term (link)", () => {
    const cookies = {
  }
})});