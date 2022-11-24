const CookieMonster = require("./cookieMonster");
const Vec = require("./vector");

class Player {
  constructor(pos, speed) {
    this.pos = pos;
    this.speed = speed;
    this.xySpeed = 6;
  }

  get type() {
    return "player";
  }

  static create(pos) {
    return new Player(pos, new Vec(0, 0));
  }

  update(time, state, keys) {
    let xSpeed = 0;
    if (keys.ArrowLeft) xSpeed -= this.xySpeed;
    if (keys.ArrowRight) xSpeed += this.xySpeed;

    let ySpeed = 0;
    if (keys.ArrowUp) ySpeed -= this.xySpeed;
    if (keys.ArrowDown) ySpeed += this.xySpeed;

    let pos = this.pos;
    let movedX = pos.plus(new Vec(xSpeed * time, 0));
    if (!state.level.touchesWall(movedX, this.size)) {
      pos = movedX;
    }
    let movedY = pos.plus(new Vec(0, ySpeed * time));
    if (!state.level.touchesWall(movedY, this.size)) {
      pos = movedY;
    }
    return new Player(pos, new Vec(xSpeed, ySpeed));
  }
}

Player.prototype.size = new Vec(1, 1);

module.exports = Player;
