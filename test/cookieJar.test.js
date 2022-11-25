/**
 * @jest-environment jsdom
 */

const CookieJar = require("../lib/cookieJar");
const Vec = require("../lib/vector");
const State = require("../lib/state");
const Level = require("../lib/level");
const MiniGameLocator = require("../lib/miniGameLocator");
const mockLevelPlans = require("./mockLevelPlans");
const fs = require("fs");
const path = require("path");

beforeEach(() => {
  document.body.innerHTML = fs.readFileSync(
    path.join(__dirname, "..", "index.html")
  );
});

describe("CookieJar", () => {
  it("has a position vector, a speed vector and a default null storedState", () => {
    const cookieJar = new CookieJar(
      new Vec(0, 0),
      new Vec(0, 0),
      new MiniGameLocator()
    );
    expect(cookieJar.pos.x).toEqual(0);
    expect(cookieJar.pos.y).toEqual(0);
    expect(cookieJar.speed.x).toEqual(0);
    expect(cookieJar.speed.y).toEqual(0);
    expect(cookieJar.storedState).toEqual(null);
  });

  it("has a getter for type", () => {
    const cookieJar = new CookieJar(
      new Vec(0, 0),
      new Vec(0, 0),
      new MiniGameLocator()
    );
    expect(cookieJar.type).toEqual("cookieJar");
  });

  it("has a create method", () => {
    const cookieJar = CookieJar.create(new Vec(0, 0), new MiniGameLocator());
    expect(cookieJar.pos.x).toEqual(0);
    expect(cookieJar.pos.y).toEqual(0);
    expect(cookieJar.speed.x).toEqual(0);
    expect(cookieJar.speed.y).toEqual(0);
    expect(cookieJar.storedState).toEqual(null);
  });

  it("has default size", () => {
    const cookieJar = CookieJar.create(new Vec(0, 0), new MiniGameLocator());
    expect(cookieJar.size).toEqual(new Vec(1, 1));
  });

  it(".collide makes new miniGame on first call and updates state.miniGameStatus as playing", () => {
    const mockMiniGame = {
      run: jest.fn().mockImplementation((callback) => {}),
    };
    const MockMiniGame = jest.fn().mockImplementation(() => {
      return mockMiniGame;
    });
    const level = new Level(mockLevelPlans, MiniGameLocator);
    const state = new State(level, [], "playing");
    const cookieJar = new CookieJar(
      new Vec(0, 0),
      new Vec(0, 0),
      new MiniGameLocator()
    );
    const newState = cookieJar.collide(state);
    expect(newState.miniGameStatus).toEqual("playing");
  });

  it(".collide returns state.miniGameStatus as playing on subsequent calls during mini game play", () => {
    const mockMiniGame = {
      run: jest.fn().mockImplementation((callback) => {}),
    };
    const MockMiniGame = jest.fn().mockImplementation(() => {
      return mockMiniGame;
    });
    const level = new Level(mockLevelPlans, MiniGameLocator);
    const state = new State(level, [], "playing");
    const cookieJar = new CookieJar(
      new Vec(0, 0),
      new Vec(0, 0),
      new MiniGameLocator()
    );
    const newState = cookieJar.collide(state);
    const newerState = cookieJar.collide(newState);
    expect(newerState.miniGameStatus).toEqual("playing");
  });

  it.only(".collide returns the result of winning mini game in state.miniGameStatus", () => {
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
    const level = new Level(mockLevelPlans, MiniGameLocator);
    const state = new State(level, [], "playing");
    const cookieJar = new CookieJar(
      new Vec(0, 0),
      new Vec(0, 0),
      new MiniGameLocator()
    );
    const newState = cookieJar.collide(state);
    mockMiniGame.win();
    const newerState = cookieJar.collide(newState);
    expect(newerState.miniGameStatus).toEqual("Won");
  });

  it(".collide returns the result of losing mini game in state.miniGameStatus", () => {
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
    const level = new Level(mockLevelPlans, MiniGameLocator);
    const state = new State(level, [], "playing");
    const cookieJar = new CookieJar(
      new Vec(0, 0),
      new Vec(0, 0),
      new MiniGameLocator()
    );
    const newState = cookieJar.collide(state);
    mockMiniGame.lose();
    const newerState = cookieJar.collide(newState);
    expect(newerState.miniGameStatus).toEqual("Lost");
  });

  it("covers when mini game status is neither won or lost", () => {
    const mockMiniGame = {
      run: jest.fn().mockImplementation((callback) => {
        this.callback = callback;
      }),
      neither: () => {
        this.callback("Neither");
      },
    };
    const MockMiniGame = jest.fn().mockImplementation(() => {
      return mockMiniGame;
    });
    const level = new Level(mockLevelPlans, MiniGameLocator);
    const state = new State(level, [], "playing");
    const cookieJar = new CookieJar(
      new Vec(0, 0),
      new Vec(0, 0),
      new MiniGameLocator()
    );
    const newState = cookieJar.collide(state);
    mockMiniGame.neither();
    const newerState = cookieJar.collide(newState);
    expect(newerState.miniGameStatus).toEqual("playing");
  });
});
