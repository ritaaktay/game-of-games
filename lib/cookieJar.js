const Vec = require("./vector");
const State = require("./state");

class CookieJar {
  constructor(pos, speed, miniGameLocator, storedState = null, cookies = 0) {
    this.pos = pos;
    this.speed = speed;
    this.MiniGameConsturctor = miniGameLocator.getGame();
    this.storedState = storedState;
    this.cookies = cookies;
  }

  get type() {
    return "cookieJar";
  }

  static create(pos, miniGameLocator) {
    return new CookieJar(pos, new Vec(0, 0), miniGameLocator);
  }

  collide(state) {
    if (state.miniGameStatus == null) {
      this.storedState = new State(
        state.level,
        state.actors,
        state.status,
        "playing"
      );
      const miniGame = new this.MiniGameConsturctor();
      miniGame.run(this.miniGameCallback);
    }
    return this.storedState;
  }

  miniGameCallback = (result) => {
    if (result === "lost") {
      this.storedState.miniGameStatus = "lost";
    } else if (result === "won") {
      this.cookies += 1;
      this.storedState.miniGameStatus = "won";
    }
  };
}

CookieJar.prototype.size = new Vec(1, 1);

module.exports = CookieJar;
