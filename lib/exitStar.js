const Vec = require("./vector");
const State = require("./state");
const levelPlans = require("./levelPlans");

class ExitStar {
  constructor(pos, speed) {
    this.pos = pos;
    this.speed = speed;
  }

  get type() {
    return "exitStar";
  }

  static create(pos) {
    return new ExitStar(pos, new Vec(0, 0));
  }

  update(time, state, keys) {
    return new ExitStar(this.pos, this.speed);
  }

  collide(state, levelConstructor) {
    const newState = new State(
      state.level,
      state.actors,
      state.status,
      state.miniGameStatus,
      state.cookieJar1Cookie,
      state.cookieJar2Cookie
    );

    document.getElementById("text").textContent = "You escaped!";

    newState.level = new levelConstructor(levelPlans[2]);
    newState.actors = newState.level.startActors;
    newState.status = "Won";
    return newState;
  }
}

ExitStar.prototype.size = new Vec(1, 1);

module.exports = ExitStar;
