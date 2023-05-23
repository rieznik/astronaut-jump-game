import Phaser from "phaser";

export default class GameOver extends Phaser.Scene {
  constructor() {
    super("game-over");
  }

  init(data) {
    this.score = data.score;
  }

  create() {
    const width = this.scale.width;
    const height = this.scale.height;

    this.add
      .text(width * 0.5, height * 0.35, "Game Over", { fontSize: 48 })
      .setOrigin(0.5);
    this.add
      .text(width * 0.5, height * 0.45, `Score: ${this.score}`, {
        fontSize: 42,
      })
      .setOrigin(0.5);
    this.add
      .text(width * 0.5, height * 0.55, "Press SPACE to restart", {
        fontSize: 24,
      })
      .setOrigin(0.5);

    this.input.keyboard.once("keydown-SPACE", () => {
      this.scene.start("game");
    });
  }
}
