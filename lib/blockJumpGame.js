class BlockJumpGame {
  constructor() {
    // might be a better idea to dynamically add these css elements
    // each time game is created, and remove them after each play
    this.character = document.getElementById("character");
    this.block = document.getElementById("block");
    this.jumpButton = document.getElementById("jump-button");
    this.startButton = document.getElementById("start-button");
    this.checkIfDead();
    this.jumpButton.addEventListener("click", this.jump);
    this.startButton.addEventListener("click", this.start);
    this.jumpCounter = 0;
  }

  start() {
    block.style.animation = "block 2s infinite linear";
  }

  checkIfDead() {
    setInterval(function () {
      var characterTop = parseInt(
        window.getComputedStyle(this.character).getPropertyValue("top")
      );
      var blockLeft = parseInt(
        window.getComputedStyle(this.block).getPropertyValue("left")
      );
      if (blockLeft < 20 && blockLeft > 0 && characterTop >= 130) {
        block.style.animation = "none";
        block.style.display = "none";
        alert("You Lost.");
      }
    }, 10);
  }

  jump = () => {
    this.jumpCounter += 1;
    if (this.character.classList != "animate") {
      this.character.classList.add("animate");
      if (this.jumpCounter > 4) {
        // wins at 5th successful jump
        // setTimeout for 500ms which is the duration of jump
        // so wins when touching floor after jump, not on click!
        setTimeout(function () {
          block.style.animation = "none";
          alert("You won!");
        }, 500);
      }
    }
    setTimeout(function () {
      this.character.classList.remove("animate");
    }, 500);
  };
}

module.exports = BlockJumpGame;
