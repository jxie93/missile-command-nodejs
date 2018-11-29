import { BaseSpriteObject } from "../models/BaseObject";
import { Projectile } from "../models/Projectile";
import { ObjectKey } from "../controllers/game";
import { ProjectileTrackingService } from "./ProjectileTrackingService";
import { Ship } from "../models/Ship";

export enum PlayerEntity {
    player = "player",
    enemy = "enemy"
}

export class AIService {
    scene?: Phaser.Scene
    timerEvent?: Phaser.Time.TimerEvent
    playerBase?: Ship
    enemyBase?: Ship

    static instance = new AIService()

    init(scene: Phaser.Scene, playerBase: Ship, enemyBase: Ship) {
        this.scene = scene
        this.enemyBase = enemyBase
        this.playerBase = playerBase
        scene!.time.addEvent({ 
            delay: 1000, 
            callback: this.onTimerEvent, 
            callbackScope: this, 
            repeat: -1}
        );
    }

    //main AI logic loop every 1s
    onTimerEvent() {
        console.log("WORKING - AI timer event")
        this.performBasicAttack(1000, 0.5)
    }

    //accuracy - max divergence
    //frequency - should attack
    private performBasicAttack(maxDivergence: number, frequency: number) {
        let shouldAttack = Math.random()
        if (shouldAttack > frequency) {
            return
        }

        let targetDestination = this.playerBase!.getPosition()

        let randomDivergence = Math.random()*maxDivergence
        let varianceSign = Math.random() > 0.5 ? 1 : -1 //which direction to diverge in
        let finalDivergeance = randomDivergence * varianceSign

        // var enemyMissile = new Projectile(this.scene!, this.enemyBase!.getPosition().x, this.enemyBase!.getPosition().y, ObjectKey.enemyMissile, 
        // targetDestination.x + finalDivergeance, targetDestination.y + finalDivergeance, PlayerEntity.enemy,
        // 50.0, ObjectKey.enemyMissileTrail, ObjectKey.explosionParticle1, 10, 2)
        // this.scene!.add.existing(enemyMissile)
        
        // ProjectileTrackingService.instance.addProjectile(enemyMissile)
    }
    
}