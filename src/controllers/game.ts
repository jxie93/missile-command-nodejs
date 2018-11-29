import * as Phaser from "phaser";
import { ScreenSizeService } from "../services/ScreenSizeService";
import { BaseObject } from "../models/BaseObject";
import { downsampleRatio } from "../main";
import { Ship } from "../models/Ship";
import { Projectile } from "../models/Projectile";
import { ProjectileTrackingService } from "../services/ProjectileTrackingService";
import { InitialisationService } from "../services/InitialisationService";
import { AIService, PlayerEntity } from "../services/AIService";

export enum ObjectKey {
  playerBase = "playerBase",
  enemyBase = "enemyBase",
  enemyMissile = "enemyMissile",
  playerMissile = "playerMissile",
  background = "background",
  playerMissileTrail = "playerMissileTrail",
  enemyMissileTrail = "enemyMissileTrail",
  explosionParticle1 = "explosionParticle1"
}

let gameSceneConfig: Phaser.Scenes.Settings.Config = {
  key: 'game',
  physics: {
      arcade: {
        gravity: 0,
        debug: true,
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

  constructor() {
    super(gameSceneConfig)
  }

  init() {
    console.log("Initializing game");
  }

  preload() { //pre-init
    InitialisationService.instance.loadAssetsForScene(this)
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

  onProjectileRemoved(projectile: Projectile) {
    projectile.stop()
  }

  create() {    //init
    console.log("Create")
    this.setupBaseObjects()
    ProjectileTrackingService.instance.onProjectileRemoved = this.onProjectileRemoved
    AIService.instance.init(this, this.playerBase!, this.enemyBase!)

    
  }

  canFire: boolean = false
  update() {
    // console.log("Update")
    let cursor = this.input.activePointer
    if (cursor.isDown && cursor.downX != 0 && cursor.downY != 0) {
      if (this.canFire) {
        return
      } 

      var currenMissile = new Projectile(this,
        this.physics.add.image(this.playerBase!.getPosition().x, this.playerBase!.getPosition().y, ObjectKey.playerMissile),
        cursor.downX, cursor.downY, PlayerEntity.player, 1000.0, ObjectKey.playerMissileTrail, ObjectKey.explosionParticle1, 250, 3)

      ProjectileTrackingService.instance.addProjectile(currenMissile)

      this.canFire = true
    }

    ProjectileTrackingService.instance.removeOutOfBoundsProjectiles()
    ProjectileTrackingService.instance.removeExpiredProjectiles(true)

    if (cursor.justUp) {
      this.canFire = false
    }

  }

}