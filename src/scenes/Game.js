import Phaser from "phaser";

export default class Game extends Phaser.Scene {
  constructor() {
    super("game");
  }

  preload() {
    this.load.image("background", "public/images/bg_layer1.png");
    this.load.image("platform", "public/images/ground_grass.png");
  }
  create() {
    this.add.image(240, 320, "background");
    this.add.image(240, 320, "platform").setScale(0.5);
  }
}
