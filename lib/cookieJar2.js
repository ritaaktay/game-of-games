const Vec = require("./vector");
const MatrixGame = require("./matrixGame");
const State = require("./state");

// What is different between the two cookie jars?
// The dependency injection
// Poor mans dependency injection:
// Don't have a default, actually pass it in to the constructor somewhere
// The increment value of the state.cookieJarCookie
// If cookie jar counts is an array on state?
// Here it could be another instance variable?

class CookieJar2 {
  constructor(pos, speed, updatedState = null, miniGame = MatrixGame) {
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
          newState.cookieJar2Cookie += 1;
          this.updatedState = newState;
        }
      };
      miniGame.run(callbackFunction, this);
    }
    return this.updatedState;
  }
}

CookieJar2.prototype.size = new Vec(1, 1);

module.exports = CookieJar2;
