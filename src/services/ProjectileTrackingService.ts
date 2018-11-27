import { Projectile} from "../models/Projectile";

export class ProjectileTrackingService {
    currentProjectiles?: Projectile[]

    constructor() {
        this.currentProjectiles = new Array()
    }

    //TODO remove projectiles not in playfield

    addProjectile(projectile: Projectile) {
        if (this.currentProjectiles) {
            this.currentProjectiles!.push(projectile)
        }
    }

    removeProjectile(projectile: Projectile) {
        if (this.currentProjectiles) {
            let index = this.currentProjectiles.indexOf(projectile, 0)
            if (index > -1) {
                this.currentProjectiles!.splice(index, 1)
            }
        }
    }

}