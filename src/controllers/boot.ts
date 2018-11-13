import * as Phaser from "phaser";

export class Boot extends Phaser.Scene {
  init() {
    console.log("Booting");
  }

  preload () {
    console.log("Load things necessary for create");
  }

  create() {
    console.log("Boot create");
    this.scene.start("preload");
  }

}