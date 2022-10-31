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
    this.rows = rows.map((row, y) => {
      return row.map((ch, x) => {
        let type = levelCharTypes[ch];
        if (typeof type == "string") return type;
        this.startActors.push(type.create(new Vec(x, y)));
        return "empty";
      });
    });
  }
}

module.exports = Level;
