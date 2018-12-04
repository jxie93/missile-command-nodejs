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
    scene?: Phaser.Scene //useful reference

    sections?: ShipSection[]
    owner?: PlayerEntity
    id?: ShipIdentifier

    totalHitPoints: number = 0 //total of each section added up
    hardpointsPrimary: Phaser.Math.Vector2[] //represents points where attacks could originate

    //approximations
    startX: number = 0
    startY: number = 0

    displayWidth: number = 0
    displayHeight: number = 0

    //laid out from left to right
    constructor(scene: Phaser.Scene, sectionKeys: ObjectKey[], sectionHP: number[], x: number, y: number, owner: PlayerEntity, id: ShipIdentifier) {
        this.sections = new Array()
        this.hardpointsPrimary = new Array()
        this.owner = owner
        this.id = id
        this.scene = scene

        for (var s = 0; s<sectionKeys.length; s++) {
            var offsetX = 0
            if (s > 0) {
                offsetX = this.sections[s - 1].width*downsampleRatio + this.sections[s - 1].x
            }

            let currentSection = new ShipSection(scene, x + offsetX, y, sectionKeys[s], this, sectionHP[s])
            currentSection.type = ModelType.ShipSection
            
            currentSection.setScale(downsampleRatio)
            scene.physics.add.existing(currentSection)
            currentSection.setImmovable(true)
            this.sections.push(currentSection)
            
            this.displayWidth += currentSection.displayWidth
            this.displayHeight = currentSection.displayHeight

            this.totalHitPoints += currentSection.hitPoints
        }

        this.self = scene.add.container(x, y, this.sections)
        this.setupHitBoxes()
    }

    setupHitBoxes() {
        if (this.sections) {
            for(var s = 0; s<this.sections.length; s++) {
                let currentSection = this.sections[s]
                let longestSide = currentSection.displayWidth > currentSection.displayHeight ? currentSection.displayWidth : currentSection.displayHeight
                currentSection.setCircle(longestSide*1.4, -longestSide/2, 0)
                currentSection.hitBoxRadius = longestSide*1.4
            }
        }
    }

    //default implementation - 1 hard point on tangent per section
    setupHardpoints() {
        // var graphics = this.scene!.add.graphics()
        // graphics.fillStyle(0xffff00, 1);
        this.hardpointsPrimary = new Array()
        if (!this.sections) { return }
        for (var i = 0; i<this.sections.length; i++) {
            let tangent2d = this.getCircleHitboxTangentForSection(this.sections[i], 0.4, 
                this.owner == PlayerEntity.player ? true : false) //which direction the tangent should face
            this.hardpointsPrimary.push(tangent2d)
            // graphics.fillCircle(tangent2d.x, tangent2d.y, 10) //debug
        }
    }

    getRandomPrimaryHardpoint(): Phaser.Math.Vector2 {
        var result = new Phaser.Math.Vector2()
        if (this.hardpointsPrimary) {
            result = this.hardpointsPrimary[Math.floor(Math.random() * this.hardpointsPrimary.length)] 
        }
        return result
    }

    //find the point on the circle hitbox tangent at current angle
    getCircleHitboxTangentForSection(shipSection: ShipSection, factor: number = 1, reverse: boolean): Phaser.Math.Vector2 {
        var result = new Phaser.Math.Vector2()
        if (this.self && shipSection.center) {
            let currentAngle = this.self.angle * Math.PI / 180

            let signX = (Math.sin(currentAngle) > 0 && Math.cos(currentAngle) < 0) ||
            (Math.sin(currentAngle) < 0 && Math.cos(currentAngle) < 0) ? -1 : 1
            let signY = (Math.sin(currentAngle) < 0 && Math.cos(currentAngle) > 0) ||
            (Math.sin(currentAngle) < 0 && Math.cos(currentAngle) < 0) ? -1 : 1
            let reverseSign = reverse ? -1 : 1

            result.x = shipSection.center.x + (shipSection.hitBoxRadius * Math.cos(currentAngle) * reverseSign * signX) * factor
            result.y = shipSection.center.y + (shipSection.hitBoxRadius * Math.sin(currentAngle) * reverseSign * signY) * factor
        }
        return result
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
        this.startX = this.self!.x
        this.startY = this.self!.y
        this.updateSectionCenters()
        this.setupHardpoints()
    }

    updateSectionCenters() {
        if (this.sections && this.sections && this.self) {
            let transformMatrix = this.self.getWorldTransformMatrix()
            for (var s = 0; s<this.sections.length; s++) {
                let transformedPoint = new Phaser.Math.Vector2()
                transformMatrix.transformPoint(this.sections[s].x, this.sections[s].y, transformedPoint)
                this.sections[s].center = transformedPoint
            }
        }
    }

}

export class ShipSection extends Phaser.Physics.Arcade.Sprite {
    parent?: Ship

    hitPoints = 0
    damageKeys: string[] = []
    baseKey?: ObjectKey

    hitBoxRadius: number = 0
    center?: Phaser.Math.Vector2

    constructor(scene: Phaser.Scene, x: number, y: number, assetKey: ObjectKey, parent: Ship, maxHP: number) {
        super(scene, x, y, assetKey + "hp" + maxHP)
        this.parent = parent
        this.hitPoints = maxHP
        this.baseKey = assetKey
        //WARNING baseKey doesn't actually exist, it's only used for concat

        this.createDamageSprites(scene)
    }

    //animation keys (eg. basehp-anim1, basehp-anim2) created for assets (eg. basehp1, basehp2)
    createDamageSprites(scene: Phaser.Scene) { //as single frame animation
        for (var h = 0; h<=this.hitPoints; h++) {
            let animKey = this.baseKey + "hp-anim" + h
            scene.anims.remove(animKey)
            scene.anims.create({
                key: animKey,
                frames: [
                    { key: (this.baseKey + "hp" + h) } as AnimationFrameConfig
                ],
            })
            this.damageKeys.push(animKey)
        }
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

    alphaFlashAllSections(times: number, durationMs: number) {
        if (this.parent && this.parent.sections) {
            for (var s = 0; s<this.parent!.sections!.length; s++) {
                this.parent.sections[s].alphaFlash(times, durationMs)
            } 
        }
    }

    onCollision() {
        if (this.hitPoints > 0) {
            this.alphaFlashAllSections(3, 100)
            this.hitPoints--
            this.parent!.totalHitPoints--
            this.play(this.damageKeys[this.hitPoints]) //damageKeys are 0 indexed
        } else {
            //already dead - do something?
        }
    }
}