import { downsampleRatio } from "../main";

export class Projectile {

    asset?: Phaser.Physics.Impact.ImpactImage

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
        console.log("fired from " + asset.x + "x" + asset.y)
    }

    private getSourceToDestinationAngle(): number { //from source (x1,y1) to destination (x2, y2)
        var angle = Math.atan2(this.destinationY - this.sourceY, this.destinationX - this.sourceX) * 180 / Math.PI
        return angle
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
        let offset = 90 //offset because initial asset is pointing upwards
        this.asset!.angle = angle + offset
    }

}