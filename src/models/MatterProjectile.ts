import { PlayerEntity } from "../services/AIService";
import { ObjectKey } from "../controllers/game";
import { downsampleRatio } from "../main";
import { ScreenSizeService } from "../services/ScreenSizeService";

export enum ProjectileType {
    //TODO
}

export class MatterProjectile extends Phaser.Physics.Matter.Image {
    angleOffset: number = 90

    owner?: PlayerEntity

    source: Phaser.Geom.Point = new Phaser.Geom.Point(0, 0)
    destination: Phaser.Geom.Point = new Phaser.Geom.Point(0, 0)
    accelerationFactor: number = 1.0 //defined magnitude
    vector: Phaser.Math.Vector2 = new Phaser.Math.Vector2(0, 0) //normalised

    trailEmitter?: Phaser.GameObjects.Particles.ParticleEmitter
    explosionEmitter?: Phaser.GameObjects.Particles.ParticleEmitter
    explosionLinger?: number //in ms
    explosionRadiusMultiplier?: number //blast radius

    constructor(world: Phaser.Physics.Matter.World, sourceX: number, sourceY: number, assetKey: string, 
        destinationX: number, destinationY: number, owner: PlayerEntity, accelModifier?: number,
        trailParticleAsset?: ObjectKey, explosionParticleAsset?: ObjectKey, explosionLinger?: number, blastMultiplier?: number) {
        super(world, sourceX, sourceY, assetKey)

        // scene.physics.add.existing(this)
        world.add(this)

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

        
        // this.setHitBox()
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
            this.setCircle(finalRadius*finalMultiplier, {})
            // this.setCircle(finalRadius*finalMultiplier, offsetX*finalMultiplier, offsetY*finalMultiplier)
        }
    }

    //creates and attaches a trail particle system that follows the asset
    private createTrailEmitter(assetKey: ObjectKey) {
        var particles = this.scene!.add.particles(assetKey)
        this.trailEmitter = particles.createEmitter({
            lifespan: 1000,
                speed: { min: 0, max: 500 },
                angle: this.getAngleWithOffset(),
                scale: { start: 0.25, end: 0 },
                quantity: 1,
                blendMode: Phaser.BlendModes.ADD,
            })
        this.trailEmitter!.startFollow(this)
        //TODO offset
        // this.trailEmitter!.followOffset = this.vector!.scale(-40)
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

        this.setFriction(0, 0, 0)
        this.setVelocity(vec.x, vec.y)
        // this.setAcceleration(vec.x*this.accelerationFactor, vec.y*this.accelerationFactor)
    } 

    hasReachedDestination(error: number = 3): boolean {
        //TODO some error margin dependent on accel factor?
        //TODO how to make this more reliable!?
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
        // this.setAcceleration(0, 0)

        this.setVelocity(0, 0)
        this.explode()
        this.stopTrailEmitter()
    }

    stopTrailEmitter() {
        if (this.trailEmitter) {
            this.trailEmitter!.explode(0, this.x, this.y)
        }
    }

    explode() {
        // this.setHitBox(this.explosionRadiusMultiplier)
        

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