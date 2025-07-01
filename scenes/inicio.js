import { Ver } from "../main.js"

export default class inicio extends Phaser.Scene {
  constructor() {
    super("inicio");
  }

  init(data) {
    this.highscore = (typeof data.highscore !== "undefined")
    ? data.highscore
    : Number(localStorage.getItem("highscore 4.0")) || 0;
  }

  preload() {
    this.load.image("fondo", "public/assets/fondo.png");
    this.load.image("logo", "public/assets/logo.png");
    this.load.audio("startsound" , "public/assets/audio/play.mp3");      
    this.load.bitmapFont("retroR", "public/assets/fonts/Retro Gaming/RetroGamingRED.png", "public/assets/fonts/Retro Gaming/RetroGamingRED.xml");
    this.load.bitmapFont("retro", "public/assets/fonts/Retro Gaming/RetroGaming.png", "public/assets/fonts/Retro Gaming/RetroGaming.xml")

  }

  create() {
    this.add.image(0, 0, "fondo").setOrigin(0, 0);
    this.add.image(160, 50, "logo").setOrigin(0.5, 0.5).setScale(2.25);

    this.add.bitmapText(160, 160, "retro", `Hi-Score: ${Math.round(this.highscore)}`).setOrigin(0.5, 0)

    this.add.bitmapText(160, 120, "retroR", "PRESS ENTER")
    .setOrigin(0.5, 0)

    this.add.bitmapText(315, 175, "retro", `${Ver}`)
    .setOrigin(1, 1);

    this.playsound = this.sound.add("startsound", {volume: 1})

    this.enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER); 
  }

  update() {
    if(Phaser.Input.Keyboard.JustDown(this.enter)){
      this.playsound.play()
        this.scene.start("arena");
        this.scene.stop("inicio");
    }

    if(this.highscore === null) {
      this.highscore = 0
    }
  }
}