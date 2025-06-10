// URL to explain PHASER scene: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scene/

export default class arena extends Phaser.Scene {
  constructor() {
    // key of the scene
    // the key will be used to start the scene by other scenes
    super("arena");
  }

  init() {}

  preload() {
    this.load.image("fondo", "public/assets/Cielo.webp");
    this.load.image("player", "public/assets/ninja.png");
    this.load.image("moneda", "public/assets/diamond.png");
  }

  create() {
    this.add.image(0, 0, "fondo");
    this.player = this.physics.add.image(32, 32, "player").setScale(0.05, 0.05);
    this.player.setCollideWorldBounds(true);
    this.cursors = this.input.keyboard.createCursorKeys();

    this.monedas = 0;
    this.score = 0;
    this.scoretext = this.add.text(16, 16, `Score: ${this.score}`);

    this.tiempo = 0;
    this.tiempotext = this.add.text(280, 16, `${this.tiempo}`);

    this.time.addEvent({
      delay: 2000,
      callback: () => {
        if (this.monedas < 1) {
          const x = Phaser.Math.Between(0, this.scale.width);
          const y = Phaser.Math.Between(0, this.scale.height);
          this.coin = this.physics.add
            .image(x, y, "moneda")
            .setScale(0.05, 0.05);
          this.coin.setCollideWorldBounds(true);
          this.monedas += 1;

          this.physics.add.overlap(this.player, this.coin, () => {
            this.coin.destroy();
            this.score += 100;
            this.monedas -= 1;
            this.scoretext.setText(`Score: ${this.score}`);
          });
        }
      },
      loop: true,
    });
    this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.tiempo += 1;
        this.tiempotext.setText(`${this.tiempo}`);
      },
      loop: true,
    });
  }

  update() {
    if (this.cursors.up.isDown && this.cursors.right.isDown) {
      this.player.setVelocityX(80);
      this.player.setVelocityY(-80);
    } else if (this.cursors.up.isDown && this.cursors.left.isDown) {
      this.player.setVelocityX(-80);
      this.player.setVelocityY(-80);
    } else if (this.cursors.down.isDown && this.cursors.right.isDown) {
      this.player.setVelocityX(80);
      this.player.setVelocityY(80);
    } else if (this.cursors.down.isDown && this.cursors.left.isDown) {
      this.player.setVelocityX(-80);
      this.player.setVelocityY(80);
    } else if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
    } else if (this.cursors.up.isDown) {
      this.player.setVelocityY(-160);
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(160);
    } else {
      this.player.setVelocityY(0);
      this.player.setVelocityX(0);
    }
    console.log(this.player.body.velocity);
  }
}
