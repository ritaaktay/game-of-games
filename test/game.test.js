/**
 * @jest-environment jsdom
 */
const Game = require("../lib/game");
const DOMDisplay = require("../lib/DOMDisplay");
const Level = require("../lib/level");
const State = require("../lib/state");
const levelPlans = require("../lib/levelPlans");
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
    spy.mockClear();
  });

  it("runs the game with recursive calls to requestAnimationFrame", () => {
    const level = new Level(levelPlans[0]);
    const game = new Game(level, DOMDisplay);
    const mockRequestAnimationFrame = jest.spyOn(
      window,
      "requestAnimationFrame"
    );
    mockRequestAnimationFrame.mockImplementationOnce((callback) => {
      callback(Date.now());
    });
    game.run();
    game.state.status = "won";
    expect(mockRequestAnimationFrame).toHaveBeenCalledTimes(2);
  });

  // how to mock keydown and keyup events to test trackKeys functionality?

  // how to mock requestAnimationFrame() being called by the browser to mock recursion?
  // (also change state.status to not "playing" so recursion stops)
});
