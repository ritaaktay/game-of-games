const Vec = require("./vector");
const levelCharTypes = require("./levelCharTypes");

class Level {
  constructor(plan, MiniGameLocator) {
    this.rows = this.#makeMatrix(plan);
    this.height = this.rows.length;
    this.width = this.rows[0].length;
    this.startActors = [];
    this.MiniGameLocator = new MiniGameLocator();
    this.#mapActors();
    console.log(this.startActors);
  }

  #makeMatrix = (levelPlan) => {
    return levelPlan
      .trim()
      .split("\n")
      .map((l) => [...l]);
  };

  #mapActors = () => {
    //TO DO: refactor
    this.rows = this.rows.map((row, y) => {
      return row.map((ch, x) => {
        let type = levelCharTypes[ch];
        if (typeof type == "string") return type;
        if (ch == "!") {
          this.startActors.push(
            type.create(new Vec(x, y), this.MiniGameLocator.getGame())
          );
        } else {
          this.startActors.push(type.create(new Vec(x, y)));
        }
        return "empty";
      });
    });
  };

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
