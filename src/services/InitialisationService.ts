import { ScreenSizeService } from "./ScreenSizeService";
import { downsampleRatio } from "../main";
import { ProjectileTrackingService } from "./ProjectileTrackingService";

export enum ObjectKey {
    playerBase = "playerBase",
    playerBaseFront = "playerBaseFront",
    playerBaseFrontMid = "playerBaseFrontMid",
    playerBaseBackMid = "playerBaseBackMid",
    playerBaseBack = "playerBaseBack",

    enemyBase = "enemyBase",
    enemyBaseFront = "enemyBaseFront",
    enemyBaseFrontMid = "enemyBaseFrontMid",
    enemyBaseBackMid = "enemyBaseBackMid",
    enemyBaseBack = "enemyBaseBack",

    enemyMissile = "enemyMissile",
    playerMissile = "playerMissile",
    background = "background",
    playerMissileTrail = "playerMissileTrail",
    enemyMissileTrail = "enemyMissileTrail",
    explosionParticle1 = "explosionParticle1"
  }

export class InitialisationService {

    scene?: Phaser.Scene
    static instance = new InitialisationService()

    setup(scene: Phaser.Scene) {
        this.scene = scene
        scene.load.setBaseURL("/assets")
        scene.load.image(ObjectKey.background, "bg-1.png")

        ////////// objects
        scene.load.image(ObjectKey.playerBase, "player_base.png")
        scene.load.image(ObjectKey.enemyBase, "enemy_base.png")
        scene.load.image(ObjectKey.enemyMissile, "enemy_missile_basic.png")
        scene.load.image(ObjectKey.playerMissile, "player_missile_basic.png")

        //player base
        scene.load.image(ObjectKey.playerBaseFront, "/ships/player/player_base_front.png")
        scene.load.image(ObjectKey.playerBaseFrontMid, "/ships/player/player_base_frontMid.png")
        scene.load.image(ObjectKey.playerBaseBackMid, "/ships/player/player_base_backMid.png")
        scene.load.image(ObjectKey.playerBaseBack, "/ships/player/player_base_back.png")
        //enemy base
        scene.load.image(ObjectKey.enemyBaseFront, "/ships/enemy/enemy_base_front.png")
        scene.load.image(ObjectKey.enemyBaseFrontMid, "/ships/enemy/enemy_base_frontMid.png")
        scene.load.image(ObjectKey.enemyBaseBackMid, "/ships/enemy/enemy_base_backMid.png")
        scene.load.image(ObjectKey.enemyBaseBack, "/ships/enemy/enemy_base_back.png")

        ////////// particles
        scene.load.image(ObjectKey.playerMissileTrail, "particles/player_missile_trail.png")
        scene.load.image(ObjectKey.enemyMissileTrail, "particles/enemy_missile_trail.png")
        scene.load.image(ObjectKey.explosionParticle1, "particles/explosion_1.png")

        // scene.load.atlas("flares", "particles/flares.png", "particles/flares.json")

        ProjectileTrackingService.instance.init(this.scene)
    }

}