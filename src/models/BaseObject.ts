import { GameObjects, Scene } from "phaser";
import { downsampleRatio } from "../main";

// Wrapper class for sprite
export class BaseObject {

    sprite?: GameObjects.Sprite

    constructor(sprite: GameObjects.Sprite, originX: number = 0.5, originY: number = 0.5) {
        this.sprite = sprite
        sprite.setOrigin(originX, originY)
        sprite.setScale(downsampleRatio)
    }

    move(x: number, y: number) {
        this.sprite!.x += x
        this.sprite!.y += y
    }

    getPosition(): Phaser.Geom.Point {
        return new Phaser.Geom.Point(this.sprite!.x, this.sprite!.y)
    }

    setOrigin(x: number, y: number) {
        this.sprite!.setOrigin(x, y)
    }

    setAngle(angle: number) {
        this.sprite!.angle = angle
    }


}