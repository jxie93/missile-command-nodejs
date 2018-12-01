import { BaseObject } from "./BaseObject";
import { downsampleRatio } from "../main";
import { ObjectKey, ModelType } from "../services/InitialisationService";
import { PlayerEntity } from "../services/AIService";

export enum ShipIdentifier {
    playerBase = "playerBase",
    enemyBase = "enemyBase"
}

//base ship
export class Ship {// wrapper for Phaser.GameObjects.Container
    self?: Phaser.GameObjects.Container //self reference

    sections?: ShipSection[]
    owner?: PlayerEntity
    id?: ShipIdentifier

    //center origin
    x: number = 0
    y: number = 0
    displayWidth: number = 0
    displayHeight: number = 0

    //laid out from left to right
    constructor(scene: Phaser.Scene, sectionKeys: ObjectKey[], x: number, y: number, owner: PlayerEntity, id: ShipIdentifier) {
        this.sections = new Array()
        this.owner = owner
        this.id = id

        for(var s = 0; s<sectionKeys.length; s++) {
            var offsetX = 0
            if (s > 0) {
                offsetX = this.sections[s - 1].width*downsampleRatio + this.sections[s - 1].x
            }
            let currentSection = new ShipSection(scene, x + offsetX, y, sectionKeys[s], this)
            currentSection.type = ModelType.ShipSection
            
            currentSection.setScale(downsampleRatio)
            scene.physics.add.existing(currentSection)
            currentSection.setImmovable(true)
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
                let longestSide = currentSection.displayWidth > currentSection.displayHeight ? currentSection.displayWidth : currentSection.displayHeight
                currentSection.setCircle(longestSide*2, -longestSide/1.5, -longestSide/2)
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

export class ShipSection extends Phaser.Physics.Arcade.Sprite {
    parent?: Ship

    constructor(scene: Phaser.Scene, x: number, y: number, assetKey: ObjectKey, parent: Ship) {
        super(scene, x, y, assetKey)
        this.parent = parent

    }

    //simple alpha change
    alphaFlash(times: number, durationMs: number) {
        let self = this
        var count = 0
        let interval = setInterval(function() {
            count++
            self.alpha = 0.5
            setTimeout(() => {
                self.alpha = 1.0
            }, durationMs/2);
            if (count >= times) {
                clearInterval(interval)
            }
        }, durationMs)
    }

    onCollision() {
        this.alphaFlash(3, 100)
        console.log("WORKING - ship section collision")
    }
}