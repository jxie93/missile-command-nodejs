import { Projectile } from "../models/Projectile";
import { PlayerEntity } from "./AIService";
import { GameObjects } from "phaser";

// service for managing fired projectiles and collision for them
export class ProjectileTrackingService {
    scene?: Phaser.Scene

    currentProjectiles?: Projectile[]

    static instance = new ProjectileTrackingService()
    // onProjectileRemoved?: (removedProjectile: Projectile) => void //external callback
    // onProjectileCollided?: (projectile: Projectile, collidedObject: any) => void //external callback

    constructor() {
        this.currentProjectiles = new Array()
    }

    init(scene: Phaser.Scene) {
        this.scene = scene
    }

    addProjectile(projectile: Projectile) {
        if (this.currentProjectiles) {
            this.currentProjectiles!.push(projectile)
        }

        let projectileOwner = projectile.owner
        //player projectiles can only collide with enemy and vice versa
        let collisionProjectiles = projectileOwner == PlayerEntity.enemy ? 
            this.getCurrentProjectilesOwnedBy(PlayerEntity.player) : this.getCurrentProjectilesOwnedBy(PlayerEntity.enemy)
        let collider = this.scene!.physics.add.collider(projectile, collisionProjectiles, this.onProjectileCollision)
        projectile.collider = collider
    }

    onProjectileCollision(object1: Phaser.GameObjects.GameObject, object2: Phaser.GameObjects.GameObject) {
        let projectile1 = object1 as Projectile
        let projectile2 = object2 as Projectile

        if (projectile2.hitPoints > projectile1.damage) {
            projectile2.hitPoints--
            projectile1.explosionLinger = 0
            projectile1.explode()
        } else {
            projectile1.explode()
            projectile2.explode()
        }

        projectile1.removeCollider()
    }

    removeProjectile(projectile: Projectile) {
        let index = this.getCurrentProjectiles().indexOf(projectile, 0)
        if (index > -1) {
            this.currentProjectiles!.splice(index, 1)
        }

        projectile.stop()
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

    getCurrentProjectilesOwnedBy(owner: PlayerEntity): Projectile[] {
        var result: Projectile[] = new Array()
        let currentProjectiles = this.getCurrentProjectiles()
        for (var i = 0; i<currentProjectiles.length; i++) {
            if (currentProjectiles[i].owner == owner) {
                result.push(currentProjectiles[i])
            }
        }
        return result
    }

}