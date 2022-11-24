const Vec = require("./vector");
const levelTypes = require("./levelTypes");

class Level {
  constructor(plans, MiniGameLocator) {
    this.plans = plans;
    this.startActors = [];
    this.MiniGameLocator = new MiniGameLocator();
    this.#makeMatrix(this.plans["start"]);
  }

  switch = (stage) => {
    this.startActors = [];
    this.#makeMatrix(this.plans[stage]);
    return this;
  };

  #makeMatrix = (levelPlan) => {
    this.rows = levelPlan
      .trim()
      .split("\n")
      .map((l) => [...l]);
    this.height = this.rows.length;
    this.width = this.rows[0].length;
    this.#mapActors();
  };

  #mapActors = () => {
    this.rows = this.rows.map((row, y) => {
      return row.map((index, x) => {
        let type = levelTypes[index];
        if (this.#isBackground(type)) return type;
        this.startActors.push(type.create(new Vec(x, y), this.MiniGameLocator));
        return "empty";
      });
    });
  };

  #isBackground = (type) => {
    return typeof type == "string";
  };

  touchesWall = function (pos, size) {
    let xStart = Math.floor(pos.x);
    let xEnd = Math.ceil(pos.x + size.x);
    let yStart = Math.floor(pos.y);
    let yEnd = Math.ceil(pos.y + size.y);

    for (let y = yStart; y < yEnd; y++) {
      for (let x = xStart; x < xEnd; x++) {
        let isOutside = x < 0 || x >= this.width || y < 0 || y >= this.height;
        let here = isOutside ? "wall" : this.rows[y][x];
        if (here == "wall") return true;
      }
    }
    return false;
  };
}

module.exports = Level;
