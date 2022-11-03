var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// lib/vector.js
var require_vector = __commonJS({
  "lib/vector.js"(exports, module2) {
    var Vec = class {
      constructor(x, y) {
        this.x = x;
        this.y = y;
      }
      plus(other) {
        return new Vec(this.x + other.x, this.y + other.y);
      }
      times(factor) {
        return new Vec(this.x * factor, this.y * factor);
      }
    };
    module2.exports = Vec;
  }
});

// lib/player.js
var require_player = __commonJS({
  "lib/player.js"(exports, module2) {
    var Vec = require_vector();
    var Player = class {
      constructor(pos, speed) {
        this.pos = pos;
        this.speed = speed;
        this.xySpeed = 6;
      }
      get type() {
        return "player";
      }
      static create(pos) {
        return new Player(pos, new Vec(0, 0));
      }
      update(time, state, keys) {
        let xSpeed = 0;
        if (keys.ArrowLeft)
          xSpeed -= this.xySpeed;
        if (keys.ArrowRight)
          xSpeed += this.xySpeed;
        let ySpeed = 0;
        if (keys.ArrowUp)
          ySpeed -= this.xySpeed;
        if (keys.ArrowDown)
          ySpeed += this.xySpeed;
        let pos = this.pos;
        let movedX = pos.plus(new Vec(xSpeed * time, 0));
        if (!state.level.touchesElement(movedX, this.size, "wall")) {
          pos = movedX;
        }
        let movedY = pos.plus(new Vec(0, ySpeed * time));
        if (!state.level.touchesElement(movedY, this.size, "wall")) {
          pos = movedY;
        }
        return new Player(pos, new Vec(xSpeed, ySpeed));
      }
    };
    Player.prototype.size = new Vec(1, 1);
    module2.exports = Player;
  }
});

// lib/blockJumpGame.js
var require_blockJumpGame = __commonJS({
  "lib/blockJumpGame.js"(exports, module2) {
    var BlockJumpGame2 = class {
      constructor(callback) {
        this.character = document.getElementById("character");
        this.block = document.getElementById("block");
        this.jumpButton = document.getElementById("jump-button");
        this.startButton = document.getElementById("start-button");
        this.jumpCounter = 0;
        this.callback = callback;
        this.checkIfDead();
        this.jumpButton.addEventListener("click", this.jump);
        this.startButton.addEventListener("click", this.start);
      }
      start = () => {
        block.style.animation = "block 1s infinite linear";
      };
      checkIfDead = () => {
        setInterval(() => {
          var characterTop = parseInt(
            window.getComputedStyle(this.character).getPropertyValue("top")
          );
          var blockLeft = parseInt(
            window.getComputedStyle(this.block).getPropertyValue("left")
          );
          if (blockLeft < 20 && blockLeft > 0 && characterTop >= 290) {
            block.style.animation = "none";
            block.style.display = "none";
            alert("You Lost.");
            this.callback("Lost");
          }
        }, 10);
      };
      jump = () => {
        this.jumpCounter += 1;
        if (this.character.classList != "animate") {
          this.character.classList.add("animate");
          if (this.jumpCounter > 4) {
            setTimeout(() => {
              block.style.animation = "none";
              alert("You Won!");
              this.callback("Won");
            }, 500);
          }
        }
        setTimeout(function() {
          this.character.classList.remove("animate");
        }, 500);
      };
    };
    module2.exports = BlockJumpGame2;
  }
});

// lib/state.js
var require_state = __commonJS({
  "lib/state.js"(exports, module2) {
    var State = class {
      constructor(level2, actors, status, miniGameStatus = null) {
        this.level = level2;
        this.actors = actors;
        this.status = status;
        this.miniGameStatus = miniGameStatus;
      }
      static start(level2) {
        return new State(level2, level2.startActors, "playing");
      }
      get player() {
        return this.actors.find((a) => a.type == "player");
      }
      update = function(time, keys) {
        let actors = this.actors.map((actor) => actor.update(time, this, keys));
        let newState = new State(
          this.level,
          actors,
          this.status,
          this.miniGameStatus
        );
        if (newState.status != "playing")
          return newState;
        let player = newState.player;
        for (let actor of actors) {
          if (actor != player && this.overlap(actor, player)) {
            newState = actor.collide(newState);
          }
        }
        console.log(`State.update: ${newState.miniGameStatus}`);
        return newState;
      };
      overlap = function(actor1, actor2) {
        return actor1.pos.x + actor1.size.x > actor2.pos.x && actor1.pos.x < actor2.pos.x + actor2.size.x && actor1.pos.y + actor1.size.y > actor2.pos.y && actor1.pos.y < actor2.pos.y + actor2.size.y;
      };
    };
    module2.exports = State;
  }
});

