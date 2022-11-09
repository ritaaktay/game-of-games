const Vec = require("./vector");
const BlockJumpGame = require("./blockJumpGame");
const State = require("./state");

// CookieJar1 activates mini-game BlockJumpGame
class CookieJar1 {
  constructor(
    pos,
    speed,
    updatedState = null,
    miniGame = BlockJumpGame,
    objectId = {
      map: new WeakMap(),
      count: 0,
    }
  ) {
    this.pos = pos;
    this.speed = speed;
    this.updatedState = updatedState;
    this.miniGame = miniGame;
    this.objectId = objectId;
    this.getObjectId(this);
  }

  get type() {
    return "cookieJar1";
  }

  static create(pos) {
    return new CookieJar1(pos, new Vec(0, 0));
  }

  getObjectId(object) {
    if (!this.objectId.map.has(object)) {
      this.objectId.map.set(object, ++this.objectId.count);
    }
    console.log(this.objectId.map.get(object));
  }

  update(time, state, keys) {
    console.log(
      "COOKIE JAR 1 state.miniGameStatus of state passed to update():",
      state.miniGameStatus
    );
    return new CookieJar1(
      this.pos,
      this.speed,
      this.updatedState,
      this.miniGame,
      this.objectId
    );
  }

  collide(state) {
    console.log("COOKIE JAR 1 COLLIDE STATE ARGUMENT", state.miniGameStatus);
    if (this.updatedState != null) {
      console.log(
        `COOKIE JAR 1 COLLIDE UPDATED STATE AT BEGINNING OF COLLIDE`,
        this.updatedState.miniGameStatus
      );
    }
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
          this.updatedState = newState;
          console.log(
            "COOKIE JAR 1 WON CALLBACK:",
            this.updatedState.miniGameStatus
          );
        }
      };
      miniGame.run(callbackFunction);
    }
    if (this.updatedState != null) {
      console.log(
        `COOKIE JAR 1 RETURNING COLLIDE`,
        this.updatedState.miniGameStatus
      );
    }
    return this.updatedState;
  }
}

CookieJar1.prototype.size = new Vec(1, 1);

module.exports = CookieJar1;
