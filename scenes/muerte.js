export default class muerte extends Phaser.Scene {
  constructor() {
    super("muerte");
  }

  init(data) {
    this.score = data.score;
    this.tiempo = data.tiempo;
  }

  preload() {
    this.load.bitmapFont("upheR", "public/assets/fonts/Upheaval/UpheavalRED.png", "public/assets/fonts/Upheaval/UpheavalRED.xml");
    this.load.bitmapFont("retro", "public/assets/fonts/Retro Gaming/RetroGaming.png");
    this.load.bitmapFont("retroR", "public/assets/font/Retro Gaming/RetroGamingRED.png")
  }

  create(data) {
    this.gameText = this.add.bitmapText(160, 35, "upheR", `GAME`).setOrigin(0.5, 0.5).setScale(2);
    this.overText = this.add.bitmapText(160, 60, "upheR", `OVER`).setOrigin(0.5, 0.5).setScale(2);
    this.tiempoText = this.add.bitmapText(160, 90, "retro",  `Time: ${this.tiempo}s`).setOrigin(0.5, 0.5);
    this.scoreText = this.add.bitmapText(160, 110, "retro", `Score: ${this.score}`).setOrigin(0.5, 0.5);
    this.restartText = this.add.bitmapText(160, 130, "retroR", "Press R to restart").setOrigin(0.5, 0.5);
    this.restartText.visible = false

    

    this.input.manager.canvas.style.cursor = "none";

    this.Rkey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R); 

    this.countdown = false
    this.tiempoEnd = false
    this.scoreEnd = false

    this.finalScore = this.score * (this.tiempo * 0.1);

    if (this.finalScore < this.score) {
      this.finalScore = this.score 
    };
    
    this.time.addEvent ({
      delay: 2000,
      callback: () => {
        this.countdown = true
      }
    });

    let highscore = Number(localStorage.getItem("highscore")) || 0;
    let lowscore = highscore;

    
    if (this.finalScore > highscore) {
      highscore = this.finalScore;
      localStorage.setItem("highscore", highscore);
    }

    if (highscore === undefined) {
      highscore = 0
    }
    if (this.lowscore === undefined) {
      this.lowscore = 0
    }

    this.highscoreText = this.add.bitmapText(160, 150, "retro", `Hi-Score: ${lowscore}`).setOrigin(0.5, 0.5);

    this.highscore = highscore;
    this.lowscore = lowscore;
  }

  update() {
    if (this.countdown = true) {
      if (this.tiempo > 0) {
        this.tiempo --
        this.tiempoText.setText(`Time: ${Math.round(this.tiempo)}s`);
      } else {
        this.tiempoEnd = true
      };

    if (this.score < this.finalScore) {
      this.score += 6
      this.scoreText.setText(`Score: ${Math.round(this.score)}`);
    } else if (this.score > this.finalScore) {  
    this.score = this.finalScore
    } else {
      this.scoreEnd = true
    }};

    if (this.lowscore < this.score) {
      this.highscoreText.setText(`Hi-Score: ${Math.round(this.score)}`)
    }

    if (this. tiempoEnd === true && this.scoreEnd === true) {
      this.restartText.visible = true
    };

    if(Phaser.Input.Keyboard.JustDown(this.Rkey)){
        this.scene.start("inicio", {highscore: this.highscore});
        this.scene.stop("muerte");
    }
  }

}