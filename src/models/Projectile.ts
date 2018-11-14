import { downsampleRatio } from "../main";

export class Projectile {

    asset?: Phaser.Physics.Impact.ImpactImage
    sourceX: number = 0
    sourceY: number = 0

    constructor(asset: Phaser.Physics.Impact.ImpactImage, destinationX: number, destinationY: number) {
        this.asset = asset
        asset.setScale(downsampleRatio)
        this.sourceX = asset.x
        this.sourceY = asset.y
        console.log("fired from " + asset.x + "x" + asset.y)
    }

    getVector() { //from source (x1,y1) to destination (x2, y2)
        //TODO using soh cah toa
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
        this.asset!.angle = angle
    }

}