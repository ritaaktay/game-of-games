class State {
  constructor(level, actors, status = "playing", miniGameStatus = null) {
    this.level = level;
    this.actors = actors;
    this.status = status;
    this.miniGameStatus = miniGameStatus;
  }

  static start(level) {
    return new State(level, level.startActors);
  }

  get player() {
    return this.actors.find((a) => a.type == "player");
  }

  get cookieJars() {
    return this.actors.filter((actor) => actor.type == "cookieJar");
  }

  get cookieCount() {
    return this.cookieJars.map((cj) => cj.cookies).reduce((a, b) => a + b);
  }

  update = function (time, keys, levelConstructor) {
    let actors = this.actors;
    if (this.miniGameStatus != "playing") {
      actors = this.actors.map((actor) => {
        if (actor.type == "player") return actor.update(time, this, keys);
      });
    }
    let newState = new State(
      this.level,
      actors,
      this.status,
      this.miniGameStatus
    );

    let player = newState.player;
    for (let actor of actors) {
      if (actor != player && this.overlap(actor, player)) {
        newState = actor.collide(newState, levelConstructor);
      }
    }

    if (this.resetMiniGameStatus(newState, player))
      newState.miniGameStatus = null;

    return newState;
  };

  resetMiniGameStatus = (state, player) => {
    // loop over all cookie jars in level
    // after refactoring cookie jar dependency
    const cookieJar1 = this.actors.find((actor) => actor.type == "cookieJar1");
    const cookieJar2 = this.actors.find((actor) => actor.type == "cookieJar2");
    return (
      cookieJar1 != undefined &&
      cookieJar2 != undefined &&
      !this.overlap(cookieJar1, player) &&
      !this.overlap(cookieJar2, player) &&
      (state.miniGameStatus == "Won" || state.miniGameStatus == "Lost")
    );
  };

  overlap = function (actor1, actor2) {
    return (
      actor1.pos.x + actor1.size.x > actor2.pos.x &&
      actor1.pos.x < actor2.pos.x + actor2.size.x &&
      actor1.pos.y + actor1.size.y > actor2.pos.y &&
      actor1.pos.y < actor2.pos.y + actor2.size.y
    );
  };
}

module.exports = State;
