import * as Phaser from "phaser";
import { Preload } from "./controllers/preload";
import { Boot } from "./controllers/boot";
import { Game } from "./controllers/game";
import { ScreenSizeService } from "./services/ScreenSizeService";

export const downsampleRatio = 1/3 //global downsampling multiplier for using 3x assets

//Entry points for the game

class Main extends Phaser.Game {
  constructor() {
    const config: GameConfig = {
      type: Phaser.AUTO,
      width: 1920,// * window.devicePixelRatio,
      height: 1080,// * window.devicePixelRatio,
      parent: "root"
    };
    super(config);

    ScreenSizeService.canvasWidth = config.width as number
    ScreenSizeService.canvasHeight = config.height as number

    // this.scene.add("boot", Boot, false);
    this.scene.add("preload", Preload, false);
    this.scene.add("game", Game, false);

    this.scene.start("preload");
  }
}

window.onload = () => {
  const GameApp: Phaser.Game = new Main();
};