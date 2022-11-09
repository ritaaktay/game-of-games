const CookieJar1 = require("../lib/cookieJar1");
const Vec = require("../lib/vector");
const State = require("../lib/state");
const Level = require("../lib/level");
const mockLevelPlan = require("./mockLevelPlan");

describe("CookieJar1", () => {
  it("has a position vector, a speed vector and a default null updatedState", () => {
    const cookieJar1 = new CookieJar1(new Vec(0, 0), new Vec(0, 0));
    expect(cookieJar1.pos.x).toEqual(0);
    expect(cookieJar1.pos.y).toEqual(0);
    expect(cookieJar1.speed.x).toEqual(0);
    expect(cookieJar1.speed.y).toEqual(0);
    expect(cookieJar1.updatedState).toEqual(null);
  });

  it("has a getter for type", () => {
    const cookieJar1 = new CookieJar1(new Vec(0, 0), new Vec(0, 0));
    expect(cookieJar1.type).toEqual("cookieJar1");
  });

  it("has a create method", () => {
    const cookieJar1 = CookieJar1.create(new Vec(0, 0));
    expect(cookieJar1.pos.x).toEqual(0);
    expect(cookieJar1.pos.y).toEqual(0);
    expect(cookieJar1.speed.x).toEqual(0);
    expect(cookieJar1.speed.y).toEqual(0);
    expect(cookieJar1.updatedState).toEqual(null);
  });

  it("has default size", () => {
    const cookieJar1 = CookieJar1.create(new Vec(0, 0));
    expect(cookieJar1.size).toEqual(new Vec(1, 1));
  });

  it("has an updated method that returns a new and identical CookieJar1", () => {
    const cookieJar1 = CookieJar1.create(new Vec(0, 0));
    const level = new Level(mockLevelPlan[0]);
    const state = new State(level, [], "playing");
    const newCookieJar1 = cookieJar1.update();
    expect(newCookieJar1.pos).toEqual(new Vec(0, 0));
    expect(newCookieJar1.speed).toEqual(new Vec(0, 0));
    expect(newCookieJar1.updatedState).toEqual(null);
  });

  it(".collide makes new miniGame on first call and updates state.miniGameStatus as playing", () => {
    const mockMiniGame = {
      run: jest.fn().mockImplementation((callback) => {}),
    };
    const MockMiniGame = jest.fn().mockImplementation(() => {
      return mockMiniGame;
    });
    const level = new Level(mockLevelPlan[0]);
    const state = new State(level, [], "playing");
    const cookieJar1 = new CookieJar1(
      new Vec(0, 0),
      new Vec(0, 0),
      null,
      MockMiniGame
    );
    const newState = cookieJar1.collide(state);
    expect(newState.miniGameStatus).toEqual("playing");
  });

  it(".collide returns state.miniGameStatus as playing on subsequent calls during mini game play", () => {
    const mockMiniGame = {
      run: jest.fn().mockImplementation((callback) => {}),
    };
    const MockMiniGame = jest.fn().mockImplementation(() => {
      return mockMiniGame;
    });
    const level = new Level(mockLevelPlan[0]);
    const state = new State(level, [], "playing");
    const cookieJar1 = new CookieJar1(
      new Vec(0, 0),
      new Vec(0, 0),
      null,
      MockMiniGame
    );
    const newState = cookieJar1.collide(state);
    const newerState = cookieJar1.collide(newState);
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
    const level = new Level(mockLevelPlan[0]);
    const state = new State(level, [], "playing");
    const cookieJar1 = new CookieJar1(
      new Vec(0, 0),
      new Vec(0, 0),
      null,
      MockMiniGame
    );
    const newState = cookieJar1.collide(state);
    mockMiniGame.win();
    const newerState = cookieJar1.collide(newState);
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
    const level = new Level(mockLevelPlan[0]);
    const state = new State(level, [], "playing");
    const cookieJar1 = new CookieJar1(
      new Vec(0, 0),
      new Vec(0, 0),
      null,
      MockMiniGame
    );
    const newState = cookieJar1.collide(state);
    mockMiniGame.lose();
    const newerState = cookieJar1.collide(newState);
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
    const level = new Level(mockLevelPlan[0]);
    const state = new State(level, [], "playing");
    const cookieJar1 = new CookieJar1(
      new Vec(0, 0),
      new Vec(0, 0),
      null,
      MockMiniGame
    );
    const newState = cookieJar1.collide(state);
    mockMiniGame.neither();
    const newerState = cookieJar1.collide(newState);
    expect(newerState.miniGameStatus).toEqual("playing");
  });
});
