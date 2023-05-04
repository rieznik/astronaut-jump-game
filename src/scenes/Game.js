import Phaser from "phaser";

export default class Game extends Phaser.Scene {
  constructor() {
    super("game");
  }

  preload() {
    this.load.image("background", "/public/images/bg_layer1.png");
  }
  create() {
    this.add.image(240, 320, "background");
  }
}
