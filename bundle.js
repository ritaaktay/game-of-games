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
      constructor(pos, velocity) {
        this.pos = pos;
        this.velocity = velocity;
        this.speed = 6;
      }
      get type() {
        return "player";
      }
      static create(pos) {
        return new Player(pos, new Vec(0, 0));
      }
      update(time, state, keys) {
        let xVelocity = 0;
        if (keys.ArrowLeft)
          xVelocity -= this.speed;
        if (keys.ArrowRight)
          xVelocity += this.speed;
        let yVelocity = 0;
        if (keys.ArrowUp)
          yVelocity -= this.speed;
        if (keys.ArrowDown)
          yVelocity += this.speed;
        let pos = this.pos;
        let movedX = pos.plus(new Vec(xVelocity * time, 0));
        if (!state.level.touchesWall(movedX, this.size)) {
          pos = movedX;
        }
        let movedY = pos.plus(new Vec(0, yVelocity * time));
        if (!state.level.touchesWall(movedY, this.size)) {
          pos = movedY;
        }
        return new Player(pos, new Vec(xVelocity, yVelocity));
      }
    };
    Player.prototype.size = new Vec(1, 1);
    module2.exports = Player;
  }
});

// lib/state.js
var require_state = __commonJS({
  "lib/state.js"(exports, module2) {
    var State = class {
      constructor(level2, actors, status = "playing", miniGameStatus = null) {
        this.level = level2;
        this.actors = actors;
        this.status = status;
        this.miniGameStatus = miniGameStatus;
      }
      static start(level2) {
        return new State(level2, level2.startActors);
      }
      get player() {
        return this.actors.find((a) => a.type == "player");
      }
      get cookieJars() {
        return this.actors.filter((actor) => actor.type == "cookieJar");
      }
      get cookieCount() {
        return this.cookieJars.map((cj) => cj.cookies).reduce((a, b) => a + b);
      }
      update = function(time, keys) {
        let newState = new State(
          this.level,
          this.actors,
          this.status,
          this.miniGameStatus
        );
        newState = this.#updatePlayer(newState, time, keys);
        newState = this.#resetMiniGameStatus(newState);
        newState = this.#checkCollisions(newState);
        return newState;
      };
      #checkCollisions(state) {
        for (let actor of state.actors) {
          if (actor != state.player && this.#checkOverlap(actor, state.player)) {
            return actor.collide(state);
          }
        }
        return state;
      }
      #updatePlayer(state, time, keys) {
        if (state.miniGameStatus != "playing") {
          state.actors = state.actors.map((actor) => {
            return actor.type == "player" ? actor.update(time, state, keys) : actor;
          });
        }
        return state;
      }
      #resetMiniGameStatus = (state) => {
        if (state.cookieJars.every((cj) => !this.#checkOverlap(cj, state.player)) && (state.miniGameStatus == "won" || state.miniGameStatus == "lost")) {
          state.miniGameStatus = null;
        }
        return state;
      };
      #checkOverlap = function(actor1, actor2) {
        return actor1.pos.x + actor1.size.x > actor2.pos.x && actor1.pos.x < actor2.pos.x + actor2.size.x && actor1.pos.y + actor1.size.y > actor2.pos.y && actor1.pos.y < actor2.pos.y + actor2.size.y;
      };
    };
    module2.exports = State;
  }
});

// lib/cookieMonster.js
var require_cookieMonster = __commonJS({
  "lib/cookieMonster.js"(exports, module2) {
    var Vec = require_vector();
    var State = require_state();
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
      collide(state) {
        let newState = new State(
          state.level,
          state.actors,
          state.status,
          state.miniGameStatus
        );
        newState = this.#checkCookies(newState);
        return newState;
      }
      #checkCookies(state) {
        if (state.cookieJars.every((cj) => cj.cookies < 1)) {
          this.#speak("Give me cookies!");
        } else if (state.cookieJars.some((cj) => cj.cookies < 1)) {
          this.#speak(
            `Give me more cookies! You have: ${"\u{1F36A}".repeat(state.cookieCount)}`
          );
        } else {
          this.#speak("Mmmm delicious! Now, escape before it's too late!");
          state.level = state.level.switch("pass");
        }
        return state;
      }
      #speak(message) {
        document.getElementById("text").textContent = message;
      }
    };
    CookieMonster.prototype.size = new Vec(1, 1);
    module2.exports = CookieMonster;
  }
});

