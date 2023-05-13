import Phaser from "phaser";

export default class Game extends Phaser.Scene {
  platforms;
  player;
  cursors;
  platformsPassed = 0;
  platformsPassedText;
  highestScore = 0;
  highestScoreText;
  constructor() {
    super("game");
  }

  preload() {
    this.load.image("background", "public/images/bg_layer1.png");
    this.load.image("platform", "public/images/ground_grass.png");
    this.load.image("bunny-stand", "public/images/bunny1_stand.png");
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  create() {
    const width = this.scale.width;
    const height = this.scale.height;
    this.add.image(240, 320, "background").setScrollFactor(1, 0);

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

    // set the horizontal dead zone to 1.5x game width
    this.cameras.main.setDeadzone(this.scale.width * 1.5);

    // Load the highest score from localStorage
    this.highestScore = localStorage.getItem("highestScore") || 0;

    // Add the highest score text to the screen
    this.highestScoreText = this.add.text(
      width / 2,
      16,
      `Max: ${this.highestScore}`,
      {
        fontSize: "24px",
        fill: "red",
      }
    );
    this.highestScoreText.setScrollFactor(0);

    // Create text to display platforms passed
    this.platformsPassedText = this.add.text(16, 16, "Current: 0", {
      fontSize: "24px",
      fill: "#000",
    });
    this.platformsPassed = 0;
    this.platformsPassedText.setScrollFactor(0); // make it fixed to the screen
  }

  update() {
    // Reuse platforms
    this.platforms.children.iterate((child) => {
      const platform = child;

      const scrollY = this.cameras.main.scrollY;
      if (platform.y >= scrollY + 700) {
        platform.y = scrollY - Phaser.Math.Between(50, 100);
        platform.body.updateFromGameObject();

        // Increment platform counter when a new platform is passed
        this.platformsPassed++;
        this.platformsPassedText.setText(
          `Platforms Passed: ${this.platformsPassed}`
        ); // update text

        // Increase the counter of passed platforms and update the highest score if necessary
        if (this.platformsPassed > this.highestScore) {
          this.highestScore = this.platformsPassed;
          localStorage.setItem("highestScore", this.highestScore);
        }
      }
    });

    // Jump when landing on the platform
    const touchingDown = this.player.body.touching.down;

    if (touchingDown) {
      this.player.setVelocityY(-300);
    }

    // move left and right
    if (this.cursors.left.isDown && !touchingDown) {
      this.player.setVelocityX(-200);
    } else if (this.cursors.right.isDown && !touchingDown) {
      this.player.setVelocityX(200);
    } else {
      // stop movement if not left or right
      this.player.setVelocityX(0);
    }
    // wrap player horizontally (move through sides)
    this.horizontalWrap(this.player);

    // game over
    const bottomPlatform = this.findBottomMostPlatform();
    if (this.player.y > bottomPlatform.y + 200) {
      this.scene.start("game-over");
    }
  }

  horizontalWrap(sprite) {
    const halfWidth = sprite.displayWidth * 0.5;
    const gameWidth = this.scale.width;
    if (sprite.x < -halfWidth) {
      sprite.x = gameWidth + halfWidth;
    } else if (sprite.x > gameWidth + halfWidth) {
      sprite.x = -halfWidth;
    }
  }

  // game over
  findBottomMostPlatform() {
    const platforms = this.platforms.getChildren();
    let bottomPlatform = platforms[0];

    for (let i = 1; i < platforms.length; ++i) {
      const platform = platforms[i];

      // discard any platforms that are above current
      if (platform.y < bottomPlatform.y) {
        continue;
      }

      bottomPlatform = platform;
    }

    return bottomPlatform;
  }
}
