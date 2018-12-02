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
  }

  export enum ModelType {
    ShipSection = "ShipSection",
    Projectile = "Projectile"
  }

export class InitialisationService {

    scene?: Phaser.Scene
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

        ProjectileTrackingService.instance.init(this.scene)
    }

    loadProjectiles(scene: Phaser.Scene) {
        scene.load.image(ObjectKey.enemyMissile, "enemy_missile_basic.png")
        scene.load.image(ObjectKey.playerMissile, "player_missile_basic.png")
    }

    loadPlayerShips(scene: Phaser.Scene) {
        //player base
        // scene.load.multiatlas(ObjectKey.playerBaseBack, "texturesTest/playerBase_back.json", "texturesTest")

        for (var i = 0; i<4; i++) {
            scene.load.image(ObjectKey.playerBaseFront + "hp" + i, "/ships/player/player_base_front_hp" + i + ".png")
            scene.load.image(ObjectKey.playerBaseFrontMid + "hp" + i, "/ships/player/player_base_frontMid_hp" + i + ".png")
            scene.load.image(ObjectKey.playerBaseBackMid + "hp" + i, "/ships/player/player_base_backMid_hp" + i + ".png")
            scene.load.image(ObjectKey.playerBaseBack + "hp" + i, "/ships/player/player_base_back_hp" + i + ".png")
        }
    }

    loadEnemyShips(scene: Phaser.Scene) {
        //enemy base
        for (var i = 0; i<4; i++) {
            scene.load.image(ObjectKey.enemyBaseFront + "hp" + i, "/ships/enemy/enemy_base_front_hp" + i + ".png")
            scene.load.image(ObjectKey.enemyBaseFrontMid + "hp" + i, "/ships/enemy/enemy_base_frontMid_hp" + i + ".png")
            scene.load.image(ObjectKey.enemyBaseBackMid + "hp" + i, "/ships/enemy/enemy_base_backMid_hp" + i + ".png")
            scene.load.image(ObjectKey.enemyBaseBack + "hp" + i, "/ships/enemy/enemy_base_back_hp" + i + ".png")
        }
    }

    loadParticles(scene: Phaser.Scene) {
        ////////// particles
        scene.load.image(ObjectKey.playerMissileTrail, "particles/player_missile_trail.png")
        scene.load.image(ObjectKey.enemyMissileTrail, "particles/enemy_missile_trail.png")
        scene.load.image(ObjectKey.explosionParticle1, "particles/explosion_1.png")
    }

}