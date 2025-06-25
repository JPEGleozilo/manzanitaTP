function isBlocked(x, y, bordes, cellSizeX, cellSizeY, cuerpo = []) {
  const minX = 17;
  const maxX = 304;
  const minY = 19;
  const maxY = 160;

  if (
    x < minX ||
    x > maxX ||
    y < minY ||
    y > maxY
  ) {
    return true;
  }

  // Chequea colisión con los bordes
  if (bordes.getChildren().some(borde =>
    Phaser.Geom.Intersects.RectangleToRectangle(
      new Phaser.Geom.Rectangle(x, y, cellSizeX, cellSizeY),
      borde.getBounds()
    )
  )) {
    return true;
  }

  // Chequea colisión con el cuerpo de la serpiente
  for (let segment of cuerpo) {
    if (
      Phaser.Math.Distance.Between(
        x + cellSizeX / 2, y + cellSizeY / 2,
        segment.x, segment.y
      ) < Math.max(cellSizeX, cellSizeY) / 2
    ) {
      return true;
    }
  }

  return false;
}

function nextPosition(x, y, dir, cellSizeX, cellSizeY) {
  if (dir === 'up') return { x, y: y - cellSizeY };
  if (dir === 'down') return { x, y: y + cellSizeY };
  if (dir === 'left') return { x: x - cellSizeX, y };
  if (dir === 'right') return { x: x + cellSizeX, y };
}

function turnLeft(dir) {
  return { up: 'left', left: 'down', down: 'right', right: 'up' }[dir];
}

function turnRight(dir) {
  return { up: 'right', right: 'down', down: 'left', left: 'up' }[dir];
}

