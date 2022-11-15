const Vec = require("./vector");
const BlockJumpGame = require("./blockJumpGame");
const State = require("./state");

// What is different between the two cookie jars?
// The dependency injection
// Poor mans dependency injection:
// Don't have a default, actually pass it in to the constructor somewhere
//
// The increment value of the state.cookieJarCookie
// If cookie jar counts is an array on state?
// Here it could be another instance variable?

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
        "playing",
        state.cookieJar1Cookie,
        state.cookieJar2Cookie
      );
      const miniGame = new this.miniGame();
      const callbackFunction = (result) => {
        if (result === "Lost") {
          let newState = new State(
            state.level,
            state.actors,
            state.status,
            "Lost",
            state.cookieJar1Cookie,
            state.cookieJar2Cookie
          );
          this.updatedState = newState;
        } else if (result === "Won") {
          let newState = new State(
            state.level,
            state.actors,
            state.status,
            "Won",
            state.cookieJar1Cookie,
            state.cookieJar2Cookie
          );
          newState.cookieJar1Cookie += 1;
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
