import { BaseObject } from "./BaseObject";
import { downsampleRatio } from "../main";
import { ObjectKey } from "../services/InitialisationService";

export class Ship {// wrapper for Phaser.GameObjects.Container
    private self?: Phaser.GameObjects.Container

    front?: Phaser.Physics.Arcade.Sprite
    frontMid?: Phaser.Physics.Arcade.Sprite
    backMid?: Phaser.Physics.Arcade.Sprite
    back?: Phaser.Physics.Arcade.Sprite

    //center origin
    x: number = 0
    y: number = 0
    displayWidth: number = 0
    displayHeight: number = 0

    //laid out from left to right
    constructor(scene: Phaser.Scene, sectionKeys: ObjectKey[], x: number, y: number) {
        let front = new Phaser.Physics.Arcade.Sprite(scene, x, y, sectionKeys[0])
        let frontMid = new Phaser.Physics.Arcade.Sprite(scene, front.width*downsampleRatio + front.x, y, sectionKeys[1])
        let backMid = new Phaser.Physics.Arcade.Sprite(scene, frontMid.width*downsampleRatio + frontMid.x, y, sectionKeys[2])
        let back = new Phaser.Physics.Arcade.Sprite(scene, backMid.width*downsampleRatio + backMid.x, y, sectionKeys[3])
                
        this.front = front
        this.frontMid = frontMid
        this.backMid = backMid
        this.back = back

        scene.physics.add.existing(this.front)
        scene.physics.add.existing(this.frontMid)
        scene.physics.add.existing(this.backMid)
        scene.physics.add.existing(this.back)

        this.front.setScale(downsampleRatio)
        this.frontMid.setScale(downsampleRatio)
        this.backMid.setScale(downsampleRatio)
        this.back.setScale(downsampleRatio)

        this.setupHitBoxes()
        this.self = scene.add.container(x, y, [front, frontMid, backMid, back])

        this.displayWidth = front!.displayWidth + frontMid!.displayWidth + backMid!.displayWidth + back!.displayWidth
        this.displayHeight = front!.displayHeight
    }

    setupHitBoxes() {
        this.front!.setCircle(this.front!.displayWidth*2, -this.front!.displayHeight/2, -this.front!.displayWidth/2)
        this.frontMid!.setCircle(this.frontMid!.displayWidth*2, -this.frontMid!.displayHeight/2, -this.frontMid!.displayWidth/2)
        this.backMid!.setCircle(this.backMid!.displayWidth*2, -this.backMid!.displayHeight/2, -this.backMid!.displayWidth/2)
        this.back!.setCircle(this.back!.displayWidth*2, -this.back!.displayHeight/2, -this.back!.displayWidth/2)
    }

    moveBy(x: number, y: number) {
        this.self!.x += x
        this.self!.y += y
        this.updateSelfPosition()
    }

    moveTo(x: number, y: number) {
        this.self!.x = x
        this.self!.y = y
        this.updateSelfPosition()
    }

    setAngle(angle: number) {
        this.self!.setAngle(angle)
        this.updateSelfPosition()
    }

    updateSelfPosition() {
        this.x = this.self!.x
        this.y = this.self!.y
    }

}