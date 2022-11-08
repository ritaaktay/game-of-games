const CookieJar2 = require("../lib/cookieJar2");
const Vec = require("../lib/vector");
const State = require("../lib/state");
const Level = require("../lib/level");
const levelPlans = require("../lib/levelPlans");

describe("CookieJar2", () => {
  it("has a position vector, a speed vector and a default null updatedState", () => {
    const cookieJar2 = new CookieJar2(new Vec(0, 0), new Vec(0, 0));
    expect(cookieJar2.pos.x).toEqual(0);
    expect(cookieJar2.pos.y).toEqual(0);
    expect(cookieJar2.speed.x).toEqual(0);
    expect(cookieJar2.speed.y).toEqual(0);
    expect(cookieJar2.updatedState).toEqual(null);
  });

  it("has a getter for type", () => {
    const cookieJar2 = new CookieJar2(new Vec(0, 0), new Vec(0, 0));
    expect(cookieJar2.type).toEqual("cookieJar2");
  });

  it("has a create method", () => {
    const cookieJar2 = CookieJar2.create(new Vec(0, 0));
    expect(cookieJar2.pos.x).toEqual(0);
    expect(cookieJar2.pos.y).toEqual(0);
    expect(cookieJar2.speed.x).toEqual(0);
    expect(cookieJar2.speed.y).toEqual(0);
    expect(cookieJar2.updatedState).toEqual(null);
  });

  it("has default size", () => {
    const cookieJar2 = CookieJar2.create(new Vec(0, 0));
    expect(cookieJar2.size).toEqual(new Vec(1, 1));
  });

  it("has an updated method that returns a new and identical CookieJar2", () => {
    const cookieJar2 = CookieJar2.create(new Vec(0, 0));
    const level = new Level(levelPlans[0]);
    const state = new State(level, [], "playing");
    const newCookieJar2 = cookieJar2.update();
    expect(newCookieJar2.pos).toEqual(new Vec(0, 0));
    expect(newCookieJar2.speed).toEqual(new Vec(0, 0));
    expect(newCookieJar2.updatedState).toEqual(null);
  });

  it(".collide makes new miniGame on first call and updates state.miniGameStatus as playing", () => {
    const mockMiniGame = {
      run: jest.fn().mockImplementation((callback) => {}),
    };
    const MockMiniGame = jest.fn().mockImplementation(() => {
      return mockMiniGame;
    });
    const level = new Level(levelPlans[0]);
    const state = new State(level, [], "playing");
    const cookieJar2 = new CookieJar2(
      new Vec(0, 0),
      new Vec(0, 0),
      null,
      MockMiniGame
    );
    const newState = cookieJar2.collide(state);
    expect(newState.miniGameStatus).toEqual("playing");
  });

  it(".collide returns state.miniGameStatus as playing on subsequent calls during mini game play", () => {
    const mockMiniGame = {
      run: jest.fn().mockImplementation((callback) => {}),
    };
    const MockMiniGame = jest.fn().mockImplementation(() => {
      return mockMiniGame;
    });
    const level = new Level(levelPlans[0]);
    const state = new State(level, [], "playing");
    const cookieJar2 = new CookieJar2(
      new Vec(0, 0),
      new Vec(0, 0),
      null,
      MockMiniGame
    );
    const newState = cookieJar2.collide(state);
    const newerState = cookieJar2.collide(newState);
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
    const level = new Level(levelPlans[0]);
    const state = new State(level, [], "playing");
    const cookieJar2 = new CookieJar2(
      new Vec(0, 0),
      new Vec(0, 0),
      null,
      MockMiniGame
    );
    const newState = cookieJar2.collide(state);
    mockMiniGame.win();
    const newerState = cookieJar2.collide(newState);
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
    const level = new Level(levelPlans[0]);
    const state = new State(level, [], "playing");
    const cookieJar2 = new CookieJar2(
      new Vec(0, 0),
      new Vec(0, 0),
      null,
      MockMiniGame
    );
    const newState = cookieJar2.collide(state);
    mockMiniGame.lose();
    const newerState = cookieJar2.collide(newState);
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
    const level = new Level(levelPlans[0]);
    const state = new State(level, [], "playing");
    const cookieJar2 = new CookieJar2(
      new Vec(0, 0),
      new Vec(0, 0),
      null,
      MockMiniGame
    );
    const newState = cookieJar2.collide(state);
    mockMiniGame.neither();
    const newerState = cookieJar2.collide(newState);
    expect(newerState.miniGameStatus).toEqual("playing");
  });
});
