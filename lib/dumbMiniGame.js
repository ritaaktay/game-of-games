class DumbMiniGame {
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
}

module.exports = DumbMiniGame;
