const Vec = require("./vector");
const BlockJumpGame = require("./blockJumpGame");
const State = require("./state");

// The increment value of the state.cookieJarCookie
// If cookie jar counts is an array on state?
// Here it could be another instance variable?
// each cookieJar stores it's own cookie count and cookie monster makes decisions based on
// state.actors.type == cookieJar each

class CookieJar {
  constructor(
    pos,
    speed,
    MiniGameConsturctor,
    storedState = null,
    cookies = 0
  ) {
    this.pos = pos;
    this.speed = speed;
    this.MiniGameConsturctor = MiniGameConsturctor;
    this.storedState = storedState;
    this.cookies = cookies;
  }

  get type() {
    return "cookieJar";
  }

  static create(pos, MiniGameConsturctor) {
    return new CookieJar(pos, new Vec(0, 0), MiniGameConsturctor);
  }

  // update(time, state, keys) {
  //   return new CookieJar(
  //     this.pos,
  //     this.speed,
  //     this.MiniGameConstructor,
  //     this.storedState,
  //     this.cookies
  //   );
  // }

  collide(state) {
    if (state.miniGameStatus == null) {
      this.storedState = new State(
        state.level,
        state.actors,
        state.status,
        "playing"
        // state.cookieJarCookie,
        // state.cookieJar2Cookie
      );
      const miniGame = new this.miniGame();
      const callbackFunction = (result) => {
        if (result === "Lost") {
          let newState = new State(
            state.level,
            state.actors,
            state.status,
            "Lost"
            // state.cookieJarCookie,
            // state.cookieJar2Cookie
          );
          this.storedState = newState;
        } else if (result === "Won") {
          let newState = new State(
            state.level,
            state.actors,
            state.status,
            "Won"
            // state.cookieJarCookie,
            // state.cookieJar2Cookie
          );
          this.cookies += 1;
          this.storedState = newState;
        }
      };
      miniGame.run(callbackFunction);
    }
    return this.storedState;
  }
}

CookieJar.prototype.size = new Vec(1, 1);

module.exports = CookieJar;
