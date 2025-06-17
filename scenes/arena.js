function isBlocked(x, y, bordes, cellSize) {
  return bordes.getChildren().some(borde => {
    return Phaser.Geom.Intersects.RectangleToRectangle(
      new Phaser.Geom.Rectangle(x, y, cellSize, cellSize),
      borde.getBounds()
    );
  });
}

function nextPosition(x, y, dir, cellSize) {
  if (dir === 'up') return { x, y: y - cellSize };
  if (dir === 'down') return { x, y: y + cellSize };
  if (dir === 'left') return { x: x - cellSize, y };
  if (dir === 'right') return { x: x + cellSize, y };
}

function turnLeft(dir) {
  return { up: 'left', left: 'down', down: 'right', right: 'up' }[dir];
}

function turnRight(dir) {
  return { up: 'right', right: 'down', down: 'left', left: 'up' }[dir];
}

function snakePathfinding(start, goal, dir, bordes, cellSize) {
  const queue = [];
  const visited = new Set();
  queue.push({ x: start.x, y: start.y, dir, path: [] });

  while (queue.length > 0) {
    const node = queue.shift();
    const key = `${node.x},${node.y},${node.dir}`;
    if (visited.has(key)) continue;
    visited.add(key);

    if (
      Math.abs(node.x - goal.x) < cellSize &&
      Math.abs(node.y - goal.y) < cellSize
    ) {
      return node.path;
    }

    const { x: nx, y: ny } = nextPosition(node.x, node.y, node.dir, cellSize);
    if (!isBlocked(nx, ny, bordes, cellSize)) {
      queue.push({ x: nx, y: ny, dir: node.dir, path: [...node.path, 'forward'] });
    }

    const leftDir = turnLeft(node.dir);
    queue.push({ x: node.x, y: node.y, dir: leftDir, path: [...node.path, 'left'] });

    const rightDir = turnRight(node.dir);
    queue.push({ x: node.x, y: node.y, dir: rightDir, path: [...node.path, 'right'] });
  }
  return null;
}

export default class arena extends Phaser.Scene {
  constructor() {
    super("arena");
  }

  init() {}

  preload() {
    this.load.image("fondo", "public/assets/Cielo.webp");
    this.load.image("player", "public/assets/pacman.png");
    this.load.image("moneda", "public/assets/diamond.png");
    this.load.image("borde", "public/assets/borde.png");
    this.load.image("enemigo", "public/assets/Ninja.png");
  }

