const Vec = require("./vector");
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

    /**
     * This maps over the 2D array rows with array indexes, y & x
     * replaces the characters with either strings describing the backgroud characters
     * or "empty" for actors.
     * Actor instances are created for chracters that have type of an actor class
     *
     */

    // start actors needs to be constructed with the right miniGame dependency per cookieJar
    // numbers are cookieJars and should be mapped onto the different mini-games
    this.rows = rows.map((row, y) => {
      return row.map((ch, x) => {
        let type = levelCharTypes[ch];
        if (typeof type == "string") return type;
        this.startActors.push(type.create(new Vec(x, y)));
        return "empty";
      });
    });
  }

  /**
   * This function checks if an actor (given position & size)
   * touches a grid element of the given type (ex. "wall")
   * Squares outside of level are treated as walls.
   */
  touchesElement = function (pos, size, type) {
    // Area range around an actor
    let xStart = Math.floor(pos.x);
    let xEnd = Math.ceil(pos.x + size.x);
    let yStart = Math.floor(pos.y);
    let yEnd = Math.ceil(pos.y + size.y);

    // Scan area around actor - check if touching given game object type
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
