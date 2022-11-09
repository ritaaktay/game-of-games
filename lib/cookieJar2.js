const Vec = require("./vector");
const BlockJumpGame = require("./blockJumpGame");
const State = require("./state");

class CookieJar2 {
  constructor(pos, speed, updatedState = null, miniGame = BlockJumpGame) {
    this.pos = pos;
    this.speed = speed;
    this.updatedState = updatedState;
    this.miniGame = miniGame;
  }

  get type() {
    return "cookieJar2";
  }

  static create(pos) {
    return new CookieJar2(pos, new Vec(0, 0));
  }

  update(time, state, keys) {
    return new CookieJar2(
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

CookieJar2.prototype.size = new Vec(1, 1);

module.exports = CookieJar2;
