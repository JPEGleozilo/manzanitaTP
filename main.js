import arena from "./scenes/arena.js";

// Create a new Phaser config object
const config = {
  type: Phaser.AUTO,
  width: 320,
  height: 180,
  pixelArt: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    min: {
      width: 320,
      height: 180,
    },
    max: {
      width: 2560,
      height: 1440,
    },
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  // List of scenes to load
  // Only the first scene will be shown
  // Remember to import the scene before adding it to the list
  scene: [arena],
};

// Create a new Phaser game instance
window.game = new Phaser.Game(config);
