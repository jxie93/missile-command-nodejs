import { BaseSpriteObject } from "./BaseObject";
import { ObjectKey } from "../controllers/game";
import { downsampleRatio } from "../main";

export class Ship extends Phaser.Physics.Matter.Sprite {

    constructor(world: Phaser.Physics.Matter.World, x: number, y: number, assetKey: ObjectKey) {
        super(world, x, y, assetKey)
        this.setScale(downsampleRatio)
    }

    moveTo(x: number, y: number) {
        this.setX(x)
        this.setY(y)
    }

    moveBy(x: number, y: number) {
        this.x += x
        this.y += y
    }

    getPosition(): Phaser.Math.Vector2 {
        return new Phaser.Math.Vector2(this.x, this.y)
    }

}