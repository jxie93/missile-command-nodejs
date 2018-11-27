import { Projectile} from "../models/Projectile";

export class ProjectileTrackingService {
    currentProjectiles?: Projectile[]

    static instance = new ProjectileTrackingService()

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
        if (this.currentProjectiles) {
            let index = this.currentProjectiles.indexOf(projectile, 0)
            if (index > -1) {
                this.currentProjectiles!.splice(index, 1)
            }
        }
        document.getElementById("debug")!.innerHTML = ProjectileTrackingService.instance.currentProjectiles!.toString()

    }

    removeOutOfBoundsProjectiles() {
        if (this.currentProjectiles) {
            for (var i = 0; i<this.currentProjectiles!.length; i++) {
                let projectile = this.currentProjectiles![i]
                if (projectile.isOutOfBounds()) {
                    this.removeProjectile(projectile)
                }
            }
        }
    }

}