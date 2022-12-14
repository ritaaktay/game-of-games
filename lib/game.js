const State = require("./state");

class Game {
  constructor(level, Display) {
    this.level = level;
    this.display = new Display(document.body, level);
    this.state = State.start(level);
    this.arrowKeysTracker = this.#trackKeys([
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
    ]);
  }

  run() {
    this.#runAnimation();
  }

  #runAnimation() {
    let lastTime = null;
    const animationCallback = (time) => {
      if (lastTime != null) {
        let timeStep = Math.min(time - lastTime, 100) / 1000;
        this.#updateFrame(timeStep);
      }
      lastTime = time;
      requestAnimationFrame(animationCallback);
    };
    requestAnimationFrame(animationCallback);
  }

  #updateFrame = (time) => {
    this.state = this.state.update(time, this.arrowKeysTracker);
    this.display.syncState(this.state);
  };

  #trackKeys(keys) {
    let down = Object.create(null);
    function track(event) {
      if (keys.includes(event.key)) {
        down[event.key] = event.type == "keydown";
        event.preventDefault();
      }
    }
    window.addEventListener("keydown", track);
    window.addEventListener("keyup", track);
    return down;
  }
}

module.exports = Game;
