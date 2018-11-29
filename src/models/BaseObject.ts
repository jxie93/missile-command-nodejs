import { GameObjects, Scene } from "phaser";
import { downsampleRatio } from "../main";
import { ObjectKey } from "../controllers/game";

// Wrapper class for sprite
export class BaseSpriteObject extends GameObjects.Sprite {

    constructor(scene: Phaser.Scene, x: number, y: number, assetKey: ObjectKey) {
        super(scene, x, y, assetKey)
        this.setScale(downsampleRatio)
    }

    move(x: number, y: number) {
        this.x += x
        this.y += y
    }

    getPosition(): Phaser.Geom.Point {
        return new Phaser.Geom.Point(this.x, this.y)
    }


}