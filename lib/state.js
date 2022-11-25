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

  update = function (time, keys) {
    let newState = new State(
      this.level,
      this.actors,
      this.status,
      this.miniGameStatus
    );

    newState = this.#updatePlayer(newState, time, keys);
    newState = this.#resetMiniGameStatus(newState);
    newState = this.#checkCollisions(newState);

    return newState;
  };

  #checkCollisions(state) {
    for (let actor of state.actors) {
      if (actor != state.player && this.checkOverlap(actor, state.player)) {
        return actor.collide(state);
      }
    }
    return state;
  }

  #updatePlayer(state, time, keys) {
    if (state.miniGameStatus != "playing") {
      state.actors = state.actors.map((actor) => {
        return actor.type == "player" ? actor.update(time, state, keys) : actor;
      });
    }
    return state;
  }

  #resetMiniGameStatus = (state) => {
    if (
      state.cookieJars.every((cj) => !this.checkOverlap(cj, state.player)) &&
      (state.miniGameStatus == "won" || state.miniGameStatus == "lost")
    ) {
      state.miniGameStatus = null;
    }
    return state;
  };

  checkOverlap = function (actor1, actor2) {
    return (
      actor1.pos.x + actor1.size.x > actor2.pos.x &&
      actor1.pos.x < actor2.pos.x + actor2.size.x &&
      actor1.pos.y + actor1.size.y > actor2.pos.y &&
      actor1.pos.y < actor2.pos.y + actor2.size.y
    );
  };
}

module.exports = State;
