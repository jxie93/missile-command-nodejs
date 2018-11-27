import { ScreenSizeService } from "./ScreenSizeService";
import { downsampleRatio } from "../main";
import { ObjectKey } from "../controllers/game";

export class InitialisationService {

    scene?: Phaser.Scene
    static instance = new InitialisationService()

    loadAssetsForScene(scene: Phaser.Scene) {
        this.scene = scene
        scene.load.setBaseURL("/assets")
        scene.load.image(ObjectKey.background, "bg-1.png")
        scene.load.image(ObjectKey.playerBase, "player_base.png")
        scene.load.image(ObjectKey.enemyBase, "enemy_base.png")
        scene.load.image(ObjectKey.enemyMissile, "enemy_missile_basic.png")
        scene.load.image(ObjectKey.playerMissile, "player_missile_basic.png")
    }

}