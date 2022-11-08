class BlockJumpGame {
  constructor() {
    this.character = document.getElementById("character");
    this.block = document.getElementById("block");
    this.jumpButton = document.getElementById("jump-button");
    this.startButton = document.getElementById("start-button");
    this.startButton.addEventListener("click", this.start);
    this.jumpButton.addEventListener("click", this.jump);
    this.jumpCounter = 0;
    this.callback;
  }

  run = (callback) => {
    this.checkIfDead();
    this.callback = callback;
    document.getElementById("block_jump_game_container").style.display =
      "inline";
  };

  start = () => {
    this.block.style.animation = "block 1s infinite linear";
  };

  clear = () => {
    document.getElementById("block_jump_game_container").style.display = "none";
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
        this.clear();
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
          this.jumpCounter = 0;
          this.clear();
          this.callback("Won");
        }, 500);
      }
    }
    setTimeout(function () {
      this.character.classList.remove("animate");
    }, 500);
  };
}

module.exports = BlockJumpGame;
