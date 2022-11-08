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
    console.log("COOKIE JAR 1 COLLIDE STATE ARGUMENT", state.miniGameStatus);
    if (state.miniGameStatus == null) {
      console.log("COOKIE JAR 1 IS MAKING A NEW MINI GAME");
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
          console.log("COOKIE JAR 1 LOST CALLBACK");
          this.updatedState = newState;
        } else if (result === "Won") {
          let newState = new State(
            state.level,
            state.actors,
            state.status,
            "Won"
          );
          console.log("COOKIE JAR 1 WON CALLBACK");
          this.updatedState = newState;
        }
      };
      miniGame.run(callbackFunction);
    }
    console.log(
      `COOKIE JAR 1 RETURNING COLLIDE`,
      this.updatedState.miniGameStatus
    );
    return this.updatedState;
  }
}

CookieJar1.prototype.size = new Vec(1, 1);

module.exports = CookieJar1;
