const Vec = require("./vector");
const State = require("./state");

class CookieMonster {
  constructor(pos, speed, updatedState = null) {
    this.pos = pos;
    this.speed = speed;
    this.updatedState = updatedState;
  }

  get type() {
    return "cookieMonster";
  }

  static create(pos) {
    return new CookieMonster(pos, new Vec(0, 0));
  }

  update(time, state, keys) {
    return new CookieMonster(this.pos, this.speed, this.updatedState);
  }

  collide(state) {
    // Revisit this when we want to make this behaviour different depending on state.miniGameStatus
    this.updatedState = new State(state.level, state.actors, state.status);

    document.getElementById("text").textContent =
      "I am the Cookie Monster! Cookie from first jar, please!";

    return this.updatedState;
  }
}

CookieMonster.prototype.size = new Vec(1, 1);

module.exports = CookieMonster;
