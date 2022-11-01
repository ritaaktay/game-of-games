const { run } = require("jest");
const State = require("./state");

class Game {
  constructor(level, Display) {
    this.level = level;
    this.display = new Display(document.body, level);
    this.state = State.start(level);
    this.arrowKeys = this.display.trackKeys([
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
    ]);
  }

  run() {
    this.#runAnimation(this.#updateFrame);
  }

  /**
   * This function computes a new state,
   * syncs the display and returns a boolean
   * true for still playing false for won/lost
   */
  #updateFrame = (time) => {
    state = state.update(time, this.arrowKeys);
    this.display.syncState(this.state);
    if (state.status == "playing") {
      return true;
    } else {
      display.clear();
      resolve(state.status);
      return false;
    }
  };

  /**
   * This function syncs the timing of the browsers refresh rate
   * to the timing inside the game, so there are no glitches
   */
  #runAnimation(updateFrameFunction) {
    let lastTime = null;
    function frame(time) {
      if (lastTime != null) {
        let timeStep = Math.min(time - lastTime, 100) / 1000;
        // Does not update animation if won/lost
        if (updateFrameFunction(timeStep) === false) return;
      }
      lastTime = time;
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
}
