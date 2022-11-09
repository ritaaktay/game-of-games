const Vec = require("./vector");
const State = require("./state");

class CookieMonster {
  constructor(pos, speed) {
    this.pos = pos;
    this.speed = speed;
  }

  get type() {
    return "cookieMonster";
  }

  static create(pos) {
    return new CookieMonster(pos, new Vec(0, 0));
  }

  update(time, state, keys) {
    return new CookieMonster(this.pos, this.speed);
  }

  collide(state) {
    // Revisit this when we want to make this behaviour different depending on state.miniGameStatus
    console.log("COOKIE MONSTER COLLIDE");
    console.log(state.cookieJar1Cookie);
    console.log(state.cookieJar2Cookie);

    const newState = new State(
      state.level,
      state.actors,
      state.status,
      state.miniGameStatus,
      state.cookieJar1Cookie,
      state.cookieJar2Cookie
    );

    document.getElementById("text").textContent = "Give me cookies!";

    return newState;
  }
}

CookieMonster.prototype.size = new Vec(1, 1);

module.exports = CookieMonster;
