import { Projectile } from "../models/Projectile";
import { PlayerEntity } from "./AIService";

export class ProjectileTrackingService {
    scene?: Phaser.Scene

    currentProjectiles?: Projectile[]
    currentColliders?: Phaser.Physics.Arcade.Collider[]

    static instance = new ProjectileTrackingService()
    onProjectileRemoved?: (projectile: Projectile) => void //external callback
    onProjectileCollision?: (projectile: Projectile, collidedObject: any) => void //external callback

    constructor() {
        this.currentProjectiles = new Array()
        this.currentColliders = new Array()
    }

    init(scene: Phaser.Scene) {
        this.scene = scene
    }

    // private getAllCurrentProjectilesAsObjects(): Phaser.Physics.Arcade.Image[] {
    //     var assets = new Array()
    //     let currentProjectiles = (this.currentProjectiles != null) ? this.currentProjectiles : []
    //     for (var i = 0; i<currentProjectiles.length; i++) {
    //         if (currentProjectiles[i].asset) {
    //             assets.push(currentProjectiles[i].asset)
    //         }
    //     }
    //     return assets
    // }

    addProjectile(projectile: Projectile) {
        if (this.currentProjectiles) {
            this.currentProjectiles!.push(projectile)
        }
        document.getElementById("debug")!.innerHTML = ProjectileTrackingService.instance.currentProjectiles!.toString()

        if (this.currentColliders) {

            // let collider = this.scene!.physics.add.collider(projectile.asset!, this.getAllCurrentProjectilesAsObjects(), this.onCollision)
            // this.currentColliders!.push(collider)
        }
    }

    onCollision(object1: Phaser.GameObjects.GameObject, object2: Phaser.GameObjects.GameObject) {
        // if (object1 instanceof Phaser.Physics.Arcade.Image)
    }

    removeProjectile(projectile: Projectile) {
        let index = this.getCurrentProjectiles().indexOf(projectile, 0)
        if (index > -1) {
            this.currentProjectiles!.splice(index, 1)
        }
        
        //TODO testing
        document.getElementById("debug")!.innerHTML = ProjectileTrackingService.instance.currentProjectiles!.toString()
        if (this.onProjectileRemoved) {
            this.onProjectileRemoved(projectile) 
        }
    }

    updateProjectiles() {
        for (var i = 0; i<this.getCurrentProjectiles().length; i++) {
            let projectile = this.currentProjectiles![i]
            projectile.increaseTrail()
            projectile.updateDistanceTravelled()
        }
    }

    removeOutOfBoundsProjectiles() {
        for (var i = 0; i<this.getCurrentProjectiles().length; i++) {
            let projectile = this.currentProjectiles![i]
            if (projectile.isOutOfBounds()) {
                this.removeProjectile(projectile)
            }
        }
    }

    removeExpiredProjectiles(playerOnly: boolean) {
        for (var i = 0; i<this.getCurrentProjectiles().length; i++) {
            let projectile = this.currentProjectiles![i]
            if (projectile.hasReachedDestination()) {
                if (playerOnly) {
                    if (projectile.owner! == PlayerEntity.player) {
                        this.removeProjectile(projectile)
                    }
                } else {
                    this.removeProjectile(projectile)
                }
            }
        }
    }

    getCurrentProjectiles(): Projectile[] {
        if (this.currentProjectiles) {
            return this.currentProjectiles
        } else {
            return []
        }
    }

}