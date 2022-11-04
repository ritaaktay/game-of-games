class State {
  constructor(level, actors, status, miniGameStatus = null) {
    this.level = level;
    this.actors = actors;
    this.status = status;
    this.miniGameStatus = miniGameStatus;
  }

  static start(level) {
    return new State(level, level.startActors, "playing");
  }

  get player() {
    return this.actors.find((a) => a.type == "player");
  }

  /**
   *
   * @param {*} time is the timestep that has passed
   * @param {*} keys are the keys that have been pressed
   * @returns a newState computed from these factors
   * It calls the update method on all actors
   */
  update = function (time, keys) {
    let actors = this.actors.map((actor) => actor.update(time, this, keys));
    let newState = new State(
      this.level,
      actors,
      this.status,
      this.miniGameStatus
    );

    if (newState.status != "playing") return newState;

    // if they are not colliding and miniGame status is Won / Lost
    // make it null

    let player = newState.player;

    const cookieJar = this.actors.find((actor) => actor.type == "cookieJar");
    if (
      !this.overlap(cookieJar, player) &&
      (newState.miniGameStatus == "Won" || newState.miniGameStatus == "Lost")
    ) {
      newState.miniGameStatus = null;
    }

    for (let actor of actors) {
      if (actor != player && this.overlap(actor, player)) {
        newState = actor.collide(newState);
      }
    }

    return newState;
  };

  /**
   *
   * @param {actor} actor1
   * @param {actor} actor2
   * @returns a boolean representing whether the tow actors are overlapping
   */
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
