import * as Phaser from "phaser";
import { ScreenSizeService } from "../services/ScreenSizeService";

export class Preload extends Phaser.Scene {
  init() {
    console.log("Preloading");
  }

  preload () {
    console.log("Load things necessary for create");
  }

  create() {
    console.log("Preloading create");
    this.scene.start("game");
  }

}