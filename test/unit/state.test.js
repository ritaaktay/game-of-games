const Level = require("../../lib/level");
const State = require("../../lib/state");
const Player = require("../../lib/player");
const levelPlans = require("../../lib/levelPlans");
const Vec = require("../../lib/vector");

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

  it("has an overlap method that returns false if two actors are not overlapping", () => {
    const level = new Level(levelPlans[0]);
    const state = State.start(level, level.startActors, "playing");
    const player1 = Player.create(new Vec(0, 0));
    const player2 = Player.create(new Vec(2, 2));
    expect(state.overlap(player1, player2)).toEqual(false);
  });

  it("has an overlap method that returns true if two actors are overlapping", () => {
    const level = new Level(levelPlans[0]);
    const state = State.start(level, level.startActors, "playing");
    const player1 = Player.create(new Vec(0, 0));
    const player2 = Player.create(new Vec(0, 0));
    expect(state.overlap(player1, player2)).toEqual(true);
  });
});
