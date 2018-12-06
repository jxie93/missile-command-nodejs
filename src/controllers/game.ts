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
        // debug: true,
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
  
    this.setupText()
  }

  reloadText?: Phaser.GameObjects.Text
  ammoCountText?: Phaser.GameObjects.Text
  setupText() {
    //setup reload text
    var style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "right", boundsAlignV: "middle" };
    this.reloadText = this.add.text(1660, 80, "RELOADING...", style)
    this.reloadText.setVisible(false)

    this.ammoCountText = this.add.text(1720, 35, "", style)
  }

  tryStopGame() {
    if (InitialisationService.instance.isGameStopped) { 
      let result = this.playerBase!.totalHitPoints <= 0 ? "you lose" : "you win"
      var style = { font: "bold 64px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
      this.add.text(0, 0, result + ", click refresh to restart game", style)
      this.scene.pause("game") 
    }
  }

  isClickDown: boolean = false
  timeOnLastReload: Date = new Date()
  reloadTimeMs: number = 2000
  ammoCount: number = 20
  maxAmmo: number = 20
  update() {
    this.tryStopGame()

    //reload ammo
    let timeNow = new Date()
    let timeSinceLast = timeNow.getTime() - this.timeOnLastReload.getTime()
    if (this.ammoCount < this.maxAmmo) {
      if (timeSinceLast > this.reloadTimeMs) {
        this.ammoCount++
        this.timeOnLastReload = timeNow
      }
    }

    let cursor = this.input.activePointer
    if (cursor.isDown && cursor.downX != 0 && cursor.downY != 0) {
      if (this.isClickDown) { //stop click holding
        return
      }

      //out of ammo - show reload text for 1.5s
      if (this.ammoCount == 0) {
        this.reloadText!.setVisible(true)
        return
      }
      let gameSelf = this
      setTimeout(() => {
        gameSelf.reloadText!.setVisible(false)
      }, this.reloadTimeMs);


      let randomPlayerHardpoint = this.playerBase!.getRandomPrimaryHardpoint()
      var currenMissile = new Projectile(this, randomPlayerHardpoint.x, randomPlayerHardpoint.y, ObjectKey.playerMissile,
      cursor.downX, cursor.downY, PlayerEntity.player, 200.0, ObjectKey.playerMissileTrail, ObjectKey.explosionParticle1, 250, 2.5)
      ProjectileTrackingService.instance.addProjectile(currenMissile)

      this.isClickDown = true
      this.ammoCount--
    }

    this.ammoCountText!.setText("AMMO: " + this.ammoCount.toString() + (this.ammoCount < this.maxAmmo ? "+" : ""))

    ProjectileTrackingService.instance.updateProjectiles()
    ProjectileTrackingService.instance.removeOutOfBoundsProjectiles()
    ProjectileTrackingService.instance.removeExpiredProjectiles(true)

    if (cursor.justUp) {
      this.isClickDown = false
    }

  }

}