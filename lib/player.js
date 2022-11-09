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

  /**
   *
   * @param {number} time
   * @param {State} state
   * @returns a new player that is updated based on speed and position
   * The level.touches method is used to check for "wall"s which also
   * include the outer boundaries, and so player remains in current
   * pos if touching a wall.
   * The x & y axis need to be handled separately, touching a vertical
   * wall should not prevent horizontal movement, and a horizontal wall
   * should not prevent vertical movement.
   */
  update(time, state, keys) {
    // increment xSpeed if right arrow is pressed
    // decrement xSpeed if left arrow is pressed
    let xSpeed = 0;
    if (keys.ArrowLeft) xSpeed -= this.xySpeed;
    if (keys.ArrowRight) xSpeed += this.xySpeed;

    // increment ySpeed if down arrow is pressed
    // decrement ySpeed if up arrow is pressed
    let ySpeed = 0;
    if (keys.ArrowUp) ySpeed -= this.xySpeed;
    if (keys.ArrowDown) ySpeed += this.xySpeed;

    let pos = this.pos;
    let movedX = pos.plus(new Vec(xSpeed * time, 0));
    //if movement on x-axis does not touch wall, apply movement on x-axis
    if (
      !state.level.touchesElement(movedX, this.size, "wall") &&
      !state.level.touchesElement(movedX, this.size, CookieMonster)
    ) {
      pos = movedX;
    }
    let movedY = pos.plus(new Vec(0, ySpeed * time));
    //if movement on y-axis does not touch wall, apply movement on x-axis
    if (
      !state.level.touchesElement(movedY, this.size, "wall") &&
      !state.level.touchesElement(movedX, this.size, CookieMonster)
    ) {
      pos = movedY;
    }
    return new Player(pos, new Vec(xSpeed, ySpeed));
  }
}

Player.prototype.size = new Vec(1, 1);

module.exports = Player;