function snakePathfinding(start, goal, dir, bordes, cellSizeX, cellSizeY, cuerpo) {
  const queue = [];
  const visited = new Set();
  queue.push({ x: start.x, y: start.y, dir, path: [] });

  while (queue.length > 0) {
    const node = queue.shift();
    const key = `${node.x},${node.y},${node.dir}`;
    if (visited.has(key)) continue;
    visited.add(key);

    if (
      Math.abs(node.x - goal.x) < cellSizeX &&
      Math.abs(node.y - goal.y) < cellSizeY
    ) {
      return node.path;
    }

    const { x: nx, y: ny } = nextPosition(node.x, node.y, node.dir, cellSizeX, cellSizeY);
    if (!isBlocked(nx, ny, bordes, cellSizeX, cellSizeY, cuerpo)) {
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
    this.lastPlayerCell = { x: null, y: null };
    this.lastPathTime = 0;
    this.lastEnemyCell = { x: null, y: null }; // NUEVO: para controlar avance por celda
  }


  preload() {
    this.load.image("fondo", "public/assets/fondo.png");
    this.load.image("manzana", "public/assets/manzanita.png");
    this.load.image("borde", "public/assets/borde.png");
    this.load.image("viborita", "public/assets/Viborita cabeza.png");
    this.load.image("viboritacu", "public/assets/Viborita cuerpo.png")
    this.load.bitmapFont("retro", "public/assets/fonts/Retro Gaming/RetroGaming.png", "public/assets/fonts/Retro Gaming/RetroGaming.xml");
    this.load.bitmapFont("uphe" , "public/assets/fonts/Upheaval/Upheaval.png", "public/assets/fonts/Upheaval/Upheaval.xml");
    this.load.spritesheet("manzanitaF", "public/assets/spritesheets/manzanita feliz.png", { frameWidth: 16, frameHeight: 16 });
    this.load.spritesheet("manzanitaA", "public/assets/spritesheets/manzanita asustada.png", { frameWidth: 16, frameHeight: 16 });
    this.load.spritesheet("monedita", "public/assets/spritesheets/moneda.png", { frameWidth: 8, frameHeight: 8 })
  }

  create() {
    this.add.image(0, 0, "fondo").setOrigin(0, 0).setDepth(-10);;

    this.player = this.physics.add.sprite(180, 90, "manzanitaF");
    this.player.setCollideWorldBounds(true);

    this.anims.create({
      key: 'Oeste F',
      frames: [ { key: 'manzanitaF',  frame: 3 } ],
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'Idle F',
      frames: [ { key: 'manzanitaF',  frame: 4 } ],
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'Este F',
      frames: [ {key: 'manzanitaF',  frame: 5 } ],
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'Norte F',
      frames: [ {key: 'manzanitaF',  frame: 1 } ],
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'Sur F',
      frames: [ {key: 'manzanitaF',  frame: 7 } ],
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'NorO F',
      frames: [ {key: 'manzanitaF',  frame: 0 } ],
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'NorE F',
      frames: [ {key: 'manzanitaF',  frame: 2 } ],
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'SurO F',
      frames: [ {key: 'manzanitaF',  frame: 6 } ],
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'SurE F',
      frames: [ {key: 'manzanitaF',  frame: 8 } ],
      frameRate: 10,
      repeat: -1
    });


    this.anims.create({
      key: "giroM",
      frames: this.anims.generateFrameNumbers( "monedita", { start: 0, end: 5}),
      framerate: 1,
      repeat: -1
    })

    this.add.bitmapText(315, 175, "retro", "beta VER 3.1")
    .setOrigin(1, 1);

    this.trailGroup = this.add.group();
    this.trailTimer = 0;

    this.enemigo = this.physics.add.image(140, 90, "viborita");
    this.enemigo.setCollideWorldBounds(true);
    this.enemigo.setBounce(0.2, 0.2)
    this.enemigo.body.setSize(16, 12);

    this.enemyDir = 'right';
    this.enemyPath = [];
    this.enemyPathStep = 0;

    this.enemigoBody = []
    this.bodyPos = []
    this.enemigoDis = 0;
    this.lastHeadPos = { x: this.enemigo.x, y: this.enemigo.y };  

    this.cursors = this.input.keyboard.createCursorKeys();

    this.input.manager.canvas.style.cursor = "none";
    
    this.bordes = this.physics.add.staticGroup();
    this.bordes.create(16, 16, "borde").setOrigin(0, 0).setDisplaySize(288, 2).refreshBody();
    this.bordes.create(16, 162, "borde").setOrigin(0, 0).setDisplaySize(288, 2).refreshBody();
    this.bordes.create(14, 18, "borde").setOrigin(0, 0).setDisplaySize(2, 144).refreshBody(); 
    this.bordes.create(304, 18, "borde").setOrigin(0, 0).setDisplaySize(2, 144).refreshBody();
    
    this.colisionEnemigo = false

    this.physics.add.collider(this.player, this.bordes);
    this.physics.add.collider(this.enemigo, this.bordes, () => {
      this.colisionEnemigo = true;
    });
    this.physics.add.collider(this.enemigo, this.player, () => {
      this.muerte = true;
    });

    this.speedEnemigo = 120;
    this.start = false;

    this.monedas = 0;1
    this.score = 0;
    this.scoretext = this.add.bitmapText(21, 8, "retro", `score: ${this.score}`
    ).setOrigin(0, 0.5);

    this.tiempo = 0;
    this.tiempotext = this.add.bitmapText(298, 8, "retro", `${this.tiempo}`).setOrigin(1, 0.5);

    this.muerte = false;

    this.countdown = 3
    this.countdownText = this.add.bitmapText(160, 90, "uphe", `${this.countdown}`)
    .setOrigin(0.5, 0.5).setDepth(-5);

    this.countdownEvent = this.time.addEvent ({
      delay: 1000,
      callback: () => {
        this.countdown --
        this.countdownText.setText(`${this.countdown}`)

        if (this.countdown <= 0) {
          this.countdownEvent.remove()
          this.time.addEvent({
            delay: 500,
            callback: () => {
            this.countdownText.setText (" ")
            }
          });
        };
      },
      loop: true
    });

    this.time.addEvent({
      delay: 1000,
      callback: () => {
        if (!this.coin) {
          const x = Phaser.Math.Between(32, 288);
          const y = Phaser.Math.Between(32, 154);
          this.coin = this.physics.add
            .sprite(x, y, "monedita");
          this.coin.setCollideWorldBounds(true);

          this.coin.anims.play("giroM", true)

          this.physics.add.overlap(this.player, this.coin, () => {
            if (this.coin) {
              this.coin.destroy();
              this.coin = null;
              this.score += 50;
              this.scoretext.setText(`score: ${this.score}`);
              this.speedEnemigo += 2
              this.speed ++

              const segment = this.physics.add.image(this.enemigo.x, this.enemigo.y, "viboritacu").setDepth(-1);
              segment.setImmovable(true);
              segment.body.allowGravity = false;
              segment.body.setSize(12, 12);
              this.enemigoBody.push(segment);
            
              this.physics.add.collider(segment, this.player, () => {
                this.muerte = true
              });

            }
          });
        }
      },
      loop: true,
    });

    this.time.addEvent({
      delay: 3000,
      callback: () => {
        this.start = true;
      this.time.addEvent({
        delay: 1000,
        callback: () => {
          this.tiempo += 1;
          this.tiempotext.setText(`${this.tiempo}`);
        },
        loop: true,
      });
      }
    });
  }

 update(time) {


  // --- MOVIMIENTO DEL JUGADOR ---

  const speed = 160;
  let vx = 0;
  let vy = 0;

  if (this.cursors.left.isDown) {
    vx -= 1;
    if (vy === 0) {
      this.player.anims.play("Oeste F", true)
    }
  };
  if (this.cursors.right.isDown) {
    vx += 1;
    if (vy === 0) {
      this.player.anims.play("Este F", true)
    }
  };
  if (this.cursors.up.isDown) {
    vy -= 1;
    if (vx === 0){
      this.player.anims.play("Norte F", true)
    } else if (vx < 0) {
      this.player.anims.play("NorO F", true)
    } else if (vx > 0) {
      this.player.anims.play("NorE F", true)
    }
  };
  if (this.cursors.down.isDown) {
    vy += 1;
    if (vx === 0) {
      this.player.anims.play("Sur F", true)
    } else if (vx < 0) {
      this.player.anims.play("SurO F", true)
    } else if (vx > 0) {
      this.player.anims.play("SurE F", true)
    }
  };

  if (vx !== 0 && vy !== 0) {
    vx *= Math.SQRT1_2;
    vy *= Math.SQRT1_2;
  }

  if (vx === 0 && vy === 0) {
    this.player.anims.play("Idle F", true)
  }

  this.player.setVelocityX(vx * speed);
  this.player.setVelocityY(vy * speed);

  this.trailTimer = (this.trailTimer || 0) + 1;
  if (this.trailTimer % Math.round(speed / 40) === 0) { // Cambia 4 por la frecuencia deseada
    const trail = this.add.image(this.player.x, this.player.y, "manzana")
      .setAlpha(0.5)
      .setDepth(-2); // Detrás del jugador
    trail.lifetime = 20; // Frames que dura la estela
    this.trailGroup.add(trail);
  }

  // Actualiza y desvanece las estelas
  this.trailGroup.getChildren().forEach(trail => {
    trail.lifetime--;
    trail.setAlpha(trail.alpha - 0.035);
    if (trail.lifetime <= 0 || trail.alpha <= 0) {
      trail.destroy();
      this.trailGroup.remove(trail, true, true);
    }
  });


  const SEGMENT_SPACING = Math.round(this.speedEnemigo / 12);

  const dx = this.enemigo.x - this.lastHeadPos.x;
  const dy = this.enemigo.y - this.lastHeadPos.y;
  this.bodyDistance += Math.sqrt(dx * dx + dy * dy);
    
if (this.bodyDistance >= SEGMENT_SPACING || this.bodyPos.length === 0) {
  this.bodyPos.unshift({ x: this.enemigo.x, y: this.enemigo.y });
  this.lastHeadPos = { x: this.enemigo.x, y: this.enemigo.y };
  this.bodyDistance = 0;
}

  // Limita el historial al largo del cuerpo + 1
  if (this.bodyPos.length > this.enemigoBody.length + 1) {
    this.bodyPos.pop();
  }

  // --- MOVER LOS SEGMENTOS ---
  for (let i = 0; i < this.enemigoBody.length; i++) {
    const pos = this.bodyPos[i + 1];
    if (pos) {
      this.enemigoBody[i].x = pos.x;
      this.enemigoBody[i].y = pos.y;
    }
  }

  while (this.bodyPos.length > this.enemigoBody.length + 1) {
    this.bodyPos.pop();
  }

  if (
    this.start === true &&
    (!this.enemyPath || this.enemyPathStep >= this.enemyPath.length) &&
    (
    this.enemigo.body.blocked.left || this.enemigo.body.blocked.right ||
    this.enemigo.body.blocked.up || this.enemigo.body.blocked.down ||
    (this.enemigo.body.velocity.x === 0 && this.enemigo.body.velocity.y === 0)
    )
  ) {
    // Elige aleatoriamente izquierda o derecha
    const giro = Math.random() < 0.5 ? 'left' : 'right';
    this.enemyDir = giro === 'left' ? turnLeft(this.enemyDir) : turnRight(this.enemyDir);

    // Fuerza recálculo del path en el próximo frame
    this.enemyPathStep = this.enemyPath ? this.enemyPath.length : 0;
  }

  // --- ENEMIGO PATHFINDING OPTIMIZADO ---
  if (this.start === true) {
  

  const cellSizeX = 16;
  const cellSizeY = 9;
  const enemySpeed = this.speedEnemigo;

  const playerCell = {
    x: Math.floor(this.player.x / cellSizeX) * cellSizeX,
    y: Math.floor(this.player.y / cellSizeY) * cellSizeY
  };
  const enemyCell = {
  x: Math.floor(this.enemigo.x / cellSizeX),
  y: Math.floor(this.enemigo.y / cellSizeY)
  };

  let needPath = false;
  if (!this.enemyPath || this.enemyPathStep >= this.enemyPath.length) {
    needPath = true;
  }
  if (playerCell.x !== this.lastPlayerCell.x || playerCell.y !== this.lastPlayerCell.y) {
    needPath = true;
  }

  if (needPath) {

    const cellSizeX = 16;
    const cellSizeY = 9;
  
    const start = {
      x: Math.floor(this.enemigo.x / cellSizeX) * cellSizeX,
      y: Math.floor(this.enemigo.y / cellSizeY) * cellSizeY
    };
  
    const minX = 17;
    const maxX = 304 - cellSizeX; // 288 si cellSizeX=16
    const minY = 19;
    const maxY = 160 - cellSizeY; // 151 si cellSizeY=9

    const clampToGrid = (val, min, max, size) => {
      let clamped = Math.max(min, Math.min(max, val));
      clamped = min + Math.floor((clamped - min) / size) * size;
      return clamped;
    };

    const goal = {
      x: clampToGrid(this.player.x, minX, maxX, cellSizeX),
      y: clampToGrid(this.player.y, minY, maxY, cellSizeY)
    };

    const newPath = snakePathfinding(start, goal, this.enemyDir, this.bordes, cellSizeX, cellSizeY, this.enemigoBody);
    if (newPath) {
      this.enemyPath = newPath;
      this.enemyPathStep = 0;
      this.lastPlayerCell = { ...playerCell };
      this.enemyMoving = false;
      this.enemyTargetCell = null;
    } else {
      this.enemyPath = null;
      this.enemyPathStep = 0;
      this.lastPlayerCell = { ...playerCell };
      this.enemyMoving = false;
      this.enemyTargetCell = null;
    }
  }

  if (this.start === true && this.enemyPath && this.enemyPathStep < this.enemyPath.length) {
    let processAll = this.enemigo.body.blocked.left || this.enemigo.body.blocked.right ||
                      this.enemigo.body.blocked.up || this.enemigo.body.blocked.down;

    if (!this.enemyMoving) {
      const enemyCell = {
        x: Math.floor(this.enemigo.x / cellSizeX),
        y: Math.floor(this.enemigo.y / cellSizeY)
      };

      let keepProcessing = true;
      while (keepProcessing) {
        while (
          this.enemyPathStep < this.enemyPath.length &&
          (this.enemyPath[this.enemyPathStep] === 'left' || this.enemyPath[this.enemyPathStep] === 'right')
        ) {
          let action = this.enemyPath[this.enemyPathStep];
          if (action === 'left') this.enemyDir = turnLeft(this.enemyDir);
          else if (action === 'right') this.enemyDir = turnRight(this.enemyDir);
          this.enemyPathStep++;
        }

        if (
          this.enemyPathStep < this.enemyPath.length &&
          this.enemyPath[this.enemyPathStep] === 'forward'
        ) {
          let nextCell = { ...enemyCell };
          if (this.enemyDir === 'up') nextCell.y -= 1;
          if (this.enemyDir === 'down') nextCell.y += 1;
          if (this.enemyDir === 'left') nextCell.x -= 1;
          if (this.enemyDir === 'right') nextCell.x += 1;

          let nextX = nextCell.x * cellSizeX + cellSizeX / 2;
          let nextY = nextCell.y * cellSizeY + cellSizeY / 2;


          if (!isBlocked(nextX - cellSizeX / 2, nextY - cellSizeY / 2, this.bordes, cellSizeX, cellSizeY)) {
            this.enemyTargetCell = { x: nextX, y: nextY };
            this.enemyMoving = true;
            this.enemyPathStep++;
            keepProcessing = false;
          } else {
            this.enemyPathStep = this.enemyPath.length;
            keepProcessing = false;
          }
        } else {
          keepProcessing = false;
        }

      if (!processAll) break;
    }
  }

  if (this.enemyMoving && this.enemyTargetCell) {
    const dx = this.enemyTargetCell.x - this.enemigo.x;
    const dy = this.enemyTargetCell.y - this.enemigo.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 2) {
      this.enemigo.x = this.enemyTargetCell.x;
      this.enemigo.y = this.enemyTargetCell.y;
      this.enemyMoving = false;
      this.enemyTargetCell = null;
      this.enemigo.setVelocity(0, 0);
    } else {
      const angle = Math.atan2(dy, dx);
      this.enemigo.setVelocity(Math.cos(angle) * enemySpeed, Math.sin(angle) * enemySpeed);
    }
  } else {
    this.enemigo.setVelocity(0, 0);
  }

  if (this.enemyDir === 'up') this.enemigo.setAngle(-90);
  else if (this.enemyDir === 'down') this.enemigo.setAngle(90);
  else if (this.enemyDir === 'left') this.enemigo.setAngle(180);
  else if (this.enemyDir === 'right') this.enemigo.setAngle(0);
}}



  // --- GAME OVER ---
  if (this.muerte === true) {
    this.scene.start("muerte", { score: this.score, tiempo: this.tiempo});
    this.scene.stop("arena");
    this.coin = null;
  }
}

}