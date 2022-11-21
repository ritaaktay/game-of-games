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
      constructor(level2, actors, status = "playing", miniGameStatus = null) {
        this.level = level2;
        this.actors = actors;
        console.log(this.actors);
        this.status = status;
        this.miniGameStatus = miniGameStatus;
      }
      static start(level2) {
        return new State(level2, level2.startActors);
      }
      get player() {
        console.log(this.actors);
        return this.actors.find((a) => a.type == "player");
      }
      get cookieJars() {
        return this.actors.filter((actor) => actor.type == "cookieJar");
      }
      get cookieCount() {
        return this.cookieJars.map((cj) => cj.cookies).reduce((a, b) => a + b);
      }
      update = function(time, keys, levelConstructor2) {
        let actors = this.actors;
        if (this.miniGameStatus != "playing") {
          actors = this.actors.map((actor) => {
            if (actor.type == "player")
              return actor.update(time, this, keys);
            return actor;
          });
        }
        let newState = new State(
          this.level,
          actors,
          this.status,
          this.miniGameStatus
        );
        let player = newState.player;
        for (let actor of actors) {
          if (actor != player && this.overlap(actor, player)) {
            newState = actor.collide(newState, levelConstructor2);
          }
        }
        newState = this.#resetMiniGameStatus(state, player);
        return newState;
      };
      #resetMiniGameStatus = (state2, player) => {
        if (state2.cookieJars.every((cj) => !this.#overlap(cj, player)) && (state2.miniGameStatus == "won" || state2.miniGameStatus == "lost")) {
          state2.miniGameStatus = null;
        }
        return state2;
      };
      #overlap = function(actor1, actor2) {
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
.................!
..............####
..########....#..*
..#......#....#...
..#......#......#.
..#...#..#....M.#.
..#...#.........#.
.@#..!#.......#...`;
    var noMonsterLevelPlan = `
..................
.................!
..............####
..########....#...
..#......#....#...
..#......#........
..#...#..#........
..#...#...........
.@#..!#.......#...`;
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
      collide(state2, Level2) {
        let newState = new State(
          state2.level,
          state2.actors,
          state2.status,
          state2.miniGameStatus
        );
        newState = this.#checkCookies(newState, Level2);
        return newState;
      }
      #checkCookies(state2, Level2) {
        if (state2.cookieJars.every((cj) => cj.cookies < 1)) {
          this.#speak("Give me cookies!");
        } else if (state2.cookieJars.some((cj) => cj.cookies < 1)) {
          this.#speak(
            `Give me more cookies! You have: ${"\u{1F36A}".repeat(state2.cookieCount)}`
          );
        } else {
          this.#speak("Mmmm delicious! Now, escape before it's too late!");
          state2.level = new levelConstructor(levelPlans2[1]);
        }
        return state2;
      }
      #speak(message2) {
        document.getElementById("text").textContent = message2;
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
      update(time, state2, keys) {
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
        if (!state2.level.touchesElement(movedX, this.size, "wall")) {
          pos = movedX;
        }
        let movedY = pos.plus(new Vec(0, ySpeed * time));
        if (!state2.level.touchesElement(movedY, this.size, "wall")) {
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
      displayMessage = (message2) => {
        document.getElementById("text").textContent = message2;
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
            this.callback("lost");
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
              this.callback("won");
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

// lib/cookieJar.js
var require_cookieJar = __commonJS({
  "lib/cookieJar.js"(exports, module2) {
    var Vec = require_vector();
    var BlockJumpGame = require_blockJumpGame();
    var State = require_state();
    var CookieJar = class {
      constructor(pos, speed, MiniGameConsturctor, storedState = null, cookies = 0) {
        this.pos = pos;
        this.speed = speed;
        this.MiniGameConsturctor = MiniGameConsturctor;
        this.storedState = storedState;
        this.cookies = cookies;
      }
      get type() {
        return "cookieJar";
      }
      static create(pos, MiniGameConsturctor) {
        return new CookieJar(pos, new Vec(0, 0), MiniGameConsturctor);
      }
      collide(state2) {
        if (state2.miniGameStatus == null) {
          this.storedState = new State(
            state2.level,
            state2.actors,
            state2.status,
            "playing"
          );
          const miniGame = new this.MiniGameConsturctor();
          miniGame.run(this.miniGameCallback);
        }
        return this.storedState;
      }
      miniGameCallback = (result) => {
        if (result === "lost") {
          this.storedState.miniGameStatus = "lost";
        } else if (result === "won") {
          this.cookies += 1;
          this.storedState.miniGameStatus = "won";
        }
      };
    };
    CookieJar.prototype.size = new Vec(1, 1);
    module2.exports = CookieJar;
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
      collide(state2, levelConstructor2) {
        const newState = new State(
          state2.level,
          state2.actors,
          state2.status,
          state2.miniGameStatus
        );
        this.#speak(message);
        newState.level = new levelConstructor2(levelPlans2[2]);
        newState.actors = newState.level.startActors;
        newState.status = "won";
        return newState;
      }
      #speak(message2) {
        document.getElementById("text").textContent = message2;
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
    var CookieJar = require_cookieJar();
    var Exit = require_exit();
    var levelCharTypes = {
      ".": "empty",
      "#": "wall",
      "M": CookieMonster,
      "@": Player,
      "*": Exit,
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
      constructor(plan, MiniGameLocator2) {
        this.rows = this.#makeMatrix(plan);
        this.height = this.rows.length;
        this.width = this.rows[0].length;
        this.startActors = [];
        this.MiniGameLocator = new MiniGameLocator2();
        this.#mapActors();
        console.log(this.startActors);
      }
      #makeMatrix = (levelPlan) => {
        return levelPlan.trim().split("\n").map((l) => [...l]);
      };
      #mapActors = () => {
        this.rows = this.rows.map((row, y) => {
          return row.map((ch, x) => {
            let type = levelCharTypes[ch];
            if (typeof type == "string")
              return type;
            if (ch == "!") {
              this.startActors.push(
                type.create(new Vec(x, y), this.MiniGameLocator.getGame())
              );
            } else {
              this.startActors.push(type.create(new Vec(x, y)));
            }
            return "empty";
          });
        });
      };
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
      syncState(state2) {
        if (state2.miniGameStatus == "playing") {
          this.canvas.style.display = "none";
        } else {
          this.canvas.style.display = "inline";
          this.clearDisplay(state2.status);
          this.drawBackground(state2.level);
          this.drawActors(state2.actors);
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
          this.callback("won");
        }
        if (event.key == "b") {
          this.end();
          this.displayMessage("You lost!");
          this.callback("lost");
        }
      };
      displayMessage = (message2) => {
        document.getElementById("text").textContent = message2;
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

// lib/miniGameLocator.js
var require_miniGameLocator = __commonJS({
  "lib/miniGameLocator.js"(exports, module2) {
    var BlockJumpGame = require_blockJumpGame();
    var MatrixGame = require_matrixGame();
    var MiniGameLocator2 = class {
      constructor() {
        this.games = [BlockJumpGame, MatrixGame];
        this.assigned = [];
      }
      getGame() {
        const index = this.#getRandomIndex();
        const game2 = this.games[index];
        this.assigned.push(game2);
        this.games.splice(index, 1);
        return game2;
      }
      #getRandomIndex() {
        if (this.games.length < 1) {
          throw Error("No more mini-games left to assign!");
        }
        return Math.floor(Math.random() * this.games.length);
      }
    };
    module2.exports = MiniGameLocator2;
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
var MiniGameLocator = require_miniGameLocator();
var Game = require_game();
var level = new Level(levelPlans[0], MiniGameLocator);
var game = new Game(level, CanvasDisplay, Level);
game.run();
