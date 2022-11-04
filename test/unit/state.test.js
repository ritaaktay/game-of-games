const Level = require("../../lib/level");
const State = require("../../lib/state");
const Player = require("../../lib/player");
const levelPlans = require("../../lib/levelPlans");

describe("State", () => {
  it("has a level, actors, status and miniGameStatus", () => {
    const level = new Level(levelPlans[0]);
    const state = new State(level, [], "playing");
    expect(state.level).toEqual(level);
    expect(state.actors).toEqual([]);
    expect(state.status).toEqual("playing");
    expect(state.miniGameStatus).toEqual(null);
  });

  it("has a start method that creates a new state", () => {
    const level = new Level(levelPlans[0]);
    const state = State.start(level, level.startActors, "playing");
    expect(state.level).toEqual(level);
    expect(state.actors).toEqual(level.startActors);
    expect(state.status).toEqual("playing");
    expect(state.miniGameStatus).toEqual(null);
  });

  it("has a getter that returns the player", () => {
    const level = new Level(levelPlans[0]);
    const state = State.start(level, level.startActors, "playing");
    expect(state.player.type).toEqual("player");
    expect(state.player instanceof Player).toEqual(true);
  });
});
