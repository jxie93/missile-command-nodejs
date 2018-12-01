import { GameObjects } from "phaser";
import { Ship } from "../models/Ship";

export class ShipTrackingService { //TODO
    scene?: Phaser.Scene

    currentShips?: Ship[]

    static instance = new ShipTrackingService()

    constructor() {
        this.currentShips = new Array()
    }

    init(scene: Phaser.Scene) {
        this.scene = scene
    }

    trackObject(ship: Ship) {
        if (this.currentShips) {
            this.currentShips.push(ship)
        }

        //TODO add colliders
    }

    onCollision(ship: Phaser.GameObjects.GameObject, object2: Phaser.GameObjects.GameObject) {

    }

}