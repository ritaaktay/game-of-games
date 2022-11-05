/**
 * @jest-environment jsdom
 */
const Game = require("../lib/game");
const DOMDisplay = require("../lib/DOMDisplay");
const Level = require("../lib/level");
const State = require("../lib/state");
const levelPlans = require("../lib/levelPlans");
const { default: JSDOMEnvironment } = require("jest-environment-jsdom");
jest.mock("../lib/DOMDisplay.js");

describe("Game", () => {
  it("has a level, a display, a state and an arrow keys tracker", () => {
    const level = new Level(levelPlans[0]);
    const game = new Game(level, DOMDisplay);
    expect(game.level).toEqual(level);
    expect(game.display instanceof DOMDisplay).toBe(true);
    expect(game.state instanceof State).toEqual(true);
    expect(game.state.level).toEqual(level);
    expect(game.arrowKeysTracker).toEqual({});
  });

  it("runs the game", () => {
    const level = new Level(levelPlans[0]);
    const game = new Game(level, DOMDisplay);
    const spy = jest.spyOn(window, "requestAnimationFrame");
    game.run();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
