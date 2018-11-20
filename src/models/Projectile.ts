import { downsampleRatio } from "../main";

export class Projectile {

    asset?: Phaser.Physics.Impact.ImpactImage
    assetOffset: number = 90

    sourceX: number = 0
    sourceY: number = 0

    destinationX: number = 0
    destinationY: number = 0

    constructor(asset: Phaser.Physics.Impact.ImpactImage, destinationX: number, destinationY: number) {
        this.asset = asset
        asset.setScale(downsampleRatio)
        this.sourceX = asset.x
        this.sourceY = asset.y
        this.destinationX = destinationX
        this.destinationY = destinationY

        this.setAngle(this.getSourceToDestinationAngle())
        
        this.setSourceToDestinationAcceleration()
        console.log("fired from " + asset.x + "x" + asset.y)
    }


    private getSourceToDestinationAngle(): number { //from source (x1,y1) to destination (x2, y2)
        //TODO why this is not accurate
        let sourcePoint = new Phaser.Geom.Point(this.sourceX, this.sourceY)
        let destinationPoint = new Phaser.Geom.Point(this.destinationX, this.destinationY)
        let angleBetweenPoints = Phaser.Math.Angle.BetweenPoints(sourcePoint, destinationPoint)  
        return angleBetweenPoints * 180 / Math.PI
    }

    private setSourceToDestinationAcceleration() {
        let accelX = this.destinationX - this.sourceX
        let accelY = this.destinationY - this.sourceY
        console.log("WORKING - accel vector " + accelX + "," + accelY)
        this.asset!.setAcceleration(accelX, accelY)
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