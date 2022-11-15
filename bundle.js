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

// lib/state.js
var require_state = __commonJS({
  "lib/state.js"(exports, module2) {
    var State = class {
      constructor(level2, actors, status, miniGameStatus = null, cookieJar1Cookie = 0, cookieJar2Cookie = 0) {
        this.level = level2;
        this.actors = actors;
        this.status = status;
        this.miniGameStatus = miniGameStatus;
        this.cookieJar1Cookie = cookieJar1Cookie;
        this.cookieJar2Cookie = cookieJar2Cookie;
      }
      static start(level2) {
        return new State(level2, level2.startActors, "playing");
      }
      get player() {
        return this.actors.find((a) => a.type == "player");
      }
      update = function(time, keys, levelConstructor) {
        let actors = this.actors;
        if (this.miniGameStatus != "playing") {
          actors = this.updateActors(time, keys);
        }
        let newState = new State(
          this.level,
          actors,
          this.status,
          this.miniGameStatus,
          this.cookieJar1Cookie,
          this.cookieJar2Cookie
        );
        let player = newState.player;
        for (let actor of actors) {
          if (actor != player && this.overlap(actor, player)) {
            newState = actor.collide(newState, levelConstructor);
          }
        }
        if (this.resetMiniGameStatus(newState, player))
          newState.miniGameStatus = null;
        return newState;
      };
      resetMiniGameStatus = (state, player) => {
        const cookieJar1 = this.actors.find((actor) => actor.type == "cookieJar1");
        const cookieJar2 = this.actors.find((actor) => actor.type == "cookieJar2");
        return cookieJar1 != void 0 && cookieJar2 != void 0 && !this.overlap(cookieJar1, player) && !this.overlap(cookieJar2, player) && (state.miniGameStatus == "Won" || state.miniGameStatus == "Lost");
      };
      updateActors = (time, keys) => {
        return this.actors.map((actor) => actor.update(time, this, keys));
      };
      overlap = function(actor1, actor2) {
        return actor1.pos.x + actor1.size.x > actor2.pos.x && actor1.pos.x < actor2.pos.x + actor2.size.x && actor1.pos.y + actor1.size.y > actor2.pos.y && actor1.pos.y < actor2.pos.y + actor2.size.y;
      };
    };
    module2.exports = State;
  }
});

// lib/levelPlans.js
var require_levelPlans = __commonJS({
  "lib/levelPlans.js"(exports, module2) {
    var mvpLevelPlan = `
..................
.................2
..............####
..########....#..*
..#......#....#...
..#......#......#.
..#...#..#....M.#.
..#...#.........#.
.@#..1#.......#...`;
    var noMonsterLevelPlan = `
..................
.................2
..............####
..########....#...
..#......#....#...
..#......#........
..#...#..#........
..#...#...........
.@#..1#.......#...`;
    var winLevelPlan = `
..................
..................
..................
.................@
..................
..................
..................
..................
..................`;
    module2.exports = [mvpLevelPlan, noMonsterLevelPlan, winLevelPlan];
  }
});

// lib/cookieMonster.js
var require_cookieMonster = __commonJS({
  "lib/cookieMonster.js"(exports, module2) {
    var Vec = require_vector();
    var State = require_state();
    var levelPlans2 = require_levelPlans();
    var CookieMonster = class {
      constructor(pos, speed) {
        this.pos = pos;
        this.speed = speed;
      }
      get type() {
        return "cookieMonster";
      }
      static create(pos) {
        return new CookieMonster(pos, new Vec(0, 0));
      }
      update(time, state, keys) {
        return new CookieMonster(this.pos, this.speed);
      }
      collide(state, levelConstructor) {
        const newState = new State(
          state.level,
          state.actors,
          state.status,
          state.miniGameStatus,
          state.cookieJar1Cookie,
          state.cookieJar2Cookie
        );
        if (state.cookieJar1Cookie == 0 && state.cookieJar2Cookie == 0) {
          document.getElementById("text").textContent = "Give me cookies!";
        } else if (state.cookieJar1Cookie < 1 || state.cookieJar2Cookie < 1) {
          const cookieCount = state.cookieJar1Cookie + state.cookieJar2Cookie;
          document.getElementById(
            "text"
          ).textContent = `Give me more cookies! You have: ${"\u{1F36A}".repeat(
            cookieCount
          )}`;
        } else {
          document.getElementById("text").textContent = "Thanks! Now, escape before it's too late!";
          newState.level = new levelConstructor(levelPlans2[1]);
        }
        return newState;
      }
    };
    CookieMonster.prototype.size = new Vec(1, 1);
    module2.exports = CookieMonster;
  }
});