// lib/dumbMiniGame.js
var require_dumbMiniGame = __commonJS({
  "lib/dumbMiniGame.js"(exports, module2) {
    var DumbMiniGame2 = class {
      constructor() {
        this.redButton = document.getElementById("red-button");
        this.blueButton = document.getElementById("blue-button");
        this.callback;
      }
      run = (callback) => {
        this.callback = callback;
        document.getElementById("dumb-mini-game").style.display = "inline";
        this.redButton.addEventListener("click", this.redButtonEventListener);
        this.blueButton.addEventListener("click", this.blueButtonEventListener);
      };
      redButtonEventListener = () => {
        this.callback("Lost");
      };
      blueButtonEventListener = () => {
        this.callback("Won");
      };
    };
    module2.exports = DumbMiniGame2;
  }
});

// lib/cookieJar.js
var require_cookieJar = __commonJS({
  "lib/cookieJar.js"(exports, module2) {
    var Vec = require_vector();
    var BlockJumpGame2 = require_blockJumpGame();
    var State = require_state();
    var DumbMiniGame2 = require_dumbMiniGame();
    var CookieJar = class {
      constructor(pos, speed) {
        this.pos = pos;
        this.speed = speed;
        this.updatedState = null;
      }
      get type() {
        return "cookieJar";
      }
      static create(pos) {
        return new CookieJar(pos, new Vec(0, 0));
      }
      update(time, state, keys) {
        return new CookieJar(this.pos, this.speed);
      }
      collide(state) {
        console.log("222222222");
        console.log(`CookieJar.collide: ${state.miniGameStatus}`);
        if (state.miniGameStatus == null) {
          console.log("333333333");
          this.updatedState = new State(
            state.level,
            state.actors,
            state.status,
            "playing"
          );
          const dumbMiniGame = new DumbMiniGame2();
          const callbackFunction = (result) => {
            if (result === "Lost") {
              console.log("5555555555");
              let newState = new State(
                state.level,
                state.actors,
                state.status,
                "Lost"
              );
              this.updatedState = newState;
              console.log(this);
            } else if (result === "Won") {
              console.log("5555555555");
              let newState = new State(
                state.level,
                state.actors,
                state.status,
                "Won"
              );
              this.updatedState = newState;
              console.log(this);
            }
          };
          dumbMiniGame.run(callbackFunction);
        }
        console.log(this.updatedState);
        return this.updatedState;
      }
    };
    CookieJar.prototype.size = new Vec(1, 1);
    module2.exports = CookieJar;
  }
});

// lib/levelCharTypes.js
var require_levelCharTypes = __commonJS({
  "lib/levelCharTypes.js"(exports, module2) {
    var Player = require_player();
    var CookieJar = require_cookieJar();
    var levelCharTypes = {
      ".": "empty",
      "@": Player,
      "!": CookieJar
    };
    module2.exports = levelCharTypes;
  }
});

// lib/level.js
var require_level = __commonJS({
  "lib/level.js"(exports, module2) {
    var Vec = require_vector();
    var levelCharTypes = require_levelCharTypes();
    var Level2 = class {
      constructor(plan) {
        let rows = plan.trim().split("\n").map((l) => [...l]);
        this.height = rows.length;
        this.width = rows[0].length;
        this.startActors = [];
        this.rows = rows.map((row, y) => {
          return row.map((ch, x) => {
            let type = levelCharTypes[ch];
            if (typeof type == "string")
              return type;
            this.startActors.push(type.create(new Vec(x, y)));
            return "empty";
          });
        });
      }
      touchesElement = function(pos, size, type) {
        let xStart = Math.floor(pos.x);
        let xEnd = Math.ceil(pos.x + size.x);
        let yStart = Math.floor(pos.y);
        let yEnd = Math.ceil(pos.y + size.y);
        for (let y = yStart; y < yEnd; y++) {
          for (let x = xStart; x < xEnd; x++) {
            let isOutside = x < 0 || x >= this.width || y < 0 || y >= this.height;
            let here = isOutside ? "wall" : this.rows[y][x];
            if (here == type)
              return true;
          }
        }
        return false;
      };
    };
    module2.exports = Level2;
  }
});

