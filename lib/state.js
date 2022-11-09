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
    // look at the miniGameStatus of cookieJar1 before updates
    let actors = this.actors.map((actor) => actor.update(time, this, keys));
    let newState = new State(
      this.level,
      actors,
      this.status,
      this.miniGameStatus
    );
    if (newState.status != "playing") return newState;

    let player = newState.player;

    for (let actor of actors) {
      if (actor != player && this.overlap(actor, player)) {
        newState = actor.collide(newState);
      }
    }

    console.log(actors);
    const cookieJar1 = this.actors.find((actor) => actor.type == "cookieJar1");
    console.log(cookieJar1);
    const cookieJar2 = this.actors.find((actor) => actor.type == "cookieJar2");
    console.log(cookieJar2);
    if (
      !this.overlap(cookieJar1, player) &&
      !this.overlap(cookieJar2, player) &&
      (newState.miniGameStatus == "Won" || newState.miniGameStatus == "Lost")
    ) {
      newState.miniGameStatus = null;
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
    console.log(actor1, actor2);
    return (
      actor1.pos.x + actor1.size.x > actor2.pos.x &&
      actor1.pos.x < actor2.pos.x + actor2.size.x &&
      actor1.pos.y + actor1.size.y > actor2.pos.y &&
      actor1.pos.y < actor2.pos.y + actor2.size.y
    );
  };
}

module.exports = State;
