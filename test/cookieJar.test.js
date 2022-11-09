const CookieJar = require("../lib/cookieJar");
const Vec = require("../lib/vector");
const State = require("../lib/state");
const Level = require("../lib/level");
const levelPlan = require("./mockLevelPlan");
const mockLevelPlan = require("./mockLevelPlan");

describe("CookieJar", () => {
  it("has a position vector, a speed vector and a default null updatedState", () => {
    const cookieJar = new CookieJar(new Vec(0, 0), new Vec(0, 0));
    expect(cookieJar.pos.x).toEqual(0);
    expect(cookieJar.pos.y).toEqual(0);
    expect(cookieJar.speed.x).toEqual(0);
    expect(cookieJar.speed.y).toEqual(0);
    expect(cookieJar.updatedState).toEqual(null);
  });

  it("has a getter for type", () => {
    const cookieJar = new CookieJar(new Vec(0, 0), new Vec(0, 0));
    expect(cookieJar.type).toEqual("cookieJar");
  });

  it("has a create method", () => {
    const cookieJar = CookieJar.create(new Vec(0, 0));
    expect(cookieJar.pos.x).toEqual(0);
    expect(cookieJar.pos.y).toEqual(0);
    expect(cookieJar.speed.x).toEqual(0);
    expect(cookieJar.speed.y).toEqual(0);
    expect(cookieJar.updatedState).toEqual(null);
  });

  it("has default size", () => {
    const cookieJar = CookieJar.create(new Vec(0, 0));
    expect(cookieJar.size).toEqual(new Vec(1, 1));
  });

  it("has an updated method that returns a new and identical CookieJar", () => {
    const cookieJar = CookieJar.create(new Vec(0, 0));
    const level = new Level(mockLevelPlan);
    const state = new State(level, [], "playing");
    const newCookieJar = cookieJar.update();
    expect(newCookieJar.pos).toEqual(new Vec(0, 0));
    expect(newCookieJar.speed).toEqual(new Vec(0, 0));
    expect(newCookieJar.updatedState).toEqual(null);
  });

  it(".collide makes new miniGame on first call and updates state.miniGameStatus as playing", () => {
    const mockMiniGame = {
      run: jest.fn().mockImplementation((callback) => {}),
    };
    const MockMiniGame = jest.fn().mockImplementation(() => {
      return mockMiniGame;
    });
    const level = new Level(mockLevelPlan);
    const state = new State(level, [], "playing");
    const cookieJar = new CookieJar(
      new Vec(0, 0),
      new Vec(0, 0),
      null,
      MockMiniGame
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
    const level = new Level(mockLevelPlan);
    const state = new State(level, [], "playing");
    const cookieJar = new CookieJar(
      new Vec(0, 0),
      new Vec(0, 0),
      null,
      MockMiniGame
    );
    const newState = cookieJar.collide(state);
    const newerState = cookieJar.collide(newState);
    expect(newerState.miniGameStatus).toEqual("playing");
  });

  it(".collide returns the result of winning mini game in state.miniGameStatus", () => {
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
    const level = new Level(mockLevelPlan);
    const state = new State(level, [], "playing");
    const cookieJar = new CookieJar(
      new Vec(0, 0),
      new Vec(0, 0),
      null,
      MockMiniGame
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
    const level = new Level(mockLevelPlan);
    const state = new State(level, [], "playing");
    const cookieJar = new CookieJar(
      new Vec(0, 0),
      new Vec(0, 0),
      null,
      MockMiniGame
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
    const level = new Level(mockLevelPlan);
    const state = new State(level, [], "playing");
    const cookieJar = new CookieJar(
      new Vec(0, 0),
      new Vec(0, 0),
      null,
      MockMiniGame
    );
    const newState = cookieJar.collide(state);
    mockMiniGame.neither();
    const newerState = cookieJar.collide(newState);
    expect(newerState.miniGameStatus).toEqual("playing");
  });
});
