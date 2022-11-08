const Player = require("./player");
const CookieJar = require("./cookieJar");

const levelCharTypes = {
  ".": "empty",
  "#": "wall",
  "M": "CM",
  "@": Player,
  "!": CookieJar,
};

module.exports = levelCharTypes;
