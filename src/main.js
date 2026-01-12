// ================== IMPORTS ==================
import './style.css'
import Phaser from 'phaser'

// --- ESCENA 1: MENÚ PRINCIPAL ---
class MainMenu extends Phaser.Scene {
  constructor() {
      super({ key: 'MainMenu' });
  }

  create() {
    // Al inicio de create() o al reiniciar:
      this.add.rectangle(400, 300, 800, 600, 0x1b1b1b);
      const totalBananas = localStorage.getItem('monkey_bananas') || 0;
      const highScore = localStorage.getItem('monkey_highscore') || 0;

      this.add.text(400, 150, 'MONKEY CLIMBER', { fontSize: '60px', fill: '#ffd700', fontStyle: 'bold' }).setOrigin(0.5);
      this.add.text(400, 230, `Best Score: ${highScore}m`, { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
      this.add.text(400, 270, `Total Bananas: ${totalBananas} 🍌`, { fontSize: '24px', fill: '#ffff00' }).setOrigin(0.5);

      const playBtn = this.add.rectangle(400, 400, 300, 60, 0x2d9bf0).setInteractive();
      this.add.text(400, 400, 'PLAY GAME', { fontSize: '30px', fill: '#fff' }).setOrigin(0.5);

      playBtn.on('pointerover', () => playBtn.setFillStyle(0x1a7bc0));
      playBtn.on('pointerout', () => playBtn.setFillStyle(0x2d9bf0));
      playBtn.on('pointerdown', () => this.scene.start('GameScene'));

      this.add.text(400, 480, 'SHOP (Coming Soon)', { fontSize: '24px', fill: '#888' }).setOrigin(0.5);
  }
}

// ================== ESCENA JUEGO ==================
class GameScene extends Phaser.Scene {
  constructor() { super({ key: 'GameScene' }) }

  preload() {
    this.load.spritesheet('monkey', '/monkey_climb_strip.png',
      { frameWidth: 34, frameHeight: 34 })
    this.load.spritesheet('monkeyBro', '/monkey-bro.png', 
      { frameWidth: 34, frameHeight: 34 });
    this.load.image('figureClimber', '/monkeyclimber-figure.png');
    this.load.image('figureBro', '/monkeybro-figure.png');
      
  }

  create() {
    // -------- ESTADO --------
    // Al inicio de create() o al reiniciar:
    this.isGameOver = false
    this.score = 0
    this.scoreFloat = 0
    this.level = 0
    // CAMBIO APLICADO: Empezamos buscando el score 2000 para el nivel 1
    this.nextLevelScore = 2000 
    this.gameSpeed = 300
    this.isTurbo = false
    this.hasBro = false
    this.broObject = null
    this.isInvulnerable = false
    this.rocksActivated = false

    this.totalBananas = parseInt(localStorage.getItem('monkey_bananas') || 0)
    this.sessionBananas = 0

    this.targetTreeWidth = 750
    this.currentGenWidth = 750
    this.sliceHeight = 20
    this.sliceOverlap = 4
    this.numSlices = 35
    this.totalTreeHeight = this.numSlices * this.sliceHeight

    this.cameras.main.setBackgroundColor('#2d9bf0')
    // Añade esto al final de create()
    this.time.addEvent({ delay: 3000, loop: true, callback: () => this.spawnBroItem() });

    // En el create(), busca donde inicializas el estado:
    this.currentLeaderSkin = 'monkey';

    // -------- ANIM --------
    if (!this.anims.exists('climb')) {
        this.anims.create({
            key: 'climb',
            frames: this.anims.generateFrameNumbers('monkey', { start: 0, end: 4 }),
            frameRate: 10,
            repeat: -1
        })
    }

    if (!this.anims.exists('climbBro')) {
      this.anims.create({
          key: 'climbBro',
          frames: this.anims.generateFrameNumbers('monkeyBro', { start: 0, end: 4 }),
          frameRate: 10,
          repeat: -1
      })
  }

    this.generateTextures()

    // --- 2. GENERACIÓN DEL ÁRBOL ---
    this.treeGroup = this.add.group();
    let startY = 600;
    for (let i = 0; i < this.numSlices; i++) {
        const y = startY - (i * this.sliceHeight);
        let slice = this.add.tileSprite(400, y, 750, this.sliceHeight + this.sliceOverlap, 'retroTreeHD');
        slice.setOrigin(0.5, 0); 
        slice.tileScaleX = 1; slice.tileScaleY = 1;
        slice.setData('logicalY', y);
        this.treeGroup.add(slice);
    }

    // -------- PLAYER --------
    this.monkeySprite = this.add.sprite(0, 0, 'monkey').setScale(3)
    this.monkeySprite.play('climb')

    this.player = this.add.container(400, 450, [this.monkeySprite])
    this.physics.add.existing(this.player)
    this.player.body.setSize(40, 50)
    this.player.body.setOffset(-20, -25)
    this.player.setDepth(10)

    this.currentSafeMin = 25
    this.currentSafeMax = 775

    // -------- GRUPOS --------
    this.obstacles = this.physics.add.group()
    this.bananas = this.physics.add.group()
    this.chilis = this.physics.add.group()
    this.rocks = this.physics.add.group()
    this.cloudGroup = this.physics.add.group()
    this.branchSideGroup = this.physics.add.group()
    this.broCollectibles = this.physics.add.group()

    // -------- HUD --------
    this.add.rectangle(400, 30, 800, 60, 0x000000).setAlpha(0.6).setDepth(100)
    this.scoreText = this.add.text(20, 15, 'Score: 0', { fontSize: '28px', fill: '#fff' }).setDepth(101)
    this.levelText = this.add.text(400, 15, 'Level: 0',
      { fontSize: '28px', fill: '#00ff00' }).setOrigin(0.5).setDepth(101)
    this.bananaText = this.add.text(760, 15, '🍌 0',
      { fontSize: '28px', fill: '#ff0' }).setOrigin(1, 0).setDepth(101)

    const exitBtn = this.add.text(790, 15, 'X',
      { fontSize: '26px', fill: '#ff4444' }).setOrigin(1, 0).setDepth(101).setInteractive()
    exitBtn.on('pointerdown', () => this.scene.start('MainMenu'))

    // -------- COLISIONES --------
    this.physics.add.overlap(this.player, this.obstacles, () => this.hit())
    // Busca esto en create() y cámbialo:
    this.physics.add.overlap(this.player, this.rocks, (player, rock) => {
      rock.destroy(); // La roca desaparece al golpearte
    this.hit();     // Activamos la lógica de vida extra
    }, null, this);
    this.physics.add.overlap(this.player, this.bananas, this.collectBanana, null, this)
    this.physics.add.overlap(this.player, this.chilis, this.collectChili, null, this)
    this.physics.add.overlap(this.player, this.broCollectibles, this.rescueBro, null, this)

    // -------- TIMERS ESTABLES --------
    this.time.addEvent({ delay: 700, loop: true, callback: () => this.spawnObstacle() })
    this.time.addEvent({ delay: 1500, loop: true, callback: () => this.spawnBanana() })
    this.time.addEvent({ delay: 30000, loop: true, callback: () => this.spawnChili() })
    this.time.addEvent({ delay: 4000, loop: true, callback: () => {
      this.targetTreeWidth = Phaser.Math.Between(350, 780)
    }})
    this.time.addEvent({ delay: 3000, loop: true, callback: () => this.spawnCloud() })
    this.time.addEvent({ delay: 1800, loop: true, callback: () => this.spawnSideBranch() })
  }

  update(_, delta) {
    if (this.isGameOver) return

    this.monkeySprite.anims.timeScale = this.gameSpeed / 300;
    if (this.hasBro && this.broObject) {
    this.broObject.anims.timeScale = this.gameSpeed / 300;} 
    this.monkeySprite.anims.timeScale = this.gameSpeed / 300
    this.currentGenWidth = Phaser.Math.Linear(this.currentGenWidth, this.targetTreeWidth, 0.02)

    // Dentro de update()
    this.broCollectibles.children.iterate(ball => {
      if (ball && ball.y > 650) { // Si la pelotita cae por debajo de la pantalla
        ball.destroy();
        }
      });

    const move = this.gameSpeed * (delta / 1000)

    this.treeGroup.children.iterate(slice => {
      let y = slice.getData('logicalY') + move
      if (y > 620) {
        y -= this.totalTreeHeight
        slice.width = this.currentGenWidth
      }
      slice.setData('logicalY', y)
      slice.y = y

      if (Math.abs(y - 520) < this.sliceHeight) {
        this.currentSafeMin = 400 - slice.width / 2
        this.currentSafeMax = 400 + slice.width / 2
      }
    })

    if (this.input.activePointer.isDown) {
      this.player.x = this.input.activePointer.x
    }

    if (this.player.x < this.currentSafeMin ||
        this.player.x > this.currentSafeMax) {
      this.triggerGameOver('FELL!')
    }

    this.scoreFloat += this.gameSpeed * 0.005
    this.score = Math.floor(this.scoreFloat)
    this.scoreText.setText('Score: ' + this.score)

    if (this.score >= this.nextLevelScore) this.levelUp()

    this.obstacles.setVelocityY(this.gameSpeed)
    this.bananas.setVelocityY(this.gameSpeed)
    this.chilis.setVelocityY(this.gameSpeed)
    this.rocks.setVelocityY(this.gameSpeed + 250)
    this.branchSideGroup.setVelocityY(this.gameSpeed)
    this.cloudGroup.setVelocityY(this.gameSpeed * 0.5)
    // Dentro de update() busca donde están las otras velocidades:
    this.broCollectibles.setVelocityY(this.gameSpeed);
    // Si ya hemos rescatado al Bro, que nos siga
    if (this.hasBro && this.broObject) {
      const targetX = this.player.x;
      const targetY = this.player.y + 100; // 120px de separación
  
      this.broObject.x += (targetX - this.broObject.x) * 0.1;
      this.broObject.y += (targetY - this.broObject.y) * 0.1;
      
      this.broObject.anims.timeScale = this.gameSpeed / 300;
    }
  }

  // --- GENERACIÓN DE TEXTURAS ---
    generateTextures() {
        const trunkBaseColor = 0x5d4037;
        const trunkDarkColor = 0x3e2723;
        const leafColor = 0x228b22;
        const leafDarkColor = 0x006400;

        if (!this.textures.exists('retroTreeHD')) {
            const texSize = 512;
            const g = this.make.graphics();
            g.fillStyle(trunkBaseColor); g.fillRect(0, 0, texSize, texSize);
            g.fillStyle(trunkDarkColor);
            for(let i=0; i<40; i++) g.fillRect(Phaser.Math.Between(0, texSize), 0, Phaser.Math.Between(4, 12), texSize);
            g.fillStyle(0x795548);
            for(let i=0; i<20; i++) g.fillRect(Phaser.Math.Between(0, texSize), 0, Phaser.Math.Between(2, 6), texSize);
            g.generateTexture('retroTreeHD', texSize, texSize); g.destroy();
        }

        // --- Ramas ---
        if (!this.textures.exists('branchStandard')) {
            const g = this.make.graphics();
            g.fillStyle(trunkDarkColor); g.fillRect(0, 12, 60, 14); 
            g.fillStyle(leafDarkColor); g.fillCircle(60, 19, 12); g.fillStyle(leafColor); g.fillCircle(55, 12, 10); g.fillCircle(65, 15, 10); 
            g.generateTexture('branchStandard', 80, 40); g.destroy();
        }
        if (!this.textures.exists('branchLong')) {
            const g = this.make.graphics();
            g.fillStyle(trunkDarkColor); g.fillRect(0, 10, 100, 10);
            g.fillStyle(leafColor); g.fillCircle(100, 15, 12); g.fillCircle(90, 10, 9); g.fillCircle(95, 20, 9);
            g.generateTexture('branchLong', 120, 35); g.destroy();
        }
        if (!this.textures.exists('branchFork')) {
            const g = this.make.graphics();
            g.fillStyle(trunkDarkColor); g.fillRect(0, 15, 50, 18); g.fillRect(45, 8, 30, 10); g.fillRect(45, 28, 25, 10); 
            g.fillStyle(leafColor); g.fillCircle(75, 13, 12); g.fillCircle(70, 33, 10);
            g.generateTexture('branchFork', 90, 50); g.destroy();
        }
        if (!this.textures.exists('branchThick')) {
            const g = this.make.graphics();
            g.fillStyle(trunkBaseColor); g.fillPoints([{x:0, y:10}, {x:80, y:25}, {x:80, y:35}, {x:0, y:50}], true);
            g.fillStyle(trunkDarkColor); g.fillRect(0, 40, 80, 5); g.fillStyle(leafDarkColor); g.fillCircle(80, 30, 25);
            g.fillStyle(leafColor); g.fillCircle(70, 20, 20); g.fillCircle(90, 25, 20); g.fillCircle(80, 40, 15);
            g.generateTexture('branchThick', 110, 60); g.destroy();
        }
        if (!this.textures.exists('branchStump')) {
            const g = this.make.graphics();
            g.fillStyle(trunkBaseColor); g.fillPoints([{x:0, y:5}, {x:40, y:15}, {x:35, y:35}, {x:0, y:45}], true);
            g.fillStyle(trunkDarkColor); g.fillCircle(40, 15, 5); g.fillCircle(35, 35, 5); g.fillCircle(38, 25, 7);
            g.generateTexture('branchStump', 50, 50); g.destroy();
        }

        // Nube
        if (!this.textures.exists('retroCloud')) {
            const g = this.make.graphics();
            g.fillStyle(0xffffff, 0.8); 
            g.fillCircle(20, 20, 20); g.fillCircle(45, 25, 25); g.fillCircle(75, 20, 20); g.fillCircle(50, 10, 15);
            g.generateTexture('retroCloud', 100, 50); g.destroy();
        }
    }


  // -------- LEVEL --------
  levelUp() {
    this.level++
    // CAMBIO APLICADO: El siguiente nivel requiere otros 2000 puntos más
    this.nextLevelScore += 2000 
    this.levelText.setText('Level: ' + this.level)
    this.gameSpeed += 40

    const txt = this.add.text(400, 300, `LEVEL ${this.level}`,
      { fontSize: '80px', fill: '#fff', stroke: '#000', strokeThickness: 6 })
      .setOrigin(0.5).setDepth(200)

    this.time.delayedCall(500, () => txt.destroy())

    if (this.level === 2 && !this.rocksActivated) {
      this.rocksActivated = true
      this.time.addEvent({ delay: 2000, loop: true, callback: () => this.spawnRock() })
    }

    if (this.level >= 3 && !this.hasBro) this.spawnBroItem()
  }

  // -------- SPAWNS --------
  spawnObstacle() {
    const x = Phaser.Math.Between(this.currentSafeMin + 20, this.currentSafeMax - 80)
    const w = Phaser.Math.Between(80, 200)
    const o = this.add.rectangle(x, -50, w, 20, 0x00ff00)
    this.physics.add.existing(o)
    this.obstacles.add(o)
  }

  spawnBanana() {
    const x = Phaser.Math.Between(this.currentSafeMin + 30, this.currentSafeMax - 30)
    const b = this.add.text(x, -50, '🍌', { fontSize: '40px' }).setOrigin(0.5)
    this.physics.add.existing(b)
    b.body.setCircle(20)
    this.bananas.add(b)
  }

  spawnChili() {
    const x = Phaser.Math.Between(this.currentSafeMin + 30, this.currentSafeMax - 30)
    const c = this.add.text(x, -50, '🌶️', { fontSize: '45px' }).setOrigin(0.5)
    this.physics.add.existing(c)
    c.body.setCircle(20)
    this.chilis.add(c)
  }

  spawnRock() {
    const x = Phaser.Math.Between(this.currentSafeMin + 30, this.currentSafeMax - 30)
    const r = this.add.circle(x, -50, 15, 0x8b4513)
    this.physics.add.existing(r)
    this.rocks.add(r)
  }

  spawnCloud() {
    const x = Phaser.Math.Between(50, 750)
    const cloud = this.add.image(x, -100, 'retroCloud')
    this.physics.add.existing(cloud)
    this.cloudGroup.add(cloud)
    cloud.setDepth(-5)
  }

  spawnSideBranch() {
    if (this.currentGenWidth > 550) return
    const side = Phaser.Math.Between(0, 1)
    const x = side === 0
      ? 400 - this.currentGenWidth / 2
      : 400 + this.currentGenWidth / 2
    const b = this.add.image(x, -50, 'branchStandard')
    this.physics.add.existing(b)
    this.branchSideGroup.add(b)
    b.setDepth(-1)
    b.setFlipX(side === 0)
  }

  spawnBroItem() {
    if (!this.hasBro && this.broCollectibles.getLength() === 0) {
      const margin = 40;
      const treeLeftEdge = 400 - (this.currentGenWidth / 2) + margin;
      const treeRightEdge = 400 + (this.currentGenWidth / 2) - margin;
      const x = Phaser.Math.Between(treeLeftEdge, treeRightEdge);
      
      // Decidimos qué figura rescatar basándonos en el líder actual
      const skinToRescue = (this.currentLeaderSkin === 'monkey') ? 'monkeyBro' : 'monkey';
      
      // Elegimos la imagen del mono sentado correspondiente
      const figureKey = (skinToRescue === 'monkeyBro') ? 'figureBro' : 'figureClimber';

      // Creamos el sprite del mono sentado esperando
      const sittingMonkey = this.add.sprite(x, -50, figureKey).setScale(2.5); // Ajusta escala si es pequeño
      this.physics.add.existing(sittingMonkey);
      
      // Guardamos la skin real (la de trepar) para cuando lo rescatemos
      sittingMonkey.setData('skin', skinToRescue);
      
      this.broCollectibles.add(sittingMonkey);
      sittingMonkey.body.setVelocityY(this.gameSpeed);
    }
  }

  // -------- LOGICA --------
  collectBanana(_, banana) {
    banana.destroy()
    this.sessionBananas++
    this.totalBananas++
    this.bananaText.setText('🍌 ' + this.sessionBananas)
    localStorage.setItem('monkey_bananas', this.totalBananas)
  }

  collectChili(_, chili) {
    chili.destroy()
    if (this.isTurbo) return
    this.isTurbo = true
    this.gameSpeed += 400
    this.monkeySprite.setTint(0xff4500)
    this.time.delayedCall(6000, () => {
      this.gameSpeed -= 400
      this.monkeySprite.clearTint()
      this.isTurbo = false
    })
  }

  rescueBro(_, ball) {
    const skinToApply = ball.getData('skin'); // Leemos la skin que guardamos
    ball.destroy();
    
    if (this.hasBro) return;
    this.hasBro = true;
  
    this.broObject = this.add.sprite(this.player.x, this.player.y + 100, skinToApply).setScale(3);
    this.broObject.setDepth(9);
    
    // Reproducimos la animación correspondiente (climb o climbBro)
    const animKey = (skinToApply === 'monkeyBro') ? 'climbBro' : 'climb';
    this.broObject.play(animKey); 
  }

  hit() {
    // Si acabamos de chocar y estamos parpadeando (invulnerables), no nos pasa nada
    if (this.isInvulnerable) return;

    if (this.hasBro && this.broObject) {
      this.hasBro = false;
      this.cameras.main.flash(300, 255, 255, 255);

      // --- CAMBIO DE SKIN AL LÍDER ---
      this.currentLeaderSkin = this.broObject.texture.key; 
      this.monkeySprite.setTexture(this.currentLeaderSkin); 
      
      const animKey = (this.currentLeaderSkin === 'monkeyBro') ? 'climbBro' : 'climb';
      this.monkeySprite.play(animKey);

      // --- RELEVO DE POSICIÓN ---
      this.player.x = this.broObject.x;
      this.player.y = this.broObject.y;

      this.broObject.destroy();
      this.broObject = null;

      // --- ACTIVAR ESCUDO TEMPORAL ---
      this.isInvulnerable = true;
      this.player.setAlpha(0.5);

      // Subimos al nuevo líder suavemente a la posición principal
      this.tweens.add({
          targets: this.player,
          y: 450, // Tu posición estándar de líder
          duration: 300,
          ease: 'Power2'
      });

      // Quitamos la invulnerabilidad tras 1.5 segundos
      this.time.delayedCall(1500, () => {
        this.isInvulnerable = false;
        this.player.setAlpha(1);
      });

      return; // El juego continúa
    }

    // Si no hay Bro y no somos invulnerables... Game Over
    this.triggerGameOver('GAME OVER!');
  }

  triggerGameOver(text) {
    if (this.isGameOver) return
    this.isGameOver = true
    this.physics.pause()
    this.monkeySprite.stop() // Detener animación del mono

    const best = parseInt(localStorage.getItem('monkey_highscore') || 0)
    if (this.score > best) localStorage.setItem('monkey_highscore', this.score)
    // Asegurar guardado de bananas
    localStorage.setItem('monkey_bananas', this.totalBananas)

    // --- CAPA OSCURA DE FONDO ---
    const overlay = this.add.rectangle(400, 300, 800, 600, 0x000000)
    overlay.setAlpha(0.8)
    overlay.setDepth(999)

    // --- TEXTO PRINCIPAL ---
    this.add.text(400, 180, text, {
        fontSize: '64px', fill: '#ff4444', fontStyle: 'bold', stroke: '#000', strokeThickness: 6
    }).setOrigin(0.5).setDepth(1000)

    // --- ESTADÍSTICAS ---
    this.add.text(400, 260, `Score: ${this.score}m`, {
        fontSize: '32px', fill: '#ffffff'
    }).setOrigin(0.5).setDepth(1000)

    this.add.text(400, 300, `Bananas: ${this.sessionBananas} 🍌`, {
        fontSize: '32px', fill: '#ffff00'
    }).setOrigin(0.5).setDepth(1000)

    // --- BOTÓN: TAP TO REPLAY ---
    const replayBtn = this.add.rectangle(400, 400, 300, 60, 0x2d9bf0).setInteractive().setDepth(1000)
    const replayText = this.add.text(400, 400, 'TAP TO REPLAY', { fontSize: '28px', fill: '#fff', fontStyle: 'bold' }).setOrigin(0.5).setDepth(1001)

    replayBtn.on('pointerover', () => replayBtn.setFillStyle(0x1a7bc0))
    replayBtn.on('pointerout', () => replayBtn.setFillStyle(0x2d9bf0))
    replayBtn.on('pointerdown', () => this.scene.restart())

    // --- BOTÓN: MAIN MENU ---
    const menuBtn = this.add.rectangle(400, 480, 300, 60, 0xff8c00).setInteractive().setDepth(1000)
    const menuText = this.add.text(400, 480, 'MAIN MENU', { fontSize: '28px', fill: '#fff', fontStyle: 'bold' }).setOrigin(0.5).setDepth(1001)

    menuBtn.on('pointerover', () => menuBtn.setFillStyle(0xe07b00))
    menuBtn.on('pointerout', () => menuBtn.setFillStyle(0xff8c00))
    menuBtn.on('pointerdown', () => this.scene.start('MainMenu'))
  }
}

// ================== CONFIG ==================
new Phaser.Game({
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: { default: 'arcade', arcade: { gravity: { y: 0 } } },
  scene: [MainMenu, GameScene]
})