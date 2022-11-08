class CanvasDisplay {
  constructor(parent, level) {
    this.scale = 40;

    // <canvas> element setup
    this.canvas = document.createElement("canvas");
    this.canvas.className = "main-game";
    // Level width = 18 * 40 = 720
    this.canvas.width = level.width * this.scale;
    // Level height = 9 * 40 = 360
    this.canvas.height = level.height * this.scale;

    // Add <canvas> element to <body>
    parent.appendChild(this.canvas);

    // "2d" context setup
    this.cx = this.canvas.getContext("2d");

    // cookieJarSprite set-up
    this.cookieJarSprite = document.createElement("img");
    this.cookieJarSprite.src = "../img/cookieJar.png";

    // playerSprite set-up
    this.playerSprites = document.createElement("img");
    this.playerSprites.src = "../img/player.png";

    this.drawBackground(level);
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
  for (let y = 0; y < level.height; y++) {
    for (let x = 0; x < level.width; x++) {
      let tile = level.rows[y][x];
      // Add in if "wall"
      if (tile == "empty") {
        this.cx.fillStyle = "rgb(200, 200, 200)";
        this.cx.fillRect(
          x * this.scale,
          y * this.scale,
          this.scale,
          this.scale
        );
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

CanvasDisplay.prototype.drawActors = function (actors) {
  for (let actor of actors) {
    let width = actor.size.x * this.scale;
    let height = actor.size.y * this.scale;
    let x = actor.pos.x * this.scale;
    let y = actor.pos.y * this.scale;
    if (actor.type == "player") {
      this.drawPlayer(actor, x, y, width, height);
    } else if (actor.type == "cookieJar") {
      this.cx.drawImage(this.cookieJarSprite, x, y, this.scale, this.scale);
    }
  }
};

CanvasDisplay.prototype.drawPlayer = function (player, x, y, width, height) {
  this.cx.drawImage(this.playerSprites, x, y, width, height);
};

module.exports = CanvasDisplay;
