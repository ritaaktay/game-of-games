const Vec = require("./vector");
const BlockJumpGame = require("./blockJumpGame");
const State = require("./state");

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

  collide(state) {
    if (state.miniGameStatus == null) {
      this.storedState = new State(
        state.level,
        state.actors,
        state.status,
        "playing"
      );
      const miniGame = new this.miniGame();
      const callbackFunction = (result) => {
        if (result === "lost") {
          let newState = new State(
            state.level,
            state.actors,
            state.status,
            "lost"
          );
          this.storedState = newState;
        } else if (result === "won") {
          let newState = new State(
            state.level,
            state.actors,
            state.status,
            "won"
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
