class BlockJumpGame {
  constructor(callback) {
    // might be a better idea to dynamically add these css elements
    // each time game is created, and remove them after each play
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
    // it has to be an arrow function passed to setInterval
    // for this.callback to refer to this as BlockJumpGame
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
        this.callback("Lost"); // communicate back to main game
      }
    }, 10);
  };

  jump = () => {
    this.jumpCounter += 1;
    if (this.character.classList != "animate") {
      this.character.classList.add("animate");
      if (this.jumpCounter > 4) {
        // it has to be an arrow function passed to setTimeout
        // for this.callback to refer to this as BlockJumpGame
        setTimeout(() => {
          block.style.animation = "none";
          alert("You Won!");
          this.callback("Won"); // communicate back to main game
        }, 500);
      }
    }
    setTimeout(function () {
      this.character.classList.remove("animate");
    }, 500);
  };
}

module.exports = BlockJumpGame;
