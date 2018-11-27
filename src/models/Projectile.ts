import { downsampleRatio } from "../main";
import { ScreenSizeService } from "../services/ScreenSizeService";
import { ObjectKey } from "../controllers/game";

export class Projectile {

    scene?: Phaser.Scene
    asset?: Phaser.Physics.Arcade.Image
    assetOffset: number = 90

    source: Phaser.Geom.Point = new Phaser.Geom.Point(0, 0)
    destination: Phaser.Geom.Point = new Phaser.Geom.Point(0, 0)

    accelerationFactor: number = 1.0 //defined magnitude
    vector: Phaser.Math.Vector2 = new Phaser.Math.Vector2(0, 0) //normalised

    trailEmitter?: Phaser.GameObjects.Particles.ParticleEmitter
    explosionEmitter?: Phaser.GameObjects.Particles.ParticleEmitter

    constructor(scene: Phaser.Scene, asset: Phaser.Physics.Arcade.Image, 
        destinationX: number, destinationY: number, accelModifier: number,
        trailParticleAsset: ObjectKey, explosionParticleAsset: ObjectKey) {
        this.scene = scene
        this.asset = asset
        asset.setScale(downsampleRatio)

        this.source = new Phaser.Geom.Point(asset.x, asset.y)
        this.destination = new Phaser.Geom.Point(destinationX, destinationY)
        this.accelerationFactor = accelModifier

        this.setAngle(this.angleToDestination())
        this.accelerateToDestination()

        this.asset!.setOrigin(0.5, 1)
        this.createTrailEmitter(trailParticleAsset)
        this.createExplosionEmitter(explosionParticleAsset)

        this.setHitBox()
    }

    private setHitBox() {
        //TODO get a good fit
        var longestSide = this.asset!.width
        if (this.asset!.height > longestSide) {
            longestSide = this.asset!.height
        }
        this.asset!.setSize(longestSide, longestSide)
    }

    //creates and attaches a trail particle system that follows the asset
    private createTrailEmitter(assetKey: ObjectKey) {
        var particles = this.scene!.add.particles(assetKey)
        this.trailEmitter = particles.createEmitter({
            lifespan: 500,
            speed: { min: 0, max: 500 },
            angle: this.getAngle(),
            scale: { start: 1, end: 0 },
            quantity: 1,
            blendMode: Phaser.BlendModes.ADD
          })
        this.trailEmitter!.startFollow(this.asset!)
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
        this.explosionEmitter!.startFollow(this.asset!)
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
        this.asset!.setAcceleration(vec.x*this.accelerationFactor, vec.y*this.accelerationFactor)
    } 

    hasReachedDestination(error: number = 5.0): boolean {
        //TODO some error margin dependent on accel factor?
        let deltaX = Math.abs(this.asset!.x - this.destination.x)
        let deltaY = Math.abs(this.asset!.y - this.destination.y)   
        return deltaX <= 5 || deltaY <= 5
    }

    isOutOfBounds(): boolean {
        let containedInX = this.asset!.x >= 0 && this.asset!.x <= ScreenSizeService.canvasWidth
        let containedInY = this.asset!.y >= 0 && this.asset!.y <= ScreenSizeService.canvasHeight
        return !containedInX || !containedInY
    }

    setVelocity(dX: number = 0, dY: number = 0) {
        this.asset!.setVelocity(dX, dY)
    }

    setAcceleration(dX: number = 0, dY: number = 0) {
        this.asset!.setAcceleration(dX, dY)
    }

    move(x: number, y: number) {
        this.asset!.x += x
        this.asset!.y += y
    }

    stop() {
        this.setAcceleration(0, 0)
        this.setVelocity(0, 0)
        this.explode()
        this.stopTrailEmitter()
    }

    stopTrailEmitter() {
        if (this.trailEmitter) {
            this.trailEmitter!.explode(0, this.asset!.x, this.asset!.y)
        }
    }

    explode() {
        this.asset!.setVisible(false)
        if (this.explosionEmitter) {
            this.explosionEmitter!.active = true
            this.explosionEmitter!.explode(50, this.asset!.x, this.asset!.y)
        }
        this.asset!.destroy(true)
    }

    setAngle(angle: number) {         //offset because initial asset is pointing upwards
        this.asset!.angle = angle + this.assetOffset
    }

    getAngle(): number {
        return this.asset!.angle + this.assetOffset
    }

}