// lib/levelPlans.js
var require_levelPlans = __commonJS({
  "lib/levelPlans.js"(exports, module2) {
    var mvpLevelPlan = `
..................
..................
..................
..................
..................
..................
..................
..................
@...!.............`;
    module2.exports = [mvpLevelPlan];
  }
});

// lib/DOMDisplay.js
var require_DOMDisplay = __commonJS({
  "lib/DOMDisplay.js"(exports, module2) {
    var DOMDisplay2 = class {
      constructor(parent, level2) {
        this.scale = 40;
        this.dom = this.#createElements(
          "div",
          { class: "game" },
          this.#drawGrid(level2)
        );
        this.actorLayer = null;
        parent.appendChild(this.dom);
      }
      clear() {
        this.dom.remove();
      }
      syncState(state) {
        if (this.actorLayer)
          this.actorLayer.remove();
        this.actorLayer = this.#drawActors(state.actors);
        this.dom.appendChild(this.actorLayer);
        this.dom.className = `game ${state.status}`;
      }
      #drawGrid(level2) {
        return this.#createElements(
          "table",
          {
            class: "background",
            style: `width: ${level2.width * this.scale}px`
          },
          ...level2.rows.map(
            (row) => this.#createElements(
              "tr",
              { style: `height: ${this.scale}px` },
              ...row.map((type) => this.#createElements("td", { class: type }))
            )
          )
        );
      }
      #drawActors(actors) {
        return this.#createElements(
          "div",
          {},
          ...actors.map((actor) => {
            let rect = this.#createElements("div", {
              class: `actor ${actor.type}`
            });
            rect.style.width = `${actor.size.x * this.scale}px`;
            rect.style.height = `${actor.size.y * this.scale}px`;
            rect.style.left = `${actor.pos.x * this.scale}px`;
            rect.style.top = `${actor.pos.y * this.scale}px`;
            return rect;
          })
        );
      }
      #createElements(name, attrs, ...children) {
        let dom = document.createElement(name);
        for (let attr of Object.keys(attrs)) {
          dom.setAttribute(attr, attrs[attr]);
        }
        for (let child of children) {
          dom.appendChild(child);
        }
        return dom;
      }
      trackKeys(keys) {
        let down = /* @__PURE__ */ Object.create(null);
        function track(event) {
          if (keys.includes(event.key)) {
            down[event.key] = event.type == "keydown";
            event.preventDefault();
          }
        }
        window.addEventListener("keydown", track);
        window.addEventListener("keyup", track);
        return down;
      }
    };
    module2.exports = DOMDisplay2;
  }
});

// lib/game.js
var require_game = __commonJS({
  "lib/game.js"(exports, module2) {
    var State = require_state();
    var Game2 = class {
      constructor(level2, Display) {
        this.level = level2;
        this.display = new Display(document.body, level2);
        this.state = State.start(level2);
        this.arrowKeysTracker = this.display.trackKeys([
          "ArrowLeft",
          "ArrowRight",
          "ArrowUp",
          "ArrowDown"
        ]);
      }
      run() {
        this.#runAnimation(this.#updateFrame);
      }
      #updateFrame = (time) => {
        this.state = this.state.update(time, this.arrowKeysTracker);
        this.display.syncState(this.state);
        if (this.state.status == "playing") {
          return true;
        } else {
          display.clear();
          return false;
        }
      };
      #runAnimation(updateFrameFunction) {
        let lastTime = null;
        function frame(time) {
          if (lastTime != null) {
            let timeStep = Math.min(time - lastTime, 100) / 1e3;
            if (updateFrameFunction(timeStep) === false)
              return;
          }
          lastTime = time;
          requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
      }
    };
    module2.exports = Game2;
  }
});

// index.js
var Level = require_level();
var levelPlans = require_levelPlans();
var DOMDisplay = require_DOMDisplay();
var Game = require_game();
var BlockJumpGame = require_blockJumpGame();
var DumbMiniGame = require_dumbMiniGame();
var level = new Level(levelPlans[0]);
var game = new Game(level, DOMDisplay);
game.run();
