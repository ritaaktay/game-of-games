const Vec = require("./vector");
const State = require("./state");
const levelPlans = require("./levelPlans");

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

  collide(state, levelConstructor) {
    // if cookieJar1Cookie < 1 && if cookieJar2Cookie < 1
    // then say "Give me cookies"
    // else remove cookie monster, so you can walk past (in new level plan)
    const newState = new State(
      state.level,
      state.actors,
      state.status,
      state.miniGameStatus,
      state.cookieJar1Cookie,
      state.cookieJar2Cookie
    );
    if (state.cookieJar1Cookie < 1 || state.cookieJar2Cookie < 1) {
      document.getElementById("text").textContent = "Give me cookies!";
    } else if (state.cookieJar1Cookie >= 1 && state.cookieJar2Cookie >= 1) {
      document.getElementById("text").textContent = "So, long!";
      newState.level = new levelConstructor(levelPlans[1]);
    }

    return newState;
  }
}

CookieMonster.prototype.size = new Vec(1, 1);

module.exports = CookieMonster;
