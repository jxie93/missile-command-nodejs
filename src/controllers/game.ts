import * as Phaser from "phaser";
import { ScreenSizeService } from "../services/ScreenSizeService";
import { BaseSpriteObject } from "../models/BaseObject";
import { downsampleRatio } from "../main";
import { Ship } from "../models/Ship";
import { Projectile } from "../models/Projectile";
import { ProjectileTrackingService } from "../services/ProjectileTrackingService";
import { InitialisationService } from "../services/InitialisationService";
import { AIService, PlayerEntity } from "../services/AIService";
import { MatterProjectile } from "../models/MatterProjectile";

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
    matter: {
      debug: true
    }
      // arcade: {
      //   gravity: 0,
      //   debug: true,
      //   setBounds: {
      //      width: ScreenSizeService.canvasWidth,
      //      height: ScreenSizeService.canvasHeight,
      //   }
      // }
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
    InitialisationService.instance.setup(this)
    this.matter.world.disableGravity()
  }

  setupBaseObjects() {
    let centerX = ScreenSizeService.canvasWidth!/2
    let centerY = ScreenSizeService.canvasHeight!/2
    this.add.image(centerX, centerY, 
      ObjectKey.background).setScale(downsampleRatio)

      this.enemyBase = new Ship(this.matter.world, 0, 0, ObjectKey.enemyBase)
      this.enemyBase.moveBy(this.enemyBase.displayWidth/2, this.enemyBase.displayHeight*2)
      this.enemyBase.setAngle(-45)
      this.enemyBase.setStatic(true)

      this.add.existing(this.enemyBase)

      this.playerBase = new Ship(this.matter.world, ScreenSizeService.canvasWidth, ScreenSizeService.canvasHeight, ObjectKey.playerBase)
      this.playerBase.moveBy(-this.playerBase.displayWidth*0.75, -this.playerBase.displayHeight*2)
      this.playerBase.setAngle(-45)
      this.playerBase.setStatic(true)
      this.add.existing(this.playerBase)


  }

  onProjectileRemoved(projectile: MatterProjectile) {
    projectile.stop()
  }

  onWorldCollision() {
    //TODO?
  }

  create() {    //init
    console.log("Create")
    this.setupBaseObjects()

    ProjectileTrackingService.instance.onProjectileRemoved = this.onProjectileRemoved
    // ProjectileTrackingService.instance.onProjectileCollision = this.onProjectileCollision

    // AIService.instance.init(this, this.playerBase!, this.enemyBase!)
    this.matter.world.on("collisionstart", function (event, bodyA: Phaser.GameObjects.GameObject, bodyB: Phaser.GameObjects.GameObject) {
      console.log('collision ' + typeof event + ", " + bodyA + ", " + bodyB)
      if (bodyA as MatterProjectile) {
        console.log("WORKING - projectile " + (bodyA as MatterProjectile).owner)
      }
  })

  }

  canFire: boolean = false
  update() {
    // console.log("Update")
    let cursor = this.input.activePointer
    if (cursor.isDown && cursor.downX != 0 && cursor.downY != 0) {
      if (this.canFire) {
        return
      }

      var currenMissile = new MatterProjectile(this.matter.world, this.playerBase!.x - this.playerBase!.displayWidth/4, this.playerBase!.y - this.playerBase!.displayHeight, ObjectKey.playerMissile,
      cursor.downX, cursor.downY, PlayerEntity.player, 500.0, ObjectKey.playerMissileTrail, ObjectKey.explosionParticle1, 250, 3)
      this.add.existing(currenMissile)

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