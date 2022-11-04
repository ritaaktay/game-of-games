const Player = require("./player");
const CookieJar = require("./cookieJar");

const levelCharTypes = {
  ".": "empty",
  "@": Player,
  "!": CookieJar,
};

module.exports = levelCharTypes;