// lib/player.js
var require_player = __commonJS({
  "lib/player.js"(exports, module2) {
    var CookieMonster = require_cookieMonster();
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
    var BlockJumpGame = class {
      constructor(cookieJarId) {
        this.character = document.getElementById("character");
        this.block = document.getElementById("block");
        this.jumpCounter = 0;
        this.callback;
        this.started = false;
      }
      run = (callback) => {
        window.addEventListener("keydown", this.keysEventListener);
        this.checkIfDead();
        this.displayMessage(
          "Jump over the meteorites! Press [Enter] to start and [Space Bar] to jump"
        );
        this.callback = callback;
        document.getElementById("block_jump_game_container").style.display = "inline";
      };
      end = () => {
        document.getElementById("block_jump_game_container").style.display = "none";
        this.jumpCounter = 0;
        clearInterval(this.setInterval);
        window.removeEventListener("keydown", this.keysEventListener);
        this.block.style.animation = "none";
      };
      keysEventListener = (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          this.start();
        }
        if (event.key === " ") {
          this.jump();
        }
      };
      start = () => {
        this.started = true;
        this.block.style.animation = "block 1s infinite linear";
      };
      displayMessage = (message) => {
        document.getElementById("text").textContent = message;
      };
      checkIfDead = () => {
        this.setInterval = setInterval(() => {
          var characterTop = parseInt(
            window.getComputedStyle(this.character).getPropertyValue("top")
          );
          var blockLeft = parseInt(
            window.getComputedStyle(this.block).getPropertyValue("left")
          );
          if (blockLeft < 20 && blockLeft > 0 && characterTop >= 290) {
            this.end();
            this.displayMessage("You lost!");
            this.callback("Lost");
          }
        }, 10);
      };
      jump = () => {
        if (this.character.classList != "animate") {
          this.character.classList.add("animate");
          if (this.started) {
            this.jumpCounter += 1;
            this.displayMessage(`Almost there... ${this.jumpCounter}`);
          }
          if (this.jumpCounter > 4) {
            setTimeout(() => {
              this.end();
              this.displayMessage("You won! \u{1F36A}");
              this.callback("Won");
            }, 500);
          }
        }
        setTimeout(function() {
          this.character.classList.remove("animate");
        }, 500);
      };
    };
    module2.exports = BlockJumpGame;
  }
});

// lib/cookieJar1.js
var require_cookieJar1 = __commonJS({
  "lib/cookieJar1.js"(exports, module2) {
    var Vec = require_vector();
    var BlockJumpGame = require_blockJumpGame();
    var State = require_state();
    var CookieJar1 = class {
      constructor(pos, speed, updatedState = null, miniGame = BlockJumpGame) {
        this.pos = pos;
        this.speed = speed;
        this.updatedState = updatedState;
        this.miniGame = miniGame;
      }
      get type() {
        return "cookieJar1";
      }
      static create(pos) {
        return new CookieJar1(pos, new Vec(0, 0));
      }
      update(time, state, keys) {
        return new CookieJar1(
          this.pos,
          this.speed,
          this.updatedState,
          this.miniGame
        );
      }
      collide(state) {
        if (state.miniGameStatus == null) {
          this.updatedState = new State(
            state.level,
            state.actors,
            state.status,
            "playing",
            state.cookieJar1Cookie,
            state.cookieJar2Cookie
          );
          const miniGame = new this.miniGame();
          const callbackFunction = (result) => {
            if (result === "Lost") {
              let newState = new State(
                state.level,
                state.actors,
                state.status,
                "Lost",
                state.cookieJar1Cookie,
                state.cookieJar2Cookie
              );
              this.updatedState = newState;
            } else if (result === "Won") {
              let newState = new State(
                state.level,
                state.actors,
                state.status,
                "Won",
                state.cookieJar1Cookie,
                state.cookieJar2Cookie
              );
              newState.cookieJar1Cookie += 1;
              this.updatedState = newState;
            }
          };
          miniGame.run(callbackFunction);
        }
        return this.updatedState;
      }
    };
    CookieJar1.prototype.size = new Vec(1, 1);
    module2.exports = CookieJar1;
  }
});

