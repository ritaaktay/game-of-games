const State = require("./state");

class Game {
  constructor(level, Display) {
    this.level = level;
    this.display = new Display(document.body, level);
    this.state = State.start(level);
    this.arrowKeysTracker = this.display.trackKeys([
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
    // update the game state to correspond to how much time has passed
    // console.log(this.arrowKeysTracker); // to see how the arrowKeysTracker are tracked
    this.state = this.state.update(time, this.arrowKeysTracker);
    this.display.syncState(this.state);
    if (this.state.status == "playing") {
      return true;
    } else {
      display.clear();
      // resolve(this.state.status);
      return false;
    }
  };

  /**
   * This function syncs the timing of the browsers refresh rate
   * to the timing inside the game, so there are no glitches
   */
  #runAnimation(updateFrameFunction) {
    //the last frame() called
    let lastTime = null;
    function frame(time) {
      // if there was a last time
      if (lastTime != null) {
        // see how long it has been since that last time
        // timeStep = how long it's been since last time
        let timeStep = Math.min(time - lastTime, 100) / 1000;
        // call updateFrameFunction(timeStep)
        // Does not update animation if won/lost
        if (updateFrameFunction(timeStep) === false) return;
      }
      // as long as we are still playing
      // set last time to now, for the next time to know
      lastTime = time;
      // ask the browser to do it all over again when it has a moment
      requestAnimationFrame(frame);
    }
    //pass frame() to requestAnimationFrame
    //tells browser to do frame() when it has a moment
    requestAnimationFrame(frame);
  }
}

module.exports = Game;
