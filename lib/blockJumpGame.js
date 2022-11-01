class BlockJumpGame {
  constructor() {
    this.character = document.getElementById("character");
    this.block = document.getElementById("block");
    this.button = document.getElementById("jump-button");
    this.checkIfDead();
    console.log(this.block);
    this.button.addEventListener("click", this.jump);
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
    if (this.character.classList != "animate") {
      this.character.classList.add("animate");
    }
    setTimeout(function () {
      this.character.classList.remove("animate");
    }, 500);
  };
}

module.exports = BlockJumpGame;
