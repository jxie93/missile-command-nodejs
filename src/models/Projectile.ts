import { PlayerEntity } from "../services/AIService";
import { downsampleRatio } from "../main";
import { ScreenSizeService } from "../services/ScreenSizeService";
import { ObjectKey } from "../services/InitialisationService";

export enum ProjectileType {
    //TODO
}

export class Projectile extends Phaser.Physics.Arcade.Sprite {

    angleOffset: number = 90

    owner?: PlayerEntity
    collider?: Phaser.Physics.Arcade.Collider //reference only

    source: Phaser.Geom.Point = new Phaser.Geom.Point(0, 0)
    destination: Phaser.Geom.Point = new Phaser.Geom.Point(0, 0)
    accelerationFactor: number = 1.0 //defined magnitude
    vector: Phaser.Math.Vector2 = new Phaser.Math.Vector2(0, 0) //normalised

    hitPoints: number = 1
    damage: number = 1

    trailEmitter?: Phaser.GameObjects.Particles.ParticleEmitter
    trailAmount: number = 100 //initial trail amount
    distanceTravelled: number = 0
    explosionEmitter?: Phaser.GameObjects.Particles.ParticleEmitter
    explosionLinger?: number //in ms
    explosionRadiusMultiplier?: number //blast radius

    constructor(scene: Phaser.Scene, sourceX: number, sourceY: number, assetKey: string, 
        destinationX: number, destinationY: number, owner: PlayerEntity, accelModifier?: number,
        trailParticleAsset?: ObjectKey, explosionParticleAsset?: ObjectKey, explosionLinger?: number, blastMultiplier?: number) {
        super(scene, sourceX, sourceY, assetKey)

        scene.add.existing(this)
        scene.physics.add.existing(this)

        this.owner = owner
        this.explosionLinger = explosionLinger
        this.explosionRadiusMultiplier = blastMultiplier
        this.setScale(downsampleRatio)
        this.source = new Phaser.Geom.Point(sourceX, sourceY)
        this.destination = new Phaser.Geom.Point(destinationX, destinationY)
        this.accelerationFactor = accelModifier!

        this.setAngleWithOffset(this.angleToDestination())
        this.accelerateToDestination()

        this.createTrailEmitter(trailParticleAsset!)
        this.createExplosionEmitter(explosionParticleAsset!)

        this.setHitBox()
    }

    removeCollider() {
        if (this.collider) {
            this.scene.physics.world.removeCollider(this.collider)
        }
    }

    private setHitBox(multiplier?: number) {
        //TODO get a good fit
        var longestSide = this.width
        if (this.height > longestSide) {
            longestSide = this.height
        }

        let finalMultiplier = (multiplier != null) ? multiplier : 1
        let radiusModifier = 0.5 //half all values

        let finalRadius = longestSide*radiusModifier
        if (this.vector) {
            let offsetX = -this.height/2 *radiusModifier //base offset and modifier 
            let offsetY = -this.width/2 *radiusModifier // base offset and modifier
            this.setCircle(finalRadius*finalMultiplier, offsetX*finalMultiplier, offsetY*finalMultiplier)
        }
    }

    //creates and attaches a trail particle system that follows the asset
    private createTrailEmitter(assetKey: ObjectKey) {
        var particles = this.scene!.add.particles(assetKey)
        this.trailEmitter = particles.createEmitter({
            lifespan: this.trailAmount,
                speed: { min: 0, max: 500 },
                angle: this.getAngleWithOffset(),
                scale: { start: 0.25, end: 0 },
                quantity: 1,
                blendMode: Phaser.BlendModes.ADD,
            })
        this.trailEmitter!.startFollow(this)
        this.trailEmitter!.followOffset = this.vector!.scale(-40)
    }

    updateDistanceTravelled() {
        let deltaX = Math.abs(this.x - this.source.x)
        let deltaY = Math.abs(this.y - this.source.y)
        this.distanceTravelled = Math.sqrt(deltaX*deltaX + deltaY*deltaY)
    }

    increaseTrail() {
        if (this.trailEmitter) {
            let amount = this.distanceTravelled*2
            this.trailEmitter.setLifespan(amount)
        }
    }

    //creates and attaches a explosion particle system, but inactive 
    private createExplosionEmitter(assetKey: ObjectKey) {
        var particles = this.scene!.add.particles(assetKey)
        this.explosionEmitter = particles.createEmitter({
            lifespan: 300,
            speed: { min: 0, max: 500 },
            scale: { start: 0.5, end: 0.001 },
            quantity: 1,
            blendMode: Phaser.BlendModes.ADD
          })
        this.explosionEmitter!.active = false
        this.explosionEmitter!.startFollow(this)
    }

    private angleToDestination(): number { //from source (x1,y1) to destination (x2, y2)
        let sourcePoint = new Phaser.Geom.Point(this.source.x, this.source.y)
        let destinationPoint = new Phaser.Geom.Point(this.destination.x, this.destination.y)
        let angleBetweenPoints = Phaser.Math.Angle.BetweenPoints(sourcePoint, destinationPoint)  
        return angleBetweenPoints * 180 / Math.PI
    }

    private accelerateToDestination() {
        let vec = new Phaser.Math.Vector2(this.destination.x - this.source.x, this.destination.y - this.source.y)
        vec.normalize()
        this.vector = vec
        this.setAcceleration(vec.x*this.accelerationFactor, vec.y*this.accelerationFactor)
    } 

    hasReachedDestination(error: number = 3.0): boolean {
        //TODO some error margin dependent on accel factor?
        let deltaX = Math.abs(this.x - this.destination.x)
        let deltaY = Math.abs(this.y - this.destination.y)   
        return deltaX <= error || deltaY <= error
    }

    isOutOfBounds(): boolean {
        let containedInX = this.x >= 0 && this.x <= ScreenSizeService.canvasWidth
        let containedInY = this.y >= 0 && this.y <= ScreenSizeService.canvasHeight
        return !containedInX || !containedInY
    }

    move(x: number, y: number) {
        this.x += x
        this.y += y
    }

    stop() {
        this.setAcceleration(0, 0)
        this.setVelocity(0, 0)
        this.explode()
        // this.stopTrailEmitter()
    }

    stopTrailEmitter() {
        if (this.trailEmitter) {
            this.trailEmitter!.explode(0, this.x, this.y)
        }
    }

    explode() {
        this.stopTrailEmitter()
        this.setHitBox(this.explosionRadiusMultiplier)

        this.setVisible(false)
        if (this.explosionEmitter) {
            this.explosionEmitter!.active = true
            this.explosionEmitter!.explode(50, this.x, this.y)
        }
        //explosion lingers for small time
        let waitTime = (this.explosionLinger != null) ? this.explosionLinger : 0
        setTimeout(() => {
            this.destroy(true)
        }, waitTime);
    }

    setAngleWithOffset(angle: number) {
        this.angle = angle + this.angleOffset
    }

    getAngleWithOffset(): number {
        return this.angle + this.angleOffset
    }
}