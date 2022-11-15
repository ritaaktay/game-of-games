class State {
  constructor(
    level,
    actors,
    status,
    miniGameStatus = null,
    cookieJar1Cookie = 0,
    cookieJar2Cookie = 0
  ) {
    this.level = level;
    this.actors = actors;
    this.status = status;
    this.miniGameStatus = miniGameStatus;
    this.cookieJar1Cookie = cookieJar1Cookie;
    this.cookieJar2Cookie = cookieJar2Cookie;
  }

  static start(level) {
    return new State(level, level.startActors, "playing");
  }

  get player() {
    return this.actors.find((a) => a.type == "player");
  }

  update = function (time, keys, levelConstructor) {
    let actors = this.actors;
    if (this.miniGameStatus != "playing") {
      actors = this.updateActors(time, keys);
    }
    let newState = new State(
      this.level,
      actors,
      this.status,
      this.miniGameStatus,
      this.cookieJar1Cookie,
      this.cookieJar2Cookie
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

  updateActors = (time, keys) => {
    return this.actors.map((actor) => actor.update(time, this, keys));
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
