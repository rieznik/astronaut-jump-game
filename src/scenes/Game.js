import Phaser from "phaser";

export default class Game extends Phaser.Scene {
  constructor() {
    super("game");
  }

  preload() {
    this.load.image("background", "public/images/bg_layer1.png");
    this.load.image("platform", "public/images/ground_grass.png");
    this.load.image("bunny-stand", "public/images/bunny1_stand.png");
  }
  create() {
    this.add.image(240, 320, "background");

    const platforms = this.physics.add.staticGroup();

    for (let i = 0; i < 5; ++i) {
      const x = Phaser.Math.Between(80, 400);
      const y = 150 * i;

      const platform = platforms.create(x, y, "platform");
      platform.scale = 0.5;

      const body = platform.body;
      body.updateFromGameObject();
    }

    const player = this.physics.add
      .sprite(240, 320, "bunny-stand")
      .setScale(0.5);

    this.physics.add.collider(platforms, player);
  }
}
