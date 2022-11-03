class DumbMiniGame {
  constructor() {
    this.redButton = document.getElementById("red-button");
    this.blueButton = document.getElementById("blue-button");
    this.callback;
    this.result = 0;
  }

  run = (callback) => {
    this.callback = callback;
    document.getElementById("dumb-mini-game").style.display = "inline";
    this.redButton.addEventListener("click", this.redButtonEventListener);
    this.blueButton.addEventListener("click", this.blueButtonEventListener);
    return result;
  };

  redButtonEventListener = () => {
    this.result = "won";
    const newState = this.callback("lost");
  };

  blueButtonEventListener = () => {
    this.result = "lost";
    this.callback("won");
  };
}

module.exports = DumbMiniGame;
