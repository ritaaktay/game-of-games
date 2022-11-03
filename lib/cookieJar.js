const Vec = require("./vector");
const BlockJumpGame = require("./blockJumpGame");
const State = require("./state");
const DumbMiniGame = require("./dumbMiniGame");

class CookieJar {
  constructor(pos, speed, updatedState = null) {
    this.pos = pos;
    this.speed = speed;
    // now this is persistant
    this.updatedState = updatedState;
  }

  get type() {
    return "cookieJar";
  }

  static create(pos) {
    return new CookieJar(pos, new Vec(0, 0));
  }

  update(time, state, keys) {
    // Cookie jar never moves
    return new CookieJar(this.pos, this.speed, this.updatedState);
  }

  collide(state) {
    // disable arrow keys so player can no longer move

    // if there is a mini-game already hapenning
    // check status (return this.updatedState, which should be modified by the callback)
    // if not (if first collision), create new mini game
    console.log("222222222");

    // make sure we return a non-updated state
    // for all collide() calls where no one has yet pressed a button
    // what changed? nothing changed.

    // is there a way to return the current state without overriding
    // the state as it is updated by the callback

    //if we know that state IS ALWAYS GOING TO BE THE SAME UNLESS THE CALLBACK IS CALLED
    //maybe we can keep it as a single state object rather than create a new one each time?

    // this.updatedState = new State(
    //   state.level,
    //   state.actors,
    //   state.status,
    //   state.miniGameStatus
    // ); //2

    // if we can confirm that collide() will be called only when:
    // miniGameStatus is null
    // or playing

    console.log(`CookieJar.collide: ${state.miniGameStatus}`);
    if (state.miniGameStatus == null) {
      // store the state object, leave it there, don't touch it
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
          // mainGameBackground.style.backgroundColor = "red";
          let newState = new State(
            state.level,
            state.actors,
            state.status,
            "Lost"
          );
          //touch it only when something changes
          this.updatedState = newState;
          console.log(`CookieJar: ${this}`);
          //re-enable arrow keys
        } else if (result === "Won") {
          console.log("5555555555");
          // mainGameBackground.style.backgroundColor = "green";
          let newState = new State(
            state.level,
            state.actors,
            state.status,
            "Won"
          );
          //touch it only when something changes
          this.updatedState = newState;
          console.log(`CookieJar: ${this}`); //1
          //re enable arrow keys
        }
      };
      dumbMiniGame.run(callbackFunction);
    }
    // rather than waiting for the game to finish, keep returning
    // newState with each update, sometimes it will be the unmodified state
    // and at one point, when the game is done, it will be the updated state
    console.log(`collide() updatedState: ${this.updatedState}`);
    // return the state object
    return this.updatedState; //3
  }
}

CookieJar.prototype.size = new Vec(1, 1);

module.exports = CookieJar;
