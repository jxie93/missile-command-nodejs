import * as Phaser from "phaser";
import { Preload } from "./scenes/preload";
import { Boot } from "./scenes/boot";
import { Game } from "./scenes/game";
import { ScreenSizeService } from "./services/ScreenSizeService";

// var scaleRatio = window.devicePixelRatio / 3;
// usage - myAsset.scale.setTo(scaleRatio, scaleRatio);

class Main extends Phaser.Game {
  constructor() {
    const config: GameConfig = {
      type: Phaser.AUTO,
      width: 1080,// * window.devicePixelRatio,
      height: 1920,// * window.devicePixelRatio,
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