class CanvasDisplay {
  constructor(parent, level) {
    this.scale = 40;

    // <canvas> element setup
    this.canvas = document.createElement("canvas");
    this.canvas.className = "game";
    // Level width = 18 * 40 = 720
    this.canvas.width = Math.min(600, level.width * this.scale);
    // Level height = 9 * 40 = 360
    this.canvas.height = Math.min(450, level.height * this.scale);

    // Add <canvas> element to <body>
    parent.appendChild(this.canvas);

    // "2d" context setup
    this.cx = this.canvas.getContext("2d");

    this.viewport = {
      left: 0,
      top: 0,
      width: this.canvas.width / this.scale,
      height: this.canvas.height / this.scale,
    };

    // do we need to call .drawBackground() on each construction?
    // this.drawBackground(level);
  }

  clear() {
    this.canvas.remove();
  }
}

CanvasDisplay.prototype.syncState = function (state) {
  // this.clearDisplay(state.status);
  this.drawBackground(state.level);
  this.drawActors(state.actors);
};

// // - - - - WIP / TBC - - - -
// CanvasDisplay.prototype.clearDisplay = function (status) {
// if (status == "won") {
//   this.cx.fillStyle = "rgb(68, 191, 255)";
// } else if (status == "lost") {
//   this.cx.fillStyle = "rgb(44, 136, 214)";
// } else {
//   this.cx.fillStyle = "rgb(52, 166, 251)";
// }
// this.cx.fillRect(0, 0, this.canvas.width, this.canvas.height);
// };

// // - - - -
// // For use if using image tiles for background (non-actor) objects:
// let otherSprites = document.createElement("img");
// otherSprites.src = "../img/sprites.png";

CanvasDisplay.prototype.drawBackground = function (level) {
  let { left, top, width, height } = this.viewport;
  let xStart = Math.floor(left);
  let xEnd = Math.ceil(left + width);
  let yStart = Math.floor(top);
  let yEnd = Math.ceil(top + height);

  for (let y = yStart; y < yEnd; y++) {
    for (let x = xStart; x < xEnd; x++) {
      let tile = level.rows[y][x];
      // Add in if "wall"
      if (tile == "empty") {
        this.cx.fillStyle = "rgb(200, 200, 200)";
        this.cx.fillRect(x, y, x * this.scale, y * this.scale);
        // If using image tiles as background:
        // this.cx.drawImage(
        //   otherSprites,
        //   x * this.scale,
        //   y * this.scale,
        //   this.scale,
        //   this.scale
        // );
      }
    }
  }
};

// Setup for .drawPlayer()
let playerSprites = document.createElement("img");
playerSprites.src = "../img/player.png";

// .drawPlayer() is called by .drawActors()
CanvasDisplay.prototype.drawPlayer = function (player, x, y, width, height) {
  this.cx.drawImage(playerSprites, x, y, width, height);
};

// Setup for .drawActors()
let cookieJarSprite = document.createElement("img");
cookieJarSprite.src = "../img/cookieJar.png";

CanvasDisplay.prototype.drawActors = function (actors) {
  for (let actor of actors) {
    let width = actor.size.x * this.scale;
    let height = actor.size.y * this.scale;
    let x = actor.pos.x * this.scale;
    let y = actor.pos.y * this.scale;
    if (actor.type == "player") {
      this.drawPlayer(actor, x, y, width, height);
    } else if (actor.type == "cookieJar") {
      this.cx.drawImage(cookieJarSprite, x, y, this.scale, this.scale);
    }
  }
};

module.exports = CanvasDisplay;
