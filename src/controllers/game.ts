import * as Phaser from "phaser";
import { ScreenSizeService } from "../services/ScreenSizeService";
import { Ship } from "../models/Ship";
import { downsampleRatio } from "../main";

export enum OjectKey {
  playerBase = "playerBase",
  enemyBase = "enemyBase",
  background = "background"
}

export class Game extends Phaser.Scene {

  enemyBase?: Ship
  playerBase?: Ship

  testSprite?: Phaser.GameObjects.Sprite

  init() {
    console.log("Initializing game");
  }

  preload() {
    this.load.setBaseURL("/assets")
    this.load.image(OjectKey.background, "bg-1.png")
    this.load.image(OjectKey.playerBase, "player_base.png")
    this.load.image(OjectKey.enemyBase, "enemy_base.png")
  }

  create() {
    console.log("Create")

    let centerX = ScreenSizeService.canvasWidth!/2
    let centerY = ScreenSizeService.canvasHeight!/2

    //TODO
    //init
    this.add.image(centerX, centerY, 
    OjectKey.background).setScale(downsampleRatio)

    this.enemyBase = new Ship(this.add.sprite(0, 0, OjectKey.enemyBase), 0 ,0)
    this.playerBase = new Ship(this.add.sprite(ScreenSizeService.canvasWidth!, ScreenSizeService.canvasHeight!, OjectKey.playerBase), 1, 1)

    let enemyBaseWidth = this.enemyBase!.sprite!.displayWidth
    this.enemyBase!.move(enemyBaseWidth/2, enemyBaseWidth/2)
    this.enemyBase!.setOrigin(0.5, 0.5)
    this.enemyBase!.setAngle(-45)

    let playerBaseWidth = this.playerBase!.sprite!.displayWidth
    this.playerBase!.move(-playerBaseWidth/2, -playerBaseWidth/2)
    this.playerBase!.setOrigin(0.5, 0.5)
    this.playerBase!.setAngle(-45)


  }

  update() {
    // console.log("Update")
    let cursors = this.input.keyboard.createCursorKeys();
    if (cursors.right!.isDown) {
      console.log("move right")
      //testing input
      this.enemyBase!.move(5, 0)
    }

  }

}