  create() {
    this.add.image(0, 0, "fondo").setOrigin(0, 0);
    this.player = this.physics.add.image(180, 90, "player").setDisplaySize(16, 16);
    this.player.setCollideWorldBounds(true);

    this.enemigo = this.physics.add.image(140, 90, "enemigo").setDisplaySize(16, 16);
    this.enemigo.setCollideWorldBounds(true);

    this.enemyDir = 'right';
    this.enemyPath = [];
    this.enemyPathStep = 0;

    this.cursors = this.input.keyboard.createCursorKeys();

    this.input.manager.canvas.style.cursor = "none";
    
    this.bordes = this.physics.add.staticGroup();
    this.bordes.create(160, 19, "borde").setOrigin(0.5, 0.5).setDisplaySize(280, 2).refreshBody();
    this.bordes.create(160, 161, "borde").setOrigin(0.5, 0.5).setDisplaySize(280, 2).refreshBody();
    this.bordes.create(19, 90, "borde").setOrigin(0.5, 0.5).setDisplaySize(2, 140).refreshBody(); 
    this.bordes.create(301, 90, "borde").setOrigin(0.5, 0.5).setDisplaySize(2, 140).refreshBody();
    
    this.physics.add.collider(this.player, this.bordes);
    this.physics.add.collider(this.enemigo, this.bordes);
    this.physics.add.collider(this.enemigo, this.player, () => {
      this.muerte = true;
    })

    this.speedEnemigo = 0
    this.start = false;

    this.monedas = 0;
    this.score = 0;
    this.scoretext = this.add.text(16, 2, `Score: ${this.score}`);

    this.tiempo = 0;
    this.tiempotext = this.add.text(280, 2, `${this.tiempo}`);

    this.muerte = false

    this.time.addEvent({
      delay: 2000,
      callback: () => {
        if (this.monedas < 1) {
          const x = Phaser.Math.Between(25, 275);
          const y = Phaser.Math.Between(25, 155);
          this.coin = this.physics.add
            .image(x, y, "moneda")
            .setScale(0.075, 0.075);
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
    this.time.addEvent({
      delay: 3000,
      callback: () => {
        this.start = true
      }
    })
  }

  update() {
  if (this.start === true) {
        this.speedEnemigo = 80
           if (
            (!this.enemyPath || this.enemyPathStep >= this.enemyPath.length) &&
            this.enemyPath !== null
          ) {
        // Tamaño de celda dinámico (puedes ajustar si quieres)
        let cellSize = 16;
        if (
          this.player.body.blocked.up ||
          this.player.body.blocked.down ||
          this.player.body.blocked.left ||
          this.player.body.blocked.right
        ) {
          cellSize = 2;
        }
        const start = {
          x: Math.round(this.enemigo.x / cellSize) * cellSize,
          y: Math.round(this.enemigo.y / cellSize) * cellSize
        };
        const goal = {
          x: Math.round(this.player.x / cellSize) * cellSize,
          y: Math.round(this.player.y / cellSize) * cellSize
        };
        let path = snakePathfinding(start, goal, this.enemyDir, this.bordes, cellSize);
    // 2. Si no encuentra, intenta con cellSize 2
    if (!path && cellSize !== 2) {
      const start2 = {
        x: Math.round(this.enemigo.x / 2) * 2,
        y: Math.round(this.enemigo.y / 2) * 2
      };
      const goal2 = {
        x: Math.round(this.player.x / 2) * 2,
        y: Math.round(this.player.y / 2) * 2
      };
      path = snakePathfinding(start2, goal2, this.enemyDir, this.bordes, 2);
      if (path) cellSize = 2; // Para que el movimiento siga usando 2
      }
      this.enemyPath = path;
      this.enemyPathStep = 0;

      }

      // --- MOVIMIENTO DEL ENEMIGO ---
      if (this.enemyPath && this.enemyPathStep < this.enemyPath.length) {
        const action = this.enemyPath[this.enemyPathStep];
        let vx = 0, vy = 0;

        if (action === 'forward') {
          if (this.enemyDir === 'up') vy = -1;
          if (this.enemyDir === 'down') vy = 1;
          if (this.enemyDir === 'left') vx = -1;
          if (this.enemyDir === 'right') vx = 1;
        } else if (action === 'left') {
          this.enemyDir = turnLeft(this.enemyDir);
        } else if (action === 'right') {
          this.enemyDir = turnRight(this.enemyDir);
        }

        this.enemigo.setVelocity(vx * this.speedEnemigo, vy * this.speedEnemigo);

        if (action === 'forward') {
          this.enemyPathStep++;
        } else {
          this.enemigo.setVelocity(0, 0);
          this.enemyPathStep++;
        }
      } else {
        this.enemigo.setVelocity(0, 0);
      }
    }

    const speed = 160;
    let vx = 0;
    let vy = 0;

    if (this.cursors.left.isDown) vx -= 1;
    if (this.cursors.right.isDown) vx += 1;
    if (this.cursors.up.isDown) vy -= 1;
    if (this.cursors.down.isDown) vy += 1;

    if (vx !== 0 && vy !== 0) {
      vx *= Math.SQRT1_2; // 1/√2
      vy *= Math.SQRT1_2;
    }

    this.player.setVelocityX(vx * speed);
    this.player.setVelocityY(vy * speed);

    if (this.muerte === true) {
      this.scene.start("muerte");
      this.scene.stop("arena");
    }
  }

}
