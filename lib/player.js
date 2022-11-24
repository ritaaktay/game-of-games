const Vec = require("./vector");

class Player {
  constructor(pos, velocity) {
    this.pos = pos;
    this.velocity = velocity;
    this.speed = 6;
  }

  get type() {
    return "player";
  }

  static create(pos) {
    return new Player(pos, new Vec(0, 0));
  }

  update(time, state, keys) {
    let xVelocity = 0;
    if (keys.ArrowLeft) xVelocity -= this.speed;
    if (keys.ArrowRight) xVelocity += this.speed;

    let yVelocity = 0;
    if (keys.ArrowUp) yVelocity -= this.speed;
    if (keys.ArrowDown) yVelocity += this.speed;

    let pos = this.pos;
    let movedX = pos.plus(new Vec(xVelocity * time, 0));
    if (!state.level.touchesWall(movedX, this.size)) {
      pos = movedX;
    }
    let movedY = pos.plus(new Vec(0, yVelocity * time));
    if (!state.level.touchesWall(movedY, this.size)) {
      pos = movedY;
    }
    return new Player(pos, new Vec(xVelocity, yVelocity));
  }
}

Player.prototype.size = new Vec(1, 1);

module.exports = Player;
