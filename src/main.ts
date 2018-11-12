import * as Phaser from "phaser";
import { Preload } from "./scenes/preload";
import { Boot } from "./scenes/boot";
import { Game } from "./scenes/game";

// var scaleRatio = window.devicePixelRatio / 3;
// usage - myAsset.scale.setTo(scaleRatio, scaleRatio);

class Main extends Phaser.Game {
  constructor() {
    const config: GameConfig = {
      type: Phaser.AUTO,
      width: window.innerWidth * 0.5625,// * window.devicePixelRatio,
      height: window.innerHeight,// * window.devicePixelRatio,
      parent: "root"
    };
    super(config);

    this.scene.add("boot", Boot, false);
    this.scene.add("preload", Preload, false);
    this.scene.add("game", Game, false);

    this.scene.start("preload");
  }
}

window.onload = () => {
  const GameApp: Phaser.Game = new Main();
};