// lib/cookieJar.js
var require_cookieJar = __commonJS({
  "lib/cookieJar.js"(exports, module2) {
    var Vec = require_vector();
    var State = require_state();
    var CookieJar = class {
      constructor(pos, speed, miniGameLocator, storedState = null, cookies = 0) {
        this.pos = pos;
        this.speed = speed;
        this.MiniGameConsturctor = miniGameLocator.getGame();
        this.storedState = storedState;
        this.cookies = cookies;
      }
      get type() {
        return "cookieJar";
      }
      static create(pos, miniGameLocator) {
        return new CookieJar(pos, new Vec(0, 0), miniGameLocator);
      }
      collide(state) {
        if (state.miniGameStatus == null) {
          this.storedState = new State(
            state.level,
            state.actors,
            state.status,
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
      collide(state) {
        const newState = new State(
          state.level,
          state.actors,
          state.status,
          state.miniGameStatus
        );
        this.#clearSpeech();
        newState.level = newState.level.switch("escape");
        newState.actors = newState.level.startActors;
        newState.status = "won";
        return newState;
      }
      #clearSpeech(message) {
        document.getElementById("text").textContent = "";
      }
    };
    Exit.prototype.size = new Vec(1, 1);
    module2.exports = Exit;
  }
});

// lib/levelTypes.js
var require_levelTypes = __commonJS({
  "lib/levelTypes.js"(exports, module2) {
    var Player = require_player();
    var CookieMonster = require_cookieMonster();
    var CookieJar = require_cookieJar();
    var Exit = require_exit();
    var levelTypes = {
      ".": "empty",
      "#": "wall",
      "M": CookieMonster,
      "@": Player,
      "*": Exit,
      "!": CookieJar
    };
    module2.exports = levelTypes;
  }
});

// lib/level.js
var require_level = __commonJS({
  "lib/level.js"(exports, module2) {
    var Vec = require_vector();
    var levelTypes = require_levelTypes();
    var Level2 = class {
      constructor(plans, MiniGameLocator2) {
        this.plans = plans;
        this.startActors = [];
        this.MiniGameLocator = new MiniGameLocator2();
        this.#makeMatrix(this.plans["start"]);
      }
      switch = (stage) => {
        this.startActors = [];
        this.#makeMatrix(this.plans[stage]);
        return this;
      };
      #makeMatrix = (levelPlan) => {
        this.rows = levelPlan.trim().split("\n").map((l) => [...l]);
        this.height = this.rows.length;
        this.width = this.rows[0].length;
        this.#mapActors();
      };
      #mapActors = () => {
        this.rows = this.rows.map((row, y) => {
          return row.map((index, x) => {
            let type = levelTypes[index];
            if (this.#isBackground(type))
              return type;
            this.startActors.push(type.create(new Vec(x, y), this.MiniGameLocator));
            return "empty";
          });
        });
      };
      #isBackground = (type) => {
        return typeof type == "string";
      };
      touchesWall = function(pos, size) {
        let xStart = Math.floor(pos.x);
        let xEnd = Math.ceil(pos.x + size.x);
        let yStart = Math.floor(pos.y);
        let yEnd = Math.ceil(pos.y + size.y);
        for (let y = yStart; y < yEnd; y++) {
          for (let x = xStart; x < xEnd; x++) {
            let isOutside = x < 0 || x >= this.width || y < 0 || y >= this.height;
            let here = isOutside ? "wall" : this.rows[y][x];
            if (here == "wall")
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
    var start = `
..................
.................!
..............####
..########....#..*
..#......#....#...
..#......#......#.
..#...#..#....M.#.
..#...#.........#.
.@#..!#.......#...`;
    var pass = `
..................
..................
..............####
..########....#...
..#......#....#...
..#......#........
..#...#..#........
..#...#...........
..#...#.......#...`;
    var escape = `
..................
..................
..................
.................@
..................
..................
..................
..................
..................`;
    var levelPlans2 = {
      "start": start,
      "pass": pass,
      "escape": escape
    };
    module2.exports = levelPlans2;
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
        this.#setSprites();
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
      syncState(state) {
        if (state.miniGameStatus == "playing") {
          this.canvas.style.display = "none";
        } else {
          this.canvas.style.display = "inline";
          this.resetDisplay(state.status);
          this.drawBackground(state.level);
          this.drawActors(state.actors);
        }
      }
      resetDisplay = function(status) {
        let pattern = this.cx.createPattern(
          this.backgroundSprites[status],
          "repeat"
        );
        this.cx.fillStyle = pattern;
        this.cx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      };
      drawBackground = function(level2) {
        for (let y = 0; y < level2.height; y++) {
          for (let x = 0; x < level2.width; x++) {
            let tile = level2.rows[y][x];
            if (tile == "empty")
              continue;
            this.cx.drawImage(
              this.backgroundSprites[tile],
              x * this.scale,
              y * this.scale,
              this.scale,
              this.scale
            );
          }
        }
      };
      drawActors = function(actors) {
        for (let actor of actors) {
          let width = actor.size.x * this.scale;
          let height = actor.size.y * this.scale;
          let x = actor.pos.x * this.scale;
          let y = actor.pos.y * this.scale;
          this.cx.drawImage(this.actorSprites[actor.type], x, y, width, height);
        }
      };
      #setSprites = () => {
        const cookieJarSprite = document.createElement("img");
        cookieJarSprite.src = "../img/cookieJar.png";
        const playerSprite = document.createElement("img");
        playerSprite.src = "../img/player.png";
        const cookieMonsterSprite = document.createElement("img");
        cookieMonsterSprite.src = "img/cookieMonster2.png";
        const exitSprite = document.createElement("img");
        exitSprite.src = "img/diamond.png";
        const backgroundSprite = document.createElement("img");
        backgroundSprite.src = "img/background-tile.jpeg";
        const wonBackgroundSprite = document.createElement("img");
        wonBackgroundSprite.src = "img/clouds.jpeg";
        const wallSprite = document.createElement("img");
        wallSprite.src = "img/wall.png";
        this.backgroundSprites = {
          "playing": backgroundSprite,
          "won": wonBackgroundSprite,
          "wall": wallSprite
        };
        this.actorSprites = {
          "cookieMonster": cookieMonsterSprite,
          "player": playerSprite,
          "exit": exitSprite,
          "cookieJar": cookieJarSprite
        };
      };
    };
    module2.exports = CanvasDisplay2;
  }
});

// lib/jumpGame.js
var require_jumpGame = __commonJS({
  "lib/jumpGame.js"(exports, module2) {
    var JumpGame = class {
      constructor(cookieJarId) {
        this.character = document.getElementById("character");
        this.block = document.getElementById("block");
        this.jumpCounter = 0;
        this.callback;
        this.started = false;
      }
      run = (callback) => {
        window.addEventListener("keydown", this.#keysEventListener);
        this.#checkIfDead();
        this.#displayMessage(
          "Jump over the meteorites! Press [Enter] to start and [Space Bar] to jump"
        );
        this.callback = callback;
        document.getElementById("block_jump_game_container").style.display = "inline";
      };
      #keysEventListener = (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          this.#start();
        }
        if (event.key === " ") {
          event.preventDefault();
          this.#jump();
        }
      };
      #start = () => {
        this.started = true;
        this.block.style.animation = "block 1s infinite linear";
      };
      #checkIfDead = () => {
        this.setInterval = setInterval(() => {
          var characterTop = parseInt(
            window.getComputedStyle(this.character).getPropertyValue("top")
          );
          var blockLeft = parseInt(
            window.getComputedStyle(this.block).getPropertyValue("left")
          );
          if (blockLeft < 20 && blockLeft > 0 && characterTop >= 290) {
            this.#lose();
          }
        }, 10);
      };
      #jump = () => {
        if (this.character.classList != "animate") {
          this.character.classList.add("animate");
          if (this.started)
            this.#increment();
          if (this.jumpCounter > 4)
            this.#win();
        }
        setTimeout(function() {
          this.character.classList.remove("animate");
        }, 500);
      };
      #increment = () => {
        this.jumpCounter += 1;
        this.#displayMessage(`Almost there... ${this.jumpCounter}`);
      };
      #win = () => {
        setTimeout(() => {
          this.#end();
          this.#displayMessage("You won! \u{1F36A}");
          this.callback("won");
        }, 500);
      };
      #lose = () => {
        this.#end();
        this.#displayMessage("You lost!");
        this.callback("lost");
      };
      #end = () => {
        document.getElementById("block_jump_game_container").style.display = "none";
        this.jumpCounter = 0;
        clearInterval(this.setInterval);
        window.removeEventListener("keydown", this.#keysEventListener);
        this.block.style.animation = "none";
      };
      #displayMessage = (message) => {
        document.getElementById("text").textContent = message;
      };
    };
    module2.exports = JumpGame;
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

