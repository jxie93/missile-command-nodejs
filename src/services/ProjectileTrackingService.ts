import { Projectile } from "../models/Projectile";
import { PlayerEntity } from "./AIService";
import { GameObjects } from "phaser";
import { ShipTrackingService } from "./ShipTrackingService";
import { ModelType } from "./InitialisationService";
import { ShipSection } from "../models/Ship";

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

        this.setupProjectileCollision(projectile)
    }

    setupProjectileCollision(projectile: Projectile) {
        let projectileOwner = projectile.owner
        //player projectiles can only collide with enemy's and vice versa
        let collisionProjectiles: GameObjects.GameObject[] = projectileOwner == PlayerEntity.enemy ? 
            this.getCurrentProjectilesOwnedBy(PlayerEntity.player) : this.getCurrentProjectilesOwnedBy(PlayerEntity.enemy)
        
        //player projectiles can only collide with enemy ships and vice versa
        let collisionShipSections: GameObjects.GameObject[] = projectileOwner == PlayerEntity.enemy ?
            ShipTrackingService.instance.getCurrentShipSections(PlayerEntity.player) : ShipTrackingService.instance.getCurrentShipSections(PlayerEntity.enemy)

        let finalCollisionObjects = collisionProjectiles.concat(collisionShipSections)

        let collider = this.scene!.physics.add.collider(projectile, finalCollisionObjects, this.onProjectileCollision)
        projectile.collider = collider
    }

    //object1 is guaranteed to be a Projectile owned by the player
    onProjectileCollision(object1: Phaser.GameObjects.GameObject, object2: Phaser.GameObjects.GameObject) {
        let projectile1 = object1 as Projectile
        projectile1.explode()
        projectile1.removeCollider()

        switch (object2.type) {
            case ModelType.ShipSection:
                let shipSection = object2 as ShipSection
                shipSection.onCollision()
                return
            case ModelType.Projectile:
                let projectile2 = object2 as Projectile
                if (projectile2.hitPoints > projectile1.damage) {
                    projectile2.hitPoints--
                    projectile1.explosionLinger = 0
                } else {
                    projectile2.explode()
                }
                break
        }
        
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