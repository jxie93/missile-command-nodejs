import * as Phaser from "phaser";
import { ScreenSizeService } from "../services/ScreenSizeService";

export class Game extends Phaser.Scene {
  init() {
    console.log("Initializing game");

  }

  preload() {
    this.load.setBaseURL("/assets")
    this.load.image("player", "player_base.png")
    this.load.image("enemy", "enemy_base.png")
  }

  create() {
    console.log("Create")

    this.add.image(0, 0, "enemy")
    this.add.image(0, ScreenSizeService.screenHeight(), "player")
  }
}