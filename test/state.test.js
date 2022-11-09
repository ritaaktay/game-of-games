/**
 * @jest-environment jsdom
 */

const Level = require("../lib/level");
const State = require("../lib/state");
const Player = require("../lib/player");
const Vec = require("../lib/vector");
const mockLevelPlan = require("./mockLevelPlan");
jest.mock("../lib/blockJumpGame");

describe("State", () => {
  it("has a level, actors, status and miniGameStatus", () => {
    const level = new Level(mockLevelPlan);
    const state = new State(level, [], "playing");
    expect(state.level).toEqual(level);
    expect(state.actors).toEqual([]);
    expect(state.status).toEqual("playing");
    expect(state.miniGameStatus).toEqual(null);
  });

  it("has a start method that creates a new state", () => {
    const level = new Level(mockLevelPlan);
    const state = State.start(level, level.startActors, "playing");
    expect(state.level).toEqual(level);
    expect(state.actors).toEqual(level.startActors);
    expect(state.status).toEqual("playing");
    expect(state.miniGameStatus).toEqual(null);
  });

  it("has a getter that returns the player", () => {
    const level = new Level(mockLevelPlan);
    const state = State.start(level, level.startActors, "playing");
    expect(state.player.type).toEqual("player");
    expect(state.player instanceof Player).toEqual(true);
  });

  it("has an overlap method that returns false if two actors are not overlapping", () => {
    const level = new Level(mockLevelPlan);
    const state = State.start(level, level.startActors, "playing");
    const player1 = Player.create(new Vec(0, 0));
    const player2 = Player.create(new Vec(2, 2));
    expect(state.overlap(player1, player2)).toEqual(false);
  });

  it("has an overlap method that returns true if two actors are overlapping", () => {
    const level = new Level(mockLevelPlan);
    const state = State.start(level, level.startActors, "playing");
    const player1 = Player.create(new Vec(0, 0));
    const player2 = Player.create(new Vec(0, 0));
    expect(state.overlap(player1, player2)).toEqual(true);
  });

  it("has an update method that returns an updated state", () => {
    const level = new Level(mockLevelPlan);
    const state = State.start(level, level.startActors, "playing");
    const newState = state.update(1, {});
    expect(newState.level).toEqual(level);
    expect(newState.actors).toEqual(level.startActors);
    expect(newState.status).toEqual("playing");
    expect(newState.miniGameStatus).toEqual(null);
  });

  it("has an update method that returns an updated state with movement", () => {
    const level = new Level(mockLevelPlan);
    const mockMiniGame = {
      run: (callback) => {},
    };
    const MockMiniGame = jest.fn().mockImplementation(() => {
      return mockMiniGame;
    });
    level.startActors[1].miniGame = MockMiniGame;
    const state = State.start(level, level.startActors, "playing");
    const newState = state.update(1, {
      "ArrowUp": true,
    });
    expect(newState.level).toEqual(level);
    expect(newState.player.pos).toEqual(new Vec(0, 2));
    console.log(newState.actors);
    expect(newState.status).toEqual("playing");
    expect(newState.miniGameStatus).toEqual(null);
  });

  it("has an update method that returns an updated state with collision", () => {
    const level = new Level(mockLevelPlan);
    const mockMiniGame = {
      run: (callback) => {},
    };
    const MockMiniGame = jest.fn().mockImplementation(() => {
      return mockMiniGame;
    });
    level.startActors[1].miniGame = MockMiniGame;
    const state = State.start(level, level.startActors, "playing");
    const newState = state.update(1, {
      "ArrowRight": true,
    });
    expect(newState.level).toEqual(level);
    expect(newState.player.pos).toEqual(new Vec(6, 8));
    expect(newState.status).toEqual("playing");
    expect(newState.miniGameStatus).toEqual("playing");
  });

  it("has an update method that returns an updated state with collision and mini game win", () => {
    const level = new Level(mockLevelPlan);
    const mockMiniGame = {
      run: jest.fn().mockImplementation((callback) => {
        this.callback = callback;
      }),
      win: () => {
        this.callback("Won");
      },
      lose: () => {
        this.callback("Lost");
      },
    };
    const MockMiniGame = jest.fn().mockImplementation(() => {
      return mockMiniGame;
    });
    level.startActors[1].miniGame = MockMiniGame;
    const state = State.start(level, level.startActors, "playing", "null");
    const newState = state.update(1, {
      "ArrowRight": true,
    });
    mockMiniGame.win();
    const newerState = newState.update(1, {});
    expect(newerState.level).toEqual(level);
    expect(newerState.player.pos).toEqual(new Vec(6, 8));
    expect(newerState.status).toEqual("playing");
    expect(newerState.miniGameStatus).toEqual("Won");
  });

  it("has an update method that returns an updated state with collision and mini game loss", () => {
    const level = new Level(mockLevelPlan);
    const mockMiniGame = {
      run: jest.fn().mockImplementation((callback) => {
        this.callback = callback;
      }),
      win: () => {
        this.callback("Won");
      },
      lose: () => {
        this.callback("Lost");
      },
    };
    const MockMiniGame = jest.fn().mockImplementation(() => {
      return mockMiniGame;
    });
    level.startActors[1].miniGame = MockMiniGame;
    const state = State.start(level, level.startActors, "playing", "null");
    const newState = state.update(1, {
      "ArrowRight": true,
    });
    mockMiniGame.lose();
    const newerState = newState.update(1, {});
    expect(newerState.level).toEqual(level);
    expect(newerState.player.pos).toEqual(new Vec(6, 8));
    expect(newerState.status).toEqual("playing");
    expect(newerState.miniGameStatus).toEqual("Lost");
  });

  it("when player moves away from cookieJar after mini game miniGameStatus will be null", () => {
    const level = new Level(mockLevelPlan);
    const mockMiniGame = {
      run: jest.fn().mockImplementation((callback) => {
        this.callback = callback;
      }),
      win: () => {
        this.callback("Won");
      },
      lose: () => {
        this.callback("Lost");
      },
    };
    const MockMiniGame = jest.fn().mockImplementation(() => {
      return mockMiniGame;
    });
    level.startActors[1].miniGame = MockMiniGame;
    const state = State.start(level, level.startActors, "playing", "null");
    const newState = state.update(1, {
      "ArrowRight": true,
    });
    mockMiniGame.win();
    const newerState = newState.update(1, {});
    const finalState = newerState.update(1, {
      "ArrowLeft": true,
    });
    expect(finalState.level).toEqual(level);
    expect(finalState.player.pos).toEqual(new Vec(0, 8));
    expect(finalState.status).toEqual("playing");
    expect(finalState.miniGameStatus).toEqual(null);
  });

  it("returns unmodified state if game has been won or lost ", () => {
    const level = new Level(mockLevelPlan);
    const state = State.start(level);
    const newState = state.update(1, {});
    newState.status = "won";
    const newerState = newState.update(1, {});
    expect(newerState.level).toEqual(level);
    expect(newerState.actors).toEqual(level.startActors);
    expect(newerState.status).toEqual("won");
    expect(newerState.miniGameStatus).toEqual(null);
  });
});
