const Vec = require("./vector");
const BlockJumpGame = require("./blockJumpGame");
// const DumbMiniGame = require("./dumbMiniGame");
const State = require("./state");

// CookieJar2 activates mini-game SpaceShooterGame
class CookieJar2 {
  // Replace BlockJumpGame when SpaceShooterGame is ready for integration
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
    console.log("COOKIE JAR 2 COLLIDE");
    // return state;
    if (state.miniGameStatus == null) {
      console.log("COOKIE JAR 2 IS MAKING A NEW MINI GAME");
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
          console.log("COOKIE JAR 2 LOST CALLBACK");
        } else if (result === "Won") {
          let newState = new State(
            state.level,
            state.actors,
            state.status,
            "Won"
          );
          console.log("COOKIE JAR 2 WON CALLBACK");
          this.updatedState = newState;
        }
      };
      console.log(
        `COOKIE JAR 2 RETURNING COLLIDE`,
        this.updatedState.miniGameStatus
      );
      miniGame.run(callbackFunction);
    }

    return this.updatedState;
  }
}

CookieJar2.prototype.size = new Vec(1, 1);

module.exports = CookieJar2;
