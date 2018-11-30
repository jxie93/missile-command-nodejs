import { BaseObject } from "../models/BaseObject";
import { Projectile } from "../models/Projectile";
import { ProjectileTrackingService } from "./ProjectileTrackingService";
import { ObjectKey } from "./InitialisationService";
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

    attackFrequency: number = 0.1
    attackDivergence: number = 1000

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
        this.performBasicAttack(this.attackDivergence, this.attackFrequency)
    }

    //accuracy - max divergence
    //frequency - should attack
    private performBasicAttack(maxDivergence: number, frequency: number) {
        let shouldAttack = Math.random()
        if (shouldAttack > frequency) {
            return
        }

        let targetDestination = new Phaser.Math.Vector2(this.playerBase!.x, this.playerBase!.y)

        let randomDivergence = Math.random()*maxDivergence
        let varianceSign = Math.random() > 0.5 ? 1 : -1 //which direction to diverge in
        let finalDivergeance = randomDivergence * varianceSign

        var enemyMissile = new Projectile(this.scene!, this.enemyBase!.x, this.enemyBase!.y, ObjectKey.enemyMissile, 
        targetDestination.x + finalDivergeance, targetDestination.y + finalDivergeance, PlayerEntity.enemy,
        10.0, ObjectKey.enemyMissileTrail, ObjectKey.explosionParticle1, 250, 2)
        // enemyMissile.hitPoints = 2
        this.scene!.add.existing(enemyMissile)
        
        ProjectileTrackingService.instance.addProjectile(enemyMissile)
    }
    
}