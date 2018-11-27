import { downsampleRatio } from "../main";

export class Projectile {

    asset?: Phaser.Physics.Arcade.Image
    assetOffset: number = 90

    sourceX: number = 0
    sourceY: number = 0

    destinationX: number = 0
    destinationY: number = 0

    accelerationFactor: number = 1.0

    constructor(asset: Phaser.Physics.Arcade.Image, destinationX: number, destinationY: number, accelModifier: number) {
        this.asset = asset
        asset.setScale(downsampleRatio)
        this.sourceX = asset.x
        this.sourceY = asset.y
        this.destinationX = destinationX
        this.destinationY = destinationY
        this.accelerationFactor = accelModifier

        this.setAngle(this.angleToDestination())
        this.accelerateToDestination()
    }


    private angleToDestination(): number { //from source (x1,y1) to destination (x2, y2)
        let sourcePoint = new Phaser.Geom.Point(this.sourceX, this.sourceY)
        let destinationPoint = new Phaser.Geom.Point(this.destinationX, this.destinationY)
        let angleBetweenPoints = Phaser.Math.Angle.BetweenPoints(sourcePoint, destinationPoint)  
        return angleBetweenPoints * 180 / Math.PI
    }

    private accelerateToDestination() {
        let deltaX = this.destinationX - this.sourceX
        let deltaY = this.destinationY - this.sourceY
        let magnitude = Math.sqrt(deltaX*deltaX + deltaY*deltaY)
        let unitDeltaX = deltaX/magnitude
        let unitDeltaY = deltaY/magnitude
        // this.asset!.setVelocity(unitDeltaX*this.accelerationFactor, unitDeltaY*this.accelerationFactor)
        this.asset!.setAcceleration(unitDeltaX*this.accelerationFactor, unitDeltaY*this.accelerationFactor)
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

    setAngle(angle: number) {
        //offset because initial asset is pointing upwards
        this.asset!.angle = angle + this.assetOffset
    }

}