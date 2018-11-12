import * as Phaser from "phaser";
import { ScreenSizeService } from "../services/ScreenSizeService";

export class Game extends Phaser.Scene {
  init() {
    console.log("Initializing game");

  }

  create() {
    console.log("Create")
    this.add.image(0, 0, "enemy")
    this.add.image(0, ScreenSizeService.screenHeight(), "player")


  }
}