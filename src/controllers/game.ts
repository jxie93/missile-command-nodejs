import * as Phaser from "phaser";
import { ScreenSizeService } from "../services/ScreenSizeService";
import { BaseObject } from "../models/BaseObject";
import { downsampleRatio } from "../main";
import { Ship, ShipIdentifier, ShipSection } from "../models/Ship";
import { Projectile } from "../models/Projectile";
import { ProjectileTrackingService } from "../services/ProjectileTrackingService";
import { InitialisationService, ObjectKey } from "../services/InitialisationService";
import { AIService, PlayerEntity } from "../services/AIService";
import { ShipTrackingService } from "../services/ShipTrackingService";
import { HealthBar } from "../models/HealthBar";

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

  static gameRef?: Phaser.Game
  enemyBase?: Ship
  playerBase?: Ship

  constructor() {
    super(gameSceneConfig)
  }

  init() {
    console.log("Initializing game");
  }

  preload() { //pre-init
    InitialisationService.instance.setup(this)
  }

  setupBaseObjects() {
    let centerX = ScreenSizeService.canvasWidth!/2
    let centerY = ScreenSizeService.canvasHeight!/2
    this.add.image(centerX, centerY, 
      ObjectKey.background).setScale(0.5)
      
      this.enemyBase = new Ship(this, 
        [ObjectKey.enemyBaseFront,
            ObjectKey.enemyBaseFrontMid, 
            ObjectKey.enemyBaseBackMid, 
            ObjectKey.enemyBaseBack], [3, 3, 3, 3],
        0, 0, PlayerEntity.enemy, ShipIdentifier.enemyBase)

      let enemyBaseWidth = this.enemyBase.displayWidth
      let enemyBaseHeight = this.enemyBase.displayHeight
      this.enemyBase.setAngle(-30)
      this.enemyBase.moveBy(enemyBaseWidth*0.25, enemyBaseHeight*1.75)

      this.playerBase = new Ship(this, 
        [ObjectKey.playerBaseFront,
           ObjectKey.playerBaseFrontMid, 
           ObjectKey.playerBaseBackMid, 
           ObjectKey.playerBaseBack], [3, 3, 3, 3],
        0, 0, PlayerEntity.player, ShipIdentifier.playerBase)

      let playerBaseWidth = this.playerBase.displayWidth
      let playerBaseHeight = this.playerBase.displayHeight
      this.playerBase.moveTo(ScreenSizeService.canvasWidth - playerBaseWidth, 
        ScreenSizeService.canvasHeight - playerBaseHeight)
      this.playerBase.setAngle(-30)
      this.playerBase.moveBy(playerBaseWidth/6, playerBaseHeight/2)

      var playerHpBar = new HealthBar(this, ObjectKey.hpBlockGreen, 0, this.playerBase, new Phaser.Math.Vector2(-120, -60))
      playerHpBar.self!.setVisible(false)
      var enemyHpBar = new HealthBar(this, ObjectKey.hpBlockGreen, 0, this.enemyBase, new Phaser.Math.Vector2(-120, -60))
      enemyHpBar.self!.setVisible(false)

      ShipTrackingService.instance.addShip(this.enemyBase)
      ShipTrackingService.instance.addShip(this.playerBase)
  }

  create() {    //init
    console.log("Create")
    this.setupBaseObjects()

    AIService.instance.init(this, this.playerBase!, this.enemyBase!)
    AIService.instance.attackFrequency = 0.2
    AIService.instance.attackDivergence = 800
  
  }

  canFire: boolean = false
  update() {
    let cursor = this.input.activePointer
    if (cursor.isDown && cursor.downX != 0 && cursor.downY != 0) {
      if (this.canFire) {
        return
      }

      let randomPlayerHardpoint = this.playerBase!.getRandomPrimaryHardpoint()
      var currenMissile = new Projectile(this, randomPlayerHardpoint.x, randomPlayerHardpoint.y, ObjectKey.playerMissile,
      cursor.downX, cursor.downY, PlayerEntity.player, 200.0, ObjectKey.playerMissileTrail, ObjectKey.explosionParticle1, 250, 2.5)
      ProjectileTrackingService.instance.addProjectile(currenMissile)

      this.canFire = true
    }

    ProjectileTrackingService.instance.updateProjectiles()
    ProjectileTrackingService.instance.removeOutOfBoundsProjectiles()
    ProjectileTrackingService.instance.removeExpiredProjectiles(true)

    if (cursor.justUp) {
      this.canFire = false
    }

  }

}