// lib/matrixGame.js
var require_matrixGame = __commonJS({
  "lib/matrixGame.js"(exports, module2) {
    var MatrixGame = class {
      constructor() {
        this.callback;
      }
      run = (callback) => {
        this.callback = callback;
        this.displayMessage(
          "Make your choice. Press [R] for the red pill, [B] for the blue pill."
        );
        this.imageOne = this.addImage("img/matrix.png", "matrix");
        this.imageTwo = this.addImage("img/pills.png", "pills");
        window.addEventListener("keydown", this.keyHandlerFunction);
      };
      end = () => {
        this.imageOne.remove();
        this.imageTwo.remove();
        window.removeEventListener("keydown", this.keyHandlerFunction);
      };
      keyHandlerFunction = (event) => {
        if (event.key == "r") {
          this.end();
          this.displayMessage("You won! \u{1F36A}");
          this.callback("Won");
        }
        if (event.key == "b") {
          this.end();
          this.displayMessage("You lost!");
          this.callback("Lost");
        }
      };
      displayMessage = (message) => {
        document.getElementById("text").textContent = message;
      };
      addImage = (url, id) => {
        const image = document.createElement("img");
        image.src = url;
        image.id = id;
        document.body.appendChild(image);
        return image;
      };
    };
    module2.exports = MatrixGame;
  }
});

// lib/cookieJar2.js
var require_cookieJar2 = __commonJS({
  "lib/cookieJar2.js"(exports, module2) {
    var Vec = require_vector();
    var MatrixGame = require_matrixGame();
    var State = require_state();
    var CookieJar2 = class {
      constructor(pos, speed, updatedState = null, miniGame = MatrixGame) {
        this.pos = pos;
        this.speed = speed;
        this.updatedState = updatedState;
        this.miniGame = miniGame;
      }
      get type() {
        return "cookieJar2";
      }
      static create(pos) {
        return new CookieJar2(pos, new Vec(0, 0));
      }
      update(time, state, keys) {
        return new CookieJar2(
          this.pos,
          this.speed,
          this.updatedState,
          this.miniGame
        );
      }
      collide(state) {
        if (state.miniGameStatus == null) {
          this.updatedState = new State(
            state.level,
            state.actors,
            state.status,
            "playing",
            state.cookieJar1Cookie,
            state.cookieJar2Cookie
          );
          const miniGame = new this.miniGame();
          const callbackFunction = (result) => {
            if (result === "Lost") {
              let newState = new State(
                state.level,
                state.actors,
                state.status,
                "Lost",
                state.cookieJar1Cookie,
                state.cookieJar2Cookie
              );
              this.updatedState = newState;
            } else if (result === "Won") {
              let newState = new State(
                state.level,
                state.actors,
                state.status,
                "Won",
                state.cookieJar1Cookie,
                state.cookieJar2Cookie
              );
              newState.cookieJar2Cookie += 1;
              this.updatedState = newState;
            }
          };
          miniGame.run(callbackFunction, this);
        }
        return this.updatedState;
      }
    };
    CookieJar2.prototype.size = new Vec(1, 1);
    module2.exports = CookieJar2;
  }
});

// lib/exit.js
var require_exit = __commonJS({
  "lib/exit.js"(exports, module2) {
    var Vec = require_vector();
    var State = require_state();
    var levelPlans2 = require_levelPlans();
    var Exit = class {
      constructor(pos, speed) {
        this.pos = pos;
        this.speed = speed;
      }
      get type() {
        return "exit";
      }
      static create(pos) {
        return new Exit(pos, new Vec(0, 0));
      }
      update(time, state, keys) {
        return new Exit(this.pos, this.speed);
      }
      collide(state, levelConstructor) {
        const newState = new State(
          state.level,
          state.actors,
          state.status,
          state.miniGameStatus,
          state.cookieJar1Cookie,
          state.cookieJar2Cookie
        );
        document.getElementById("text").textContent = "You escaped!";
        newState.level = new levelConstructor(levelPlans2[2]);
        newState.actors = newState.level.startActors;
        newState.status = "Won";
        return newState;
      }
    };
    Exit.prototype.size = new Vec(1, 1);
    module2.exports = Exit;
  }
});

