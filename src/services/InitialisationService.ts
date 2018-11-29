import { ScreenSizeService } from "./ScreenSizeService";
import { downsampleRatio } from "../main";
import { ObjectKey } from "../controllers/game";
import { ProjectileTrackingService } from "./ProjectileTrackingService";

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

        ////////// particles
        scene.load.image(ObjectKey.playerMissileTrail, "particles/player_missile_trail.png")
        scene.load.image(ObjectKey.enemyMissileTrail, "particles/enemy_missile_trail.png")
        scene.load.image(ObjectKey.explosionParticle1, "particles/explosion_1.png")

        // scene.load.atlas("flares", "particles/flares.png", "particles/flares.json")

        ProjectileTrackingService.instance.init(this.scene)
    }

}