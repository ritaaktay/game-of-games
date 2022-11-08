const Player = require("./player");
const CookieJar1 = require("./cookieJar1");

const levelCharTypes = {
  ".": "empty",
  "#": "wall",
  "M": "CM",
  "@": Player,
  "1": CookieJar1,
};

module.exports = levelCharTypes;
