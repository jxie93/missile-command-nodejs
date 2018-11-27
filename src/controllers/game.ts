import * as Phaser from "phaser";
import { ScreenSizeService } from "../services/ScreenSizeService";
import { BaseObject } from "../models/BaseObject";
import { downsampleRatio } from "../main";
import { Ship } from "../models/Ship";
import { Projectile } from "../models/Projectile";
import { ProjectileTrackingService } from "../services/ProjectileTrackingService";

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
      arcade: {
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

  // currentProjectiles?: Projectile[] = new Array()

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

  setupBaseObjects() {
    let centerX = ScreenSizeService.canvasWidth!/2
    let centerY = ScreenSizeService.canvasHeight!/2
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

  create() {
    console.log("Create")
    //TODO
    //init
    this.setupBaseObjects()

  }

  canFire: boolean = false
  // missile?: Projectile
  //TODO use ProjectileTrackingService

  update() {
    // console.log("Update")
    let cursor = this.input.activePointer
    if (cursor.isDown) {
      
      if (this.canFire) {
        return
      } 

      console.log("pointer clicked " + cursor.downX + "x" + cursor.downY)

      var currenMissile = new Projectile(
        this.physics.add.image(this.playerBase!.getPosition().x, this.playerBase!.getPosition().y, ObjectKey.enemyMissile),
        cursor.downX, cursor.downY, 1000.0)

      ProjectileTrackingService.instance.addProjectile(currenMissile)

        // this.currentProjectiles!.push(currenMissile)
        // console.log("WORKING - missile tracker " + this.currentProjectiles)

      this.canFire = true
    }



      ProjectileTrackingService.instance.removeOutOfBoundsProjectiles()

    // if (this.missile) {
    //   if (this.missile!.hasReachedDestination()) {
    //     this.missile!.stop()
    //   }
    // }

    if (cursor.justUp) {
      this.canFire = false
    }

  }

}