export default class inicio extends Phaser.Scene {
  constructor() {
    super("inicio");
  }

  init(data) {
    this.highscore = (typeof data.highscore !== "undefined")
    ? data.highscore
    : Number(localStorage.getItem("highscore")) || 0;
  }

  preload() {
    this.load.image("fondo", "public/assets/fondo.png");
    this.load.image("logo", "public/assets/logo.png");       
    this.load.bitmapFont("retroR", "public/assets/fonts/Retro Gaming/RetroGamingRED.png", "public/assets/fonts/Retro Gaming/RetroGamingRED.xml");
    this.load.bitmapFont("retro", "public/assets/fonts/Retro Gaming/RetroGaming.png", "public/assets/fonts/Retro Gaming/RetroGaming.xml")

  }

  create() {
    this.add.image(0, 0, "fondo").setOrigin(0, 0);
    this.add.image(160, 50, "logo").setScale(0.25, 0.25);

    this.add.bitmapText(160, 160, "retro", `Hi-Score: ${Math.round(this.highscore)}`).setOrigin(0.5, 0)
    
    this.input.manager.canvas.style.cursor = "none";

    this.add.bitmapText(160, 120, "retroR", "PRESS ENTER")
    .setOrigin(0.5, 0)

    this.enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER); 
  }

  update() {
    if(Phaser.Input.Keyboard.JustDown(this.enter)){
        this.scene.start("arena");
        this.scene.stop("inicio");
    }

    if(this.highscore = null) {
      this.highscore = 0
    }
  }
}