// lib/miniGameLocator.js
var require_miniGameLocator = __commonJS({
  "lib/miniGameLocator.js"(exports, module2) {
    var JumpGame = require_jumpGame();
    var MatrixGame = require_matrixGame();
    var MiniGameLocator2 = class {
      constructor() {
        this.games = [JumpGame, MatrixGame];
      }
      getGame() {
        const index = this.#getRandomIndex();
        const game2 = this.games[index];
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
      constructor(level2, Display) {
        this.level = level2;
        this.display = new Display(document.body, level2);
        this.state = State.start(level2);
        this.arrowKeysTracker = this.#trackKeys([
          "ArrowLeft",
          "ArrowRight",
          "ArrowUp",
          "ArrowDown"
        ]);
      }
      run() {
        this.#runAnimation();
      }
      #runAnimation() {
        let lastTime = null;
        const animationCallback = (time) => {
          if (lastTime != null) {
            let timeStep = Math.min(time - lastTime, 100) / 1e3;
            this.#updateFrame(timeStep);
          }
          lastTime = time;
          requestAnimationFrame(animationCallback);
        };
        requestAnimationFrame(animationCallback);
      }
      #updateFrame = (time) => {
        this.state = this.state.update(time, this.arrowKeysTracker);
        this.display.syncState(this.state);
      };
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
var level = new Level(levelPlans, MiniGameLocator);
var game = new Game(level, CanvasDisplay);
game.run();
