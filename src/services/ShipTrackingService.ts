import { GameObjects } from "phaser";
import { Ship } from "../models/Ship";
import { PlayerEntity } from "./AIService";

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

    addShip(ship: Ship) {
        if (this.currentShips) {
            this.currentShips.push(ship)
        }
    }

    removeShip(ship: Ship) {
        let index = this.getCurrentShips().indexOf(ship, 0)
        if (index > -1) {
            this.currentShips!.splice(index, 1)
        }
    }

    //returns all tracked ships
    getCurrentShips(owner?: PlayerEntity): Ship[] {
        var result: Ship[] = new Array()
        if (this.currentShips) {
            for (var i = 0; i<this.currentShips.length; i++) {
                if (owner) {
                    if (this.currentShips[i].owner == owner) {
                        result.push(this.currentShips[i])
                    }
                } else {
                    result.push(this.currentShips[i])
                }
            }
            return result
        } else {
            return []
        }
    }

    //returns all tracked ship containers
    getCurrentShipsAsContainers(owner?: PlayerEntity): Phaser.GameObjects.Container[] {
        var result = new Array()
        let currentShips = this.getCurrentShips(owner)
        for (var i = 0; i<currentShips.length; i++) {
            result.push(currentShips[i].self)
        }
        return result
    }

    //returns all tracked ship sections
    getCurrentShipSections(owner?: PlayerEntity): Phaser.Physics.Arcade.Sprite[] {
        var result = new Array()
        let currentShips = this.getCurrentShips(owner)
        for (var i = 0; i<currentShips.length; i++) {
            result.push.apply(result, currentShips[i].sections!) //flat push
        }
        return result
    }

    // onCollision(ship: Phaser.GameObjects.GameObject, object2: Phaser.GameObjects.GameObject) {

    // }

}