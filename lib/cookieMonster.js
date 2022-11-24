const Vec = require("./vector");
const State = require("./state");

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

  collide(state) {
    let newState = new State(
      state.level,
      state.actors,
      state.status,
      state.miniGameStatus
    );

    newState = this.#checkCookies(newState);
    return newState;
  }

  #checkCookies(state) {
    if (state.cookieJars.every((cj) => cj.cookies < 1)) {
      this.#speak("Give me cookies!");
    } else if (state.cookieJars.some((cj) => cj.cookies < 1)) {
      this.#speak(
        `Give me more cookies! You have: ${"🍪".repeat(state.cookieCount)}`
      );
    } else {
      this.#speak("Mmmm delicious! Now, escape before it's too late!");
      state.level = state.level.switch("pass");
    }
    return state;
  }

  #speak(message) {
    document.getElementById("text").textContent = message;
  }
}

CookieMonster.prototype.size = new Vec(1, 1);

module.exports = CookieMonster;
