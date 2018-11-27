import * as Phaser from "phaser";
import { Preload } from "./controllers/preload";
import { Boot } from "./controllers/boot";
import { Game } from "./controllers/game";
import { ScreenSizeService } from "./services/ScreenSizeService";

export const downsampleRatio = 1/3 //global downsampling multiplier for using 3x assets

//Entry points for the game

class Main extends Phaser.Game {
  constructor() {
    let canvasWidth = 1920
    let canvasHeight = 1080

    ScreenSizeService.canvasWidth = canvasWidth
    ScreenSizeService.canvasHeight = canvasHeight

    const config: GameConfig = {
      type: Phaser.AUTO,
      width: canvasWidth,// * window.devicePixelRatio,
      height: canvasHeight,// * window.devicePixelRatio,
      parent: "root"//,
    };
    super(config);
    
    // this.scene.add("boot", Boot, false);
    this.scene.add("preload", Preload, false);
    this.scene.add("game", Game, false);

    this.scene.start("preload");

  }
}

window.onload = () => {
  const GameApp: Phaser.Game = new Main();
};