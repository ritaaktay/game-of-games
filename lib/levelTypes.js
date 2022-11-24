const Player = require("./player");
const CookieMonster = require("./cookieMonster");
const CookieJar = require("./cookieJar");
const Exit = require("./exit");

const levelTypes = {
  ".": "empty",
  "#": "wall",
  "M": CookieMonster,
  "@": Player,
  "*": Exit,
  "!": CookieJar,
};

module.exports = levelTypes;
