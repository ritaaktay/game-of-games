class State {
  constructor(level, actors, status) {
    this.level = level;
    this.actors = actors;
    this.status = status;
  }

  /**
   *  Static methods are called on the class itself, not on instances. See:
   *  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/static#:~:text=Static%20methods%20are%20often%20utility,to%20be%20replicated%20across%20instances.
   */
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
    let newState = new State(this.level, actors, this.status);

    if (newState.status != "playing") return newState;

    //here we can check if player toches any background element or actors
    //(using overlap) and return a new state accordingly
    // ex. a monster or object that triggers different next states

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
