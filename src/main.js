import Phaser from "phaser";

import Game from "./scenes/Game";

const config = {
  type: Phaser.AUTO,
  width: 480,
  height: 640,
  scene: Game,
};

export default new Phaser.Game(config);
