import { Ship } from "./Ship";
import { ObjectKey } from "../services/InitialisationService";
import { downsampleRatio } from "../main";

export class HealthBar {
    self?: Phaser.GameObjects.Container //self reference
    scene?: Phaser.Scene
    sections?: Phaser.Physics.Arcade.Sprite[]
    displayWidth: number = 0
    displayHeight: number = 0

    currentValue: number = 0
    maxValue: number = 0
    healthRemoved: number = 0

    //laid out from right to left for overlap
    constructor(scene: Phaser.Scene, blockKey: ObjectKey, startVal: number, ship: Ship, offset: Phaser.Math.Vector2) {
        this.scene = scene
        this.sections = new Array()

        //TODO attach to ship
        //TODO use startVal

        for (var s = 0; s<ship.totalHitPoints; s++) {
            var offsetX = 0
            var offsetY = 0
            if (s > 0) { //arbitrary hardcoded multipliers
                offsetX = s * -this.sections[s - 1].width*downsampleRatio * 0.5
                offsetY = s * this.sections[s - 1].height*downsampleRatio * 0.335 
            }

            let currentSection = new Phaser.Physics.Arcade.Sprite(scene, offsetX, offsetY, blockKey)            
            currentSection.setScale(downsampleRatio)
            this.sections.push(currentSection)
            
            this.displayWidth += currentSection.displayWidth
            this.displayHeight = currentSection.displayHeight
        }

        this.currentValue = ship.totalHitPoints
        this.maxValue = ship.totalHitPoints

        this.self = scene.add.container(0, 0, this.sections)
        this.self.x = ship.endX + offset.x
        this.self.y = ship.endY + offset.y

        ship.healthBar = this
    }

    removeSections(amount: number) {
        if (!this.sections) { return }
        let newValue = this.currentValue - amount

        this.currentValue = newValue
        for (var i = 0; i<this.maxValue - newValue; i++) {
            this.sections[i].setTexture(ObjectKey.hpBlockEmpty)
        }
        
        //<60% = yellow, <30% = red
        var remainingBlockKey = ObjectKey.hpBlockGreen
        if (this.currentValue/this.maxValue < 0.7) {
            remainingBlockKey = ObjectKey.hpBlockYellow
        }
        if (this.currentValue/this.maxValue < 0.3) {
            remainingBlockKey = ObjectKey.hpBlockRed
        }

        for (var r = this.maxValue - newValue; r<this.maxValue; r++) {
            this.sections[r].setTexture(remainingBlockKey)
        }
    }

}