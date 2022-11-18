const Vec = require("./vector");
const State = require("./state");
const levelPlans = require("./levelPlans");

class CookieMonster {
  constructor(pos, speed) {
    this.pos = pos;
    this.speed = speed;
  }

  get type() {
    return "cookieMonster";
  }

  static create(pos) {
    return new CookieMonster(pos, new Vec(0, 0));
  }

  collide(state, Level) {
    let newState = new State(
      state.level,
      state.actors,
      state.status,
      state.miniGameStatus
    );

    newState = this.#checkCookies(newState, Level);
    return newState;
  }

  #checkCookies(state, Level) {
    if (state.cookieJars.every((cj) => cj.cookies < 1)) {
      this.#speak("Give me cookies!");
    } else if (state.cookieJars.some((cj) => cj.cookies < 1)) {
      this.#speak(
        `Give me more cookies! You have: ${"🍪".repeat(state.cookieCount)}`
      );
    } else {
      this.#speak("Mmmm delicious! Now, escape before it's too late!");
      // TO DO: how not to have level constructors in the actors?
      // state.status = "past", "escaped" etc according to that
      // state manages new level plans at each update?
      // TO DO: export levelPlans as key value pairs so you can access
      // levelPlans.noMonster , levelPlans.win, levelPlans.mvp etc
      state.level = new levelConstructor(levelPlans[1]);
    }
    return state;
  }

  #speak(message) {
    document.getElementById("text").textContent = message;
  }
}

CookieMonster.prototype.size = new Vec(1, 1);

module.exports = CookieMonster;
