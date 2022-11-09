const Player = require("./player");
const CookieJar = require("./cookieJar");
const CookieMonster = require("./cookieMonster");

const levelCharTypes = {
  ".": "empty",
  "#": "wall",
  "M": CookieMonster,
  "@": Player,
  "!": CookieJar,
};

module.exports = levelCharTypes;
