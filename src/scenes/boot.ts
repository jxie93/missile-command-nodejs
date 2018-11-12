import * as Phaser from "phaser";

export class Boot extends Phaser.Scene {
  init() {
    console.log("Booting");
  }

  preload () {
    console.log("Load things necessary during preload scene");

    this.load.setBaseURL("/assets")
    this.load.image("player", "player_base.png")
    this.load.image("enemy", "enemy_base.png")
    
    this.scene.start("preload");
  }
}