import { GameObjects, Scene } from "phaser";
import { downsampleRatio } from "../main";

// Wrapper class for sprite
export class Ship {

    sprite?: GameObjects.Sprite

    constructor(sprite: GameObjects.Sprite, originX: number, originY: number) {
        this.sprite = sprite
        sprite.setOrigin(originX, originY)
        sprite.setScale(downsampleRatio)
    }

    move(x: number, y: number) {
        this.sprite!.x += x
        this.sprite!.y += y
    }

    setOrigin(x: number, y: number) {
        this.sprite!.setOrigin(x, y)
    }

    setAngle(angle: number) {
        this.sprite!.angle = angle
    }


}