const Vec = require("./vector");

class Player {
  constructor(pos, speed) {
    this.pos = pos;
    this.speed = speed;
  }

  get type() {
    return "player";
  }

  static create(pos) {
    return new Player(pos, new Vec(0, 0));
  }
}

Player.prototype.size = new Vec(1, 1);

module.exports = Player;
