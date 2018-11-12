import * as Phaser from "phaser";
import { ScreenSizeService } from "../services/ScreenSizeService";

export class Game extends Phaser.Scene {

  enemyBase?: Phaser.GameObjects.Sprite
  playerBase?: Phaser.GameObjects.Sprite

  init() {
    console.log("Initializing game");
  }

  preload() {
    this.load.setBaseURL("/assets")
    this.load.image("player", "player_base.png")
    this.load.image("enemy", "enemy_base.png")
    this.load.image("background", "bg-1.png")
  }

  create() {
    console.log("Create")

    let centerX = ScreenSizeService.canvasWidth!/2
    let centerY = ScreenSizeService.canvasHeight!/2

    //TODO
    //init
    this.add.image(centerX, centerY, "background").setScale(0.5)
    this.enemyBase = this.add.sprite(centerX, 0, "enemy").setScale(0.3)
    this.playerBase = this.add.sprite(centerX, 500, "player").setScale(0.3)

    //reposition
    // this.enemyBase.setY(this.enemyBase.y + (this.enemyBase.height/2))
    this.playerBase.setY(1000)

  }
}