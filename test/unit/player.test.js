const Player = require("../../lib/player");
const Vec = require("../../lib/vector");
const State = require("../../lib/state");
const Level = require("../../lib/level");
const levelPlans = require("../../lib/levelPlans");

describe("Player", () => {
  it("has a position vector, speed vector, and a speed amount", () => {
    const player = new Player(new Vec(0, 0), new Vec(0, 0), 6);
    expect(player.pos.x).toEqual(0);
    expect(player.pos.y).toEqual(0);
    expect(player.speed.x).toEqual(0);
    expect(player.speed.y).toEqual(0);
    expect(player.xySpeed).toEqual(6);
  });

  it("has a getter for type", () => {
    const player = new Player(new Vec(0, 0), new Vec(0, 0), 6);
    expect(player.type).toEqual("player");
  });

  it("has a create method", () => {
    const player = Player.create(new Vec(0, 0));
    expect(player.pos.x).toEqual(0);
    expect(player.pos.y).toEqual(0);
    expect(player.speed.x).toEqual(0);
    expect(player.speed.y).toEqual(0);
    expect(player.xySpeed).toEqual(6);
  });

  it("has default size", () => {
    const player = Player.create(new Vec(0, 0));
    expect(player.size).toEqual(new Vec(1, 1));
  });

  it("has default size", () => {
    const player = Player.create(new Vec(0, 0));
    expect(player.size).toEqual(new Vec(1, 1));
  });

  it("it moves the player right", () => {
    const player = Player.create(new Vec(0, 0));
    console.log(player);
    const level = new Level(levelPlans[0]);
    const state = new State(level, [], "playing");
    const keys = {
      "ArrowRight": true,
      "ArrowLeft": false,
      "ArrowDown": false,
      "ArrowUp": false,
    };
    const newPlayer = player.update(2, state, keys);
    console.log(newPlayer);
    expect(newPlayer.pos).toEqual(new Vec(12, 0));
    expect(newPlayer.speed).toEqual(new Vec(6, 0));
  });

  it("it does not move further than level boundary", () => {
    const player = Player.create(new Vec(6, 6));
    const level = new Level(levelPlans[0]);
    const state = new State(level, [], "playing");
    const keys = {
      "ArrowRight": false,
      "ArrowLeft": true,
      "ArrowDown": false,
      "ArrowUp": false,
    };
    const newPlayer = player.update(2, state, keys);
    expect(newPlayer.pos).toEqual(new Vec(6, 6));
    expect(newPlayer.speed).toEqual(new Vec(-6, 0));
  });

  it("it moves the player up", () => {
    const player = Player.create(new Vec(12, 12));
    const level = new Level(levelPlans[0]);
    const state = new State(level, [], "playing");
    const keys = {
      "ArrowRight": false,
      "ArrowLeft": false,
      "ArrowDown": false,
      "ArrowUp": true,
    };
    const newPlayer = player.update(1, state, keys);
    expect(newPlayer.pos).toEqual(new Vec(12, 6));
    expect(newPlayer.speed).toEqual(new Vec(0, -6));
  });

  it("it moves the player down", () => {
    const player = Player.create(new Vec(0, 0));
    console.log(player);
    const level = new Level(levelPlans[0]);
    const state = new State(level, [], "playing");
    const keys = {
      "ArrowRight": false,
      "ArrowLeft": false,
      "ArrowDown": true,
      "ArrowUp": false,
    };
    const newPlayer = player.update(1, state, keys);
    console.log(newPlayer);
    expect(newPlayer.pos).toEqual(new Vec(0, 6));
    expect(newPlayer.speed).toEqual(new Vec(0, 6));
  });
});
