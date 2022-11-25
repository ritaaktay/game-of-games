/**
 * @jest-environment jsdom
 */

const Exit = require("../lib/exit");
const Vec = require("../lib/vector");
const State = require("../lib/state");
const Level = require("../lib/level");
const MiniGameLocator = require("../lib/miniGameLocator");
const fs = require("fs");
const path = require("path");
const mockLevelPlans = require("./mockLevelPlans");

beforeEach(() => {
  document.body.innerHTML = fs.readFileSync(
    path.join(__dirname, "..", "index.html")
  );
});

describe("Exit", () => {
  it("has a pos and a speed", () => {
    const exit = new Exit(new Vec(0, 0), new Vec(0, 0));
    expect(exit.pos).toEqual(new Vec(0, 0));
    expect(exit.speed).toEqual(new Vec(0, 0));
  });

  it("has a static create method with default speed", () => {
    const exit = Exit.create(new Vec(0, 0));
    expect(exit.pos).toEqual(new Vec(0, 0));
    expect(exit.speed).toEqual(new Vec(0, 0));
  });

  it("has a getter for type", () => {
    const exit = Exit.create(new Vec(0, 0));
    expect(exit.type).toEqual("exit");
  });

  it("has a size", () => {
    const exit = Exit.create(new Vec(0, 0));
    expect(exit.size).toEqual(new Vec(1, 1));
  });

  it("has a collide method that returns a new state", () => {
    const exit = Exit.create(new Vec(0, 0));
    const state = new State(
      new Level(mockLevelPlans, new MiniGameLocator([{}, {}])),
      [],
      "playing"
    );
    const newState = exit.collide(state);
    expect(newState.status).toEqual("won");
  });
});
