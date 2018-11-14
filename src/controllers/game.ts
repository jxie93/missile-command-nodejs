import * as Phaser from "phaser";
import { ScreenSizeService } from "../services/ScreenSizeService";
import { BaseObject } from "../models/BaseObject";
import { downsampleRatio } from "../main";
import { Ship } from "../models/Ship";
import { Projectile } from "../models/Projectile";

export enum ObjectKey {
  playerBase = "playerBase",
  enemyBase = "enemyBase",
  enemyMissile = "enemyMissile",
  playerMissile = "playerMissile",
  background = "background"
}

let gameSceneConfig: Phaser.Scenes.Settings.Config = {
  key: 'game',
  physics: {
      impact: {
        gravity: 0,
        setBounds: {
            width: ScreenSizeService.canvasWidth,
            height: ScreenSizeService.canvasHeight,
        }
    }
  }
}

export class Game extends Phaser.Scene {

  enemyBase?: Ship
  playerBase?: Ship

  testSprite?: Phaser.GameObjects.Sprite

  constructor() {
    super(gameSceneConfig)
  }

  init() {
    console.log("Initializing game");
  }

  preload() {
    console.log("this config " + this.physics)

    this.load.setBaseURL("/assets")
    this.load.image(ObjectKey.background, "bg-1.png")
    this.load.image(ObjectKey.playerBase, "player_base.png")
    this.load.image(ObjectKey.enemyBase, "enemy_base.png")
    this.load.image(ObjectKey.enemyMissile, "enemy_missile_basic.png")
    this.load.image(ObjectKey.playerMissile, "player_missile_basic.png")
  }

  create() {
    console.log("Create")

    let centerX = ScreenSizeService.canvasWidth!/2
    let centerY = ScreenSizeService.canvasHeight!/2

    //TODO
    //init
    this.add.image(centerX, centerY, 
    ObjectKey.background).setScale(downsampleRatio)

    this.enemyBase = new Ship(this.add.sprite(0, 0, ObjectKey.enemyBase), 0 ,0)
    this.playerBase = new Ship(this.add.sprite(ScreenSizeService.canvasWidth, ScreenSizeService.canvasHeight, ObjectKey.playerBase), 1, 1)

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
    let mousePointer = this.input.activePointer
    if (mousePointer.isDown) {
      console.log("pointer clicked " + mousePointer.downX + "x" + mousePointer.downY)
      // var missile = new Projectile(this.add.sprite(0, 0, ObjectKey.playerMissile), 0.5, 0.5)
      
      var missile = new Projectile(
        this.impact.add.image(500, 500, ObjectKey.playerMissile),
        mousePointer.downX, mousePointer.downY
        
        )
      missile.setAcceleration(100, 0) //initial

    }

  }

}