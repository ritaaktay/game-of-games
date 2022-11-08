const Vec = require("./vector");
const BlockJumpGame = require("./blockJumpGame");
const State = require("./state");

// CookieJar1 activates mini-game BlockJumpGame
class CookieJar1 {
  constructor(pos, speed, updatedState = null, miniGame = BlockJumpGame) {
    this.pos = pos;
    this.speed = speed;
    this.updatedState = updatedState;
    this.miniGame = miniGame;
  }

  get type() {
    return "cookieJar1";
  }

  static create(pos) {
    return new CookieJar1(pos, new Vec(0, 0));
  }

  update(time, state, keys) {
    return new CookieJar1(
      this.pos,
      this.speed,
      this.updatedState,
      this.miniGame
    );
  }

  collide(state) {
    if (state.miniGameStatus == null) {
      this.updatedState = new State(
        state.level,
        state.actors,
        state.status,
        "playing"
      );
      const miniGame = new this.miniGame();
      const callbackFunction = (result) => {
        if (result === "Lost") {
          let newState = new State(
            state.level,
            state.actors,
            state.status,
            "Lost"
          );
          this.updatedState = newState;
        } else if (result === "Won") {
          let newState = new State(
            state.level,
            state.actors,
            state.status,
            "Won"
          );
          this.updatedState = newState;
        }
      };
      miniGame.run(callbackFunction);
    }
    return this.updatedState;
  }
}

CookieJar1.prototype.size = new Vec(1, 1);

module.exports = CookieJar1;
