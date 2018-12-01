import { BaseObject } from "./BaseObject";
import { downsampleRatio } from "../main";
import { ObjectKey } from "../services/InitialisationService";

export class Ship {// wrapper for Phaser.GameObjects.Container
    private self?: Phaser.GameObjects.Container //self reference

    // front?: Phaser.Physics.Arcade.Sprite
    // frontMid?: Phaser.Physics.Arcade.Sprite
    // backMid?: Phaser.Physics.Arcade.Sprite
    // back?: Phaser.Physics.Arcade.Sprite
    sections?: Phaser.Physics.Arcade.Sprite[]

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

        this.sections = new Array()

        for(var s = 0; s<sectionKeys.length; s++) {
            var offsetX = 0
            if (s > 0) {
                offsetX = this.sections[s - 1].width*downsampleRatio + this.sections[s - 1].x
            }
            let currentSection = new Phaser.Physics.Arcade.Sprite(scene, x + offsetX, y, sectionKeys[s])
            currentSection.setScale(downsampleRatio)
            scene.physics.add.existing(currentSection)
            this.sections.push(currentSection)
            
            this.displayWidth += currentSection.displayWidth
            this.displayHeight = currentSection.displayHeight
        }

        this.self = scene.add.container(x, y, this.sections)
        this.setupHitBoxes()
    }

    setupHitBoxes() {
        if (this.sections) {
            for(var s = 0; s<this.sections.length; s++) {
                let currentSection = this.sections[s]
                currentSection.setCircle(currentSection.displayWidth*2, -currentSection.displayHeight/2, -currentSection.displayWidth/2)
            }
        }
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