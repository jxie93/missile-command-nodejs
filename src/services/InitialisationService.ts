import { ScreenSizeService } from "./ScreenSizeService";
import { downsampleRatio } from "../main";
import { ProjectileTrackingService } from "./ProjectileTrackingService";

export enum ObjectKey {
    playerBaseFront = "playerBaseFront",
    playerBaseFrontMid = "playerBaseFrontMid",
    playerBaseBackMid = "playerBaseBackMid",
    playerBaseBack = "playerBaseBack",

    enemyBaseFront = "enemyBaseFront",
    enemyBaseFrontMid = "enemyBaseFrontMid",
    enemyBaseBackMid = "enemyBaseBackMid",
    enemyBaseBack = "enemyBaseBack",

    enemyMissile = "enemyMissile",
    playerMissile = "playerMissile",
    background = "background",
    playerMissileTrail = "playerMissileTrail",
    enemyMissileTrail = "enemyMissileTrail",
    explosionParticle1 = "explosionParticle1",

    hpBlockGreen = "hpBlockGreen",
    hpBlockRed = "hpBlockRed",
    hpBlockYellow = "hpBlockYellow",
    hpBlockEmpty = "hpBlockEmpty"
  }

  export enum ModelType {
    ShipSection = "ShipSection",
    Projectile = "Projectile"
  }

export class InitialisationService {

    scene?: Phaser.Scene
    isGameStopped: boolean = false
    static instance = new InitialisationService()

    setup(scene: Phaser.Scene) {
        this.scene = scene
        scene.load.setBaseURL("./assets")
        scene.load.image(ObjectKey.background, "bg-1.png")

        ////////// objects
        this.loadProjectiles(scene)
        this.loadPlayerShips(scene)
        this.loadEnemyShips(scene)
        this.loadParticles(scene)
        this.loadHealthBarBlocks(scene)

        ProjectileTrackingService.instance.init(this.scene)
    }

    loadHealthBarBlocks(scene: Phaser.Scene) {
        let pathSeg = "healthBar/"
        scene.load.image(ObjectKey.hpBlockEmpty, pathSeg + "hp_block_empty.png")
        scene.load.image(ObjectKey.hpBlockGreen, pathSeg + "hp_block_green.png")
        scene.load.image(ObjectKey.hpBlockYellow, pathSeg + "hp_block_yellow.png")
        scene.load.image(ObjectKey.hpBlockRed, pathSeg + "hp_block_red.png")
    }

    loadProjectiles(scene: Phaser.Scene) {
        scene.load.image(ObjectKey.enemyMissile, "enemy_missile_basic.png")
        scene.load.image(ObjectKey.playerMissile, "player_missile_basic.png")
    }

    loadPlayerShips(scene: Phaser.Scene) {
        //player base
        let pathSeg = "ships/player/"
        for (var i = 0; i<4; i++) {
            scene.load.image(ObjectKey.playerBaseFront + "hp" + i, pathSeg + "player_base_front_hp" + i + ".png")
            scene.load.image(ObjectKey.playerBaseFrontMid + "hp" + i, pathSeg + "player_base_frontMid_hp" + i + ".png")
            scene.load.image(ObjectKey.playerBaseBackMid + "hp" + i, pathSeg + "player_base_backMid_hp" + i + ".png")
            scene.load.image(ObjectKey.playerBaseBack + "hp" + i, pathSeg + "player_base_back_hp" + i + ".png")
        }
    }

    loadEnemyShips(scene: Phaser.Scene) {
        //enemy base
        let pathSeg = "ships/enemy/"
        for (var i = 0; i<4; i++) {
            scene.load.image(ObjectKey.enemyBaseFront + "hp" + i, pathSeg + "enemy_base_front_hp" + i + ".png")
            scene.load.image(ObjectKey.enemyBaseFrontMid + "hp" + i, pathSeg + "enemy_base_frontMid_hp" + i + ".png")
            scene.load.image(ObjectKey.enemyBaseBackMid + "hp" + i, pathSeg + "enemy_base_backMid_hp" + i + ".png")
            scene.load.image(ObjectKey.enemyBaseBack + "hp" + i, pathSeg + "enemy_base_back_hp" + i + ".png")
        }
    }

    loadParticles(scene: Phaser.Scene) {
        ////////// particles
        let pathSeg = "particles/"
        scene.load.image(ObjectKey.playerMissileTrail, pathSeg + "player_missile_trail.png")
        scene.load.image(ObjectKey.enemyMissileTrail, pathSeg + "enemy_missile_trail.png")
        scene.load.image(ObjectKey.explosionParticle1, pathSeg + "explosion_1.png")
    }

}