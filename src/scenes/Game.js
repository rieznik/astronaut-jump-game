import Phaser from "phaser";

export default class Game extends Phaser.Scene {
  platforms;
  player;
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

    // Create random platforms
    this.platforms = this.physics.add.staticGroup();

    for (let i = 0; i < 5; ++i) {
      const x = Phaser.Math.Between(80, 400);
      const y = 150 * i;

      const platform = this.platforms.create(x, y, "platform");
      platform.scale = 0.5;

      const body = platform.body;
      body.updateFromGameObject();
    }

    // Add a player and make it jump when landing
    this.player = this.physics.add
      .sprite(240, 320, "bunny-stand")
      .setScale(0.5);

    this.physics.add.collider(this.platforms, this.player);

    this.player.body.checkCollision.up = false;
    this.player.body.checkCollision.left = false;
    this.player.body.checkCollision.right = false;

    // follow the player
    this.cameras.main.startFollow(this.player);
  }

  update() {
    // Reuse platforms
    this.platforms.children.iterate((child) => {
      const platform = child;

      const scrollY = this.cameras.main.scrollY;
      if (platform.y >= scrollY + 700) {
        platform.y = scrollY - Phaser.Math.Between(50, 100);
        platform.body.updateFromGameObject();
      }
    });

    // Jump when landing on the platform
    const touchingDown = this.player.body.touching.down;

    if (touchingDown) {
      this.player.setVelocityY(-300);
    }
  }
}
