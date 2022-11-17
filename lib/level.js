const Vec = require("./vector");
const MiniGameContainer = require("./miniGameContainer");
const levelCharTypes = require("./levelCharTypes");

class Level {
  constructor(plan) {
    let rows = plan
      .trim()
      .split("\n")
      .map((l) => [...l]);
    this.height = rows.length;
    this.width = rows[0].length;
    this.startActors = [];

    this.rows = rows.map((row, y) => {
      return row.map((ch, x) => {
        let type = levelCharTypes[ch];
        if (typeof type == "string") return type;
        this.startActors.push(
          type.create(new Vec(x, y)),
          MiniGameContainer.getGame()
        ); //HERE
        return "empty";
      });
    });
  }

  touchesElement = function (pos, size, type) {
    let xStart = Math.floor(pos.x);
    let xEnd = Math.ceil(pos.x + size.x);
    let yStart = Math.floor(pos.y);
    let yEnd = Math.ceil(pos.y + size.y);

    for (let y = yStart; y < yEnd; y++) {
      for (let x = xStart; x < xEnd; x++) {
        let isOutside = x < 0 || x >= this.width || y < 0 || y >= this.height;
        let here = isOutside ? "wall" : this.rows[y][x];
        if (here == type) return true;
      }
    }
    return false;
  };
}

module.exports = Level;
