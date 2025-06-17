export default class inicio extends Phaser.Scene {
  constructor() {
    super("inicio");
  }

  preload() {
    this.load.image("fondo", "public/assets/Cielo.webp");
    this.load.image("boton", "public/assets/boton.png");
    this.load.image("logo", "public/assets/logo.png");
    this.load.image("selector", "public/assets/triangle.png")
  }

  create() {
    this.add.image(0, 0, "fondo").setOrigin(0, 0);
    this.add.image(160, 50, "logo").setScale(0.5, 0.5);
    this.add.image(160, 150, "boton").setScale(0.5, 0.5);
    this.add.image(100, 150, "selector").setScale(0.25, 0.25);
    
    this.input.manager.canvas.style.cursor = "none";

        this.enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
  }

  update() {
    if(Phaser.Input.Keyboard.JustDown(this.enter)){
        this.scene.start("arena");
        this.scene.stop("inicio");
    }
  }
}