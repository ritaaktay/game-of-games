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
}

module.exports = State;
