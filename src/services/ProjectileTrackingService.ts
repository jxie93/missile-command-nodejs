import { Projectile} from "../models/Projectile";

export class ProjectileTrackingService {
    currentProjectiles?: Projectile[]
    static instance = new ProjectileTrackingService()
    onProjectileRemoved?: (projectile: Projectile) => void //callback

    constructor() {
        this.currentProjectiles = new Array()
    }

    //TODO remove projectiles not in playfield

    addProjectile(projectile: Projectile) {
        if (this.currentProjectiles) {
            this.currentProjectiles!.push(projectile)
        }
        document.getElementById("debug")!.innerHTML = ProjectileTrackingService.instance.currentProjectiles!.toString()

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

    removeOutOfBoundsProjectiles() {
        for (var i = 0; i<this.getCurrentProjectiles().length; i++) {
            let projectile = this.currentProjectiles![i]
            if (projectile.isOutOfBounds()) {
                this.removeProjectile(projectile)
            }
        }
    }

    removeExpiredProjectiles() {
        for (var i = 0; i<this.getCurrentProjectiles().length; i++) {
            let projectile = this.currentProjectiles![i]
            if (projectile.hasReachedDestination()) {
                this.removeProjectile(projectile)
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