// lib/levelCharTypes.js
var require_levelCharTypes = __commonJS({
  "lib/levelCharTypes.js"(exports, module2) {
    var Player = require_player();
    var CookieMonster = require_cookieMonster();
    var CookieJar1 = require_cookieJar1();
    var CookieJar2 = require_cookieJar2();
    var Exit = require_exit();
    var levelCharTypes = {
      ".": "empty",
      "#": "wall",
      "M": CookieMonster,
      "@": Player,
      "*": Exit,
      "1": CookieJar1,
      "2": CookieJar2
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

// lib/canvasDisplay.js
var require_canvasDisplay = __commonJS({
  "lib/canvasDisplay.js"(exports, module2) {
    var CanvasDisplay2 = class {
      constructor(parent, level2) {
        this.scale = 40;
        this.parent = parent;
        this.addCanvas(level2);
        this.cookieJarSprite = document.createElement("img");
        this.cookieJarSprite.src = "../img/cookieJar.png";
        this.playerSprites = document.createElement("img");
        this.playerSprites.src = "../img/player.png";
        this.wallSprite = document.createElement("img");
        this.wallSprite.src = "img/wall.png";
        this.cookieMonsterSprite = document.createElement("img");
        this.cookieMonsterSprite.src = "img/cookieMonster2.png";
        this.backgroundSprite = document.createElement("img");
        this.backgroundSprite.src = "img/background-tile.jpeg";
        this.exitSprite = document.createElement("img");
        this.exitSprite.src = "img/diamond.png";
        this.winBackgroundSprite = document.createElement("img");
        this.winBackgroundSprite.src = "img/clouds.jpeg";
        this.drawBackground(level2);
      }
      addCanvas(level2) {
        this.canvas = document.createElement("canvas");
        this.canvas.id = "main-game";
        this.canvas.width = level2.width * this.scale;
        this.canvas.height = level2.height * this.scale;
        this.parent.appendChild(this.canvas);
        this.cx = this.canvas.getContext("2d");
      }
      clear() {
        this.canvas.remove();
      }
      syncState(state) {
        if (state.miniGameStatus == "playing") {
          this.canvas.style.display = "none";
        } else {
          this.canvas.style.display = "inline";
          this.clearDisplay(state.status);
          this.drawBackground(state.level);
          this.drawActors(state.actors);
        }
      }
      clearDisplay = function(status) {
        let pattern;
        if (status == "playing") {
          pattern = this.cx.createPattern(this.backgroundSprite, "repeat");
        } else if (status == "Won") {
          pattern = this.cx.createPattern(this.winBackgroundSprite, "repeat");
        }
        this.cx.fillStyle = pattern;
        this.cx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      };
      drawBackground = function(level2) {
        for (let y = 0; y < level2.height; y++) {
          for (let x = 0; x < level2.width; x++) {
            let tile = level2.rows[y][x];
            if (tile == "empty") {
              continue;
            } else if (tile == "wall") {
              this.cx.drawImage(
                this.wallSprite,
                x * this.scale,
                y * this.scale,
                this.scale,
                this.scale
              );
            }
          }
        }
      };
      drawActors = function(actors) {
        for (let actor of actors) {
          let width = actor.size.x * this.scale;
          let height = actor.size.y * this.scale;
          let x = actor.pos.x * this.scale;
          let y = actor.pos.y * this.scale;
          if (actor.type == "player") {
            this.drawPlayer(actor, x, y, width, height);
          } else if (actor.type == "cookieJar1") {
            this.cx.drawImage(this.cookieJarSprite, x, y, this.scale, this.scale);
          } else if (actor.type == "cookieJar2") {
            this.cx.drawImage(this.cookieJarSprite, x, y, this.scale, this.scale);
          } else if (actor.type == "exit") {
            this.cx.drawImage(this.exitSprite, x, y, this.scale, this.scale);
          } else if (actor.type == "cookieMonster") {
            this.cx.drawImage(
              this.cookieMonsterSprite,
              x,
              y,
              this.scale,
              this.scale
            );
          }
        }
      };
      drawPlayer = function(player, x, y, width, height) {
        this.cx.drawImage(this.playerSprites, x, y, width, height);
      };
    };
    module2.exports = CanvasDisplay2;
  }
});

// lib/game.js
var require_game = __commonJS({
  "lib/game.js"(exports, module2) {
    var State = require_state();
    var Game2 = class {
      constructor(level2, Display, Level2) {
        this.level = level2;
        this.display = new Display(document.body, level2);
        this.state = State.start(level2);
        this.arrowKeysTracker = this.#trackKeys([
          "ArrowLeft",
          "ArrowRight",
          "ArrowUp",
          "ArrowDown"
        ]);
        this.levelConstructor = Level2;
      }
      run() {
        this.#runAnimation(this.#updateFrame);
      }
      #updateFrame = (time) => {
        this.state = this.state.update(
          time,
          this.arrowKeysTracker,
          this.levelConstructor
        );
        this.display.syncState(this.state);
      };
      #runAnimation(updateFrame) {
        let lastTime = null;
        function frame(time) {
          if (lastTime != null) {
            let timeStep = Math.min(time - lastTime, 100) / 1e3;
            updateFrame(timeStep);
          }
          lastTime = time;
          requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
      }
      #trackKeys(keys) {
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
    module2.exports = Game2;
  }
});

// index.js
var Level = require_level();
var levelPlans = require_levelPlans();
var CanvasDisplay = require_canvasDisplay();
var Game = require_game();
var level = new Level(levelPlans[0]);
var game = new Game(level, CanvasDisplay, Level);
game.run();
