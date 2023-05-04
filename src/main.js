import Phaser from "phaser";

import Game from "./scenes/Game";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: Game,
};

export default new Phaser.Game(config);
