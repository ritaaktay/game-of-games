const Vec = require("./vector");
const BlockJumpGame = require("./blockJumpGame");
const State = require("./state");
const DumbMiniGame = require("./dumbMiniGame");

class CookieJar {
  constructor(pos, speed) {
    this.pos = pos;
    this.speed = speed;
    this.updatedState = null;
  }

  get type() {
    return "cookieJar";
  }

  static create(pos) {
    return new CookieJar(pos, new Vec(0, 0));
  }

  update(time, state, keys) {
    // Cookie jar never moves
    return new CookieJar(this.pos, this.speed);
  }

  collide(state) {
    // disable arrow keys so player can no longer move

    // if there is a mini-game already hapenning
    // check status (return this.updatedState, which should be modified by the callback)
    // if not (if first collision), create new mini game
    console.log("222222222");

    this.updatedState = new State(
      state.level,
      state.actors,
      state.status,
      state.miniGameStatus
    );

    console.log(state.miniGameStatus);
    if (state.miniGameStatus == null) {
      console.log("333333333");
      this.updatedState = new State(
        state.level,
        state.actors,
        state.status,
        "playing"
      );
      const dumbMiniGame = new DumbMiniGame();
      const callbackFunction = (result) => {
        if (result === "Lost") {
          console.log("5555555555");
          mainGameBackground.style.backgroundColor = "red";
          let newState = new State(
            state.level,
            state.actors,
            state.status,
            "Lost"
          );
          this.updatedState = newState;
          //re-enable arrow keys
        } else if (result === "Won") {
          console.log("4444444444");
          mainGameBackground.style.backgroundColor = "green";
          let newState = new State(
            state.level,
            state.actors,
            state.status,
            "Won"
          );
          this.updatedState = newState;
          //re enable arrow keys
        }
      };
      dumbMiniGame.run(callbackFunction);
    }
    // rather than waiting for the game to finish, keep returning
    // newState with each update, sometimes it will be the unmodified state
    // and at one point, when the game is done, it will be the updated state
    return this.updatedState;
  }
}

CookieJar.prototype.size = new Vec(1, 1);

module.exports = CookieJar;
