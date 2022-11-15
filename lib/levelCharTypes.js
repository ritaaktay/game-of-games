const Player = require("./player");
const CookieMonster = require("./cookieMonster");
const CookieJar1 = require("./cookieJar1");
const CookieJar2 = require("./cookieJar2");
const Exit = require("./exit");

const levelCharTypes = {
  ".": "empty",
  "#": "wall",
  "M": CookieMonster,
  "@": Player,
  "*": Exit,
  "1": CookieJar1,
  "2": CookieJar2,
};

module.exports = levelCharTypes;
