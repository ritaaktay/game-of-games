class State {
  constructor(level, actors, status = "playing", miniGameStatus = null) {
    this.level = level;
    this.actors = actors;
    console.log(this.actors);
    this.status = status;
    this.miniGameStatus = miniGameStatus;
  }

  static start(level) {
    return new State(level, level.startActors);
  }

  get player() {
    console.log(this.actors);
    return this.actors.find((a) => a.type == "player");
  }

  get cookieJars() {
    return this.actors.filter((actor) => actor.type == "cookieJar");
  }

  get cookieCount() {
    return this.cookieJars.map((cj) => cj.cookies).reduce((a, b) => a + b);
  }

  // TO DO: refactor
  update = function (time, keys, levelConstructor) {
    let actors = this.actors;
    // update only if playing and update only player
    if (this.miniGameStatus != "playing") {
      actors = this.actors.map((actor) => {
        if (actor.type == "player") return actor.update(time, this, keys);
        return actor;
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

    newState = this.#resetMiniGameStatus(state, player);

    return newState;
  };

  #resetMiniGameStatus = (state, player) => {
    if (
      state.cookieJars.every((cj) => !this.#overlap(cj, player)) &&
      (state.miniGameStatus == "won" || state.miniGameStatus == "lost")
    ) {
      state.miniGameStatus = null;
    }
    return state;
  };

  #overlap = function (actor1, actor2) {
    return (
      actor1.pos.x + actor1.size.x > actor2.pos.x &&
      actor1.pos.x < actor2.pos.x + actor2.size.x &&
      actor1.pos.y + actor1.size.y > actor2.pos.y &&
      actor1.pos.y < actor2.pos.y + actor2.size.y
    );
  };
}

module.exports = State;
