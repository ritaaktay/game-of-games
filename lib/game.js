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
    this.#runAnimation(this.#updateFrame);
  }

  #updateFrame = (time) => {
    this.state = this.state.update(time, this.arrowKeysTracker);
    this.display.syncState(this.state);
  };

  #runAnimation(updateFrame) {
    let lastTime = null;
    function frame(time) {
      if (lastTime != null) {
        let timeStep = Math.min(time - lastTime, 100) / 1000;
        updateFrame(timeStep);
      }
      lastTime = time;
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

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
