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
    // check status
    // if not (if first collision), create new mini game
    this.updatedState = new State(
      state.level,
      state.actors,
      state.status,
      state.miniGameStatus
    );
    // doing nothing

    if (state.miniGameStatus == null) {
      this.updatedState = new State(
        state.level,
        state.actors,
        state.status,
        "playing"
      );
      const dumbMiniGame = new DumbMiniGame();
      const callbackFunction = (result) => {
        if (result === "Lost") {
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
    // takes time and has to be async (wait for the game to finish)
    // initiatie a mini game, wait for it, watch it's result
    // calculate a new state based on result, return it

    // rather than waiting for the game to finish, keep returning
    // newState with each update, sometimes it will be the unmodified state
    // and at one point, when the game is done, it will be the updated state
    return this.updatedState;
  }
}

CookieJar.prototype.size = new Vec(1, 1);

module.exports = CookieJar;
