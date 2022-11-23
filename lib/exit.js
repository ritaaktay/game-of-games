const Vec = require("./vector");
const State = require("./state");
const levelPlans = require("./levelPlans");

class Exit {
  constructor(pos, speed) {
    this.pos = pos;
    this.speed = speed;
  }

  get type() {
    return "exit";
  }

  static create(pos) {
    return new Exit(pos, new Vec(0, 0));
  }

  collide(state, levelConstructor) {
    const newState = new State(
      state.level,
      state.actors,
      state.status,
      state.miniGameStatus
    );

    this.#speak(message);
    newState.level = newState.level.switch("escape");
    newState.actors = newState.level.startActors;
    newState.status = "won";
    return newState;
  }

  #speak(message) {
    document.getElementById("text").textContent = message;
  }
}

Exit.prototype.size = new Vec(1, 1);

module.exports = Exit;
