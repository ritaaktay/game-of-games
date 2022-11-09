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
    return this.objectId.map.get(object);
  }

  update(time, state, keys) {
    return new CookieJar1(
      this.pos,
      this.speed,
      this.updatedState,
      this.miniGame,
      this.objectId
    );
  }

  collide(state) {
    console.log("COOKIE JAR COLLIDE STATE ARGUMENT", state.miniGameStatus);
    if (state.miniGameStatus == null) {
      console.log("COOKIE JAR 1 IS MAKING A NEW MINI GAME");
      this.updatedState = new State(
        state.level,
        state.actors,
        state.status,
        "playing"
      );
      const miniGame = new this.miniGame(this.getObjectId(this));
      console.log(
        "COOKIE JAR ID FOR CALLBACK AT MINI GAME INITIALIZATION",
        this.getObjectId(this)
      );
      const callbackFunction = (result) => {
        if (result === "Lost") {
          let newState = new State(
            state.level,
            state.actors,
            state.status,
            "Lost"
          );
          this.updatedState = newState;
          console.log(
            "COOKIE JAR ID FOR CALLBACK AT EXECUTION",
            this.getObjectId(this)
          );
        } else if (result === "Won") {
          let newState = new State(
            state.level,
            state.actors,
            state.status,
            "Won"
          );
          this.updatedState = newState;
          console.log(
            "COOKIE JAR ID FOR CALLBACK AT EXECUTION",
            this.getObjectId(this)
          );
        }
      };
      miniGame.run(callbackFunction, this);
    }
    if (this.updatedState != null) {
      console.log(
        `COOKIE JAR RETURNING COLLIDE`,
        this.updatedState.miniGameStatus
      );
    }
    return this.updatedState;
  }
}

CookieJar1.prototype.size = new Vec(1, 1);

module.exports = CookieJar1;
