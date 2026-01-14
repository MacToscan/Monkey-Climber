// ================== IMPORTS ==================
import './style.css'
import Phaser from 'phaser'

// ================== ESCENA 1: MENÚ PRINCIPAL ==================
class MainMenu extends Phaser.Scene {
  constructor() { super({ key: 'MainMenu' }); }

  create() {
      // Elementos del menú
      this.bg = this.add.rectangle(0, 0, 0, 0, 0x1b1b1b);
      
      const totalBananas = localStorage.getItem('monkey_bananas') || 0;
      const highScore = localStorage.getItem('monkey_highscore') || 0;

      this.titleText = this.add.text(0, 0, 'MONKEY\nCLIMBER', { 
          fontSize: '45px', fill: '#ffd700', fontStyle: 'bold', align: 'center' 
      }).setOrigin(0.5);

      this.bestScoreText = this.add.text(0, 0, `Best: ${highScore}m`, { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
      this.bananasText = this.add.text(0, 0, `Total Bananas: ${totalBananas} 🍌`, { fontSize: '24px', fill: '#ffff00' }).setOrigin(0.5);

      this.playBtn = this.add.rectangle(0, 0, 260, 60, 0x2d9bf0).setInteractive();
      this.playText = this.add.text(0, 0, 'PLAY GAME', { fontSize: '28px', fill: '#fff' }).setOrigin(0.5);

      this.playBtn.on('pointerover', () => this.playBtn.setFillStyle(0x1a7bc0));
      this.playBtn.on('pointerout', () => this.playBtn.setFillStyle(0x2d9bf0));
      this.playBtn.on('pointerdown', () => this.scene.start('GameScene'));

      this.shopText = this.add.text(0, 0, 'SHOP (Coming Soon)', { fontSize: '20px', fill: '#888' }).setOrigin(0.5);

      this.resize(this.scale.gameSize);
      this.scale.on('resize', this.resize, this);
  }

  resize(gameSize) {
      const width = gameSize.width;
      const height = gameSize.height;
      const centerX = width * 0.5;
      
      this.bg.setPosition(centerX, height * 0.5);
      this.bg.setSize(width, height);

      this.titleText.setPosition(centerX, height * 0.20);
      this.bestScoreText.setPosition(centerX, height * 0.35);
      this.bananasText.setPosition(centerX, height * 0.40);
      this.playBtn.setPosition(centerX, height * 0.60);
      this.playText.setPosition(centerX, height * 0.60);
      this.shopText.setPosition(centerX, height * 0.85);
  }
}

// ================== ESCENA JUEGO (SOLUCIÓN DEFINITIVA IPHONE) ==================
class GameScene extends Phaser.Scene {
  constructor() { super({ key: 'GameScene' }) }

  preload() {
    this.load.spritesheet('troncosSheet', '/troncos.png', { frameWidth: 256, frameHeight: 256 });
    this.load.spritesheet('monkey', '/monkey_climb_strip.png', { frameWidth: 34, frameHeight: 34 });
    this.load.spritesheet('monkeyBro', '/monkey-bro.png', { frameWidth: 34, frameHeight: 34 });
    this.load.image('figureClimber', '/monkeyclimber-figure.png');
    this.load.image('figureBro', '/monkeybro-figure.png');
  }

  create() {
    const width = this.scale.width;
    const height = this.scale.height;
    const centerX = width * 0.5;

    // -------- ESTADO --------
    this.isGameOver = false
    this.score = 0
    this.scoreFloat = 0
    this.level = 0
    this.nextLevelScore = 2000 
    this.gameSpeed = 300
    this.isTurbo = false
    this.hasBro = false
    this.broObject = null
    this.isInvulnerable = false
    this.rocksActivated = false
    this.totalBananas = parseInt(localStorage.getItem('monkey_bananas') || 0)
    this.sessionBananas = 0

    this.cameras.main.setBackgroundColor('#2d9bf0')
    this.time.addEvent({ delay: 3000, loop: true, callback: () => this.spawnBroItem() });
    this.currentLeaderSkin = 'monkey';

    // -------- ANIMACIONES --------
    if (!this.anims.exists('climb')) {
        this.anims.create({ key: 'climb', frames: this.anims.generateFrameNumbers('monkey', { start: 0, end: 4 }), frameRate: 10, repeat: -1 })
    }
    if (!this.anims.exists('climbBro')) {
      this.anims.create({ key: 'climbBro', frames: this.anims.generateFrameNumbers('monkeyBro', { start: 0, end: 4 }), frameRate: 10, repeat: -1 })
    }

    // --- TRUCO PROFESIONAL: COLUMNA VERTEBRAL INVISIBLE (COLOR CIELO) ---
    // Creamos un rectángulo azul cielo detrás del árbol.
    // Si se abre una grieta, se verá azul sobre azul = invisible.
    this.treeBacking = this.add.rectangle(centerX, height/2, 100, height + 200, 0x2d9bf0);
    this.treeBacking.setDepth(0); // Al fondo del todo

    // --- TRONCOS DINÁMICOS ---
    this.troncoGroup = this.add.group();
    
    // SOLAPAMIENTO EXTREMO: 10 píxeles para asegurar en iPhone
    this.overlapAmount = 10; 
    this.trunkHeight = Math.ceil(256 * 1.5); 
    
    // Creamos 5 bloques
    for(let i = 0; i < 5; i++) {
        // Cálculo de posición inicial con solapamiento de 10px
        let yPos = (height * 0.5) + (height * 0.2) - (i * (this.trunkHeight - this.overlapAmount));
        yPos = Math.floor(yPos);

        let frameIndex = 0;
        // 5 -> 4 -> 3 -> Normal
        if (i === 0) frameIndex = 4; 
        else if (i === 1) frameIndex = 3; 
        else if (i === 2) frameIndex = 2; 
        else frameIndex = Phaser.Math.Between(0, 1); 

        const tronco = this.add.sprite(centerX, yPos, 'troncosSheet', frameIndex);
        tronco.setScale(1.5);
        tronco.setDepth(1); 
        this.troncoGroup.add(tronco);
    }

    // -------- JUGADOR --------
    this.monkeySprite = this.add.sprite(0, 0, 'monkey').setScale(2.0)
    this.monkeySprite.play('climb')

    this.player = this.add.container(centerX, height * 0.75, [this.monkeySprite])
    this.physics.add.existing(this.player)
    this.player.body.setSize(30, 45)
    this.player.body.setOffset(-15, -22)
    this.player.setDepth(10)

    // -------- HUD --------
    this.hudBar = this.add.rectangle(centerX, 30, width, 60, 0x000000).setAlpha(0.6).setDepth(100)
    this.scoreText = this.add.text(20, 15, '0m', { fontSize: '24px', fill: '#fff' }).setDepth(101)
    this.levelText = this.add.text(centerX, 15, 'Lv 0', { fontSize: '24px', fill: '#00ff00' }).setOrigin(0.5).setDepth(101)
    this.bananaText = this.add.text(width - 60, 15, '🍌 0', { fontSize: '24px', fill: '#ff0' }).setOrigin(1, 0).setDepth(101)
    
    this.exitBtn = this.add.text(width - 30, 50, 'X', { fontSize: '24px', fill: '#ff4444' }).setOrigin(1, 0).setDepth(101).setInteractive()
    this.exitBtn.on('pointerdown', () => this.scene.start('MainMenu'))

    // -------- GRUPOS --------
    this.obstacles = this.physics.add.group()
    this.bananas = this.physics.add.group()
    this.chilis = this.physics.add.group()
    this.rocks = this.physics.add.group()
    this.broCollectibles = this.physics.add.group()

    // -------- COLISIONES --------
    this.physics.add.overlap(this.player, this.obstacles, () => this.hit())
    this.physics.add.overlap(this.player, this.rocks, (player, rock) => { rock.destroy(); this.hit(); }, null, this);
    this.physics.add.overlap(this.player, this.bananas, this.collectBanana, null, this)
    this.physics.add.overlap(this.player, this.chilis, this.collectChili, null, this)
    this.physics.add.overlap(this.player, this.broCollectibles, this.rescueBro, null, this)

    // -------- TIMERS --------
    this.time.addEvent({ delay: 700, loop: true, callback: () => this.spawnObstacle() })
    this.time.addEvent({ delay: 1500, loop: true, callback: () => this.spawnBanana() })
    this.time.addEvent({ delay: 30000, loop: true, callback: () => this.spawnChili() })

    // LLAMADA FINAL A RESIZE
    this.resize(this.scale.gameSize);
    this.scale.on('resize', this.resize, this);
  }

  resize(gameSize) {
    const width = gameSize.width;
    const height = gameSize.height;
    
    // 1. Escala Ideal
    const minTreeWidth = 384; 
    const targetTreeWidth = Math.max(minTreeWidth, width * 0.65);
    let newScale = targetTreeWidth / 256;
    
    // 2. Altura visual (entera)
    this.trunkHeight = Math.floor(256 * newScale);
    this.currentTreeVisualWidth = 256 * newScale;

    // 3. ACTUALIZAR "COLUMNA VERTEBRAL" AZUL
    if (this.treeBacking) {
        this.treeBacking.setPosition(width * 0.5, height * 0.5);
        // Hacemos que el parche azul sea un poco más estrecho que el árbol para que no asome por los lados
        this.treeBacking.setSize(this.currentTreeVisualWidth - 5, height + 200); 
    }

    // 4. REPARAR POSICIONES
    if (this.troncoGroup && this.troncoGroup.getLength() > 0) {
        
        this.troncoGroup.children.iterate((tronco) => {
            tronco.setScale(newScale);
            tronco.x = width * 0.5;
        });

        const sortedTroncos = this.troncoGroup.getChildren().sort((a, b) => b.y - a.y);

        for (let i = 1; i < sortedTroncos.length; i++) {
            const troncoAbajo = sortedTroncos[i - 1];
            const troncoActual = sortedTroncos[i];
            
            // Usamos el overlap extremo de 10px
            troncoActual.y = troncoAbajo.y - this.trunkHeight + this.overlapAmount;
        }
    }

    // HUD y Player
    if (this.hudBar) {
        this.hudBar.setPosition(width * 0.5, 30);
        this.hudBar.setSize(width, 60);
        this.levelText.x = width * 0.5;
        this.bananaText.x = width - 60;
        this.exitBtn.x = width - 30; 
    }
    
    if (this.player) this.player.y = height * 0.75;
  }

  update(_, delta) {
    if (this.isGameOver) return

    const width = this.scale.width;
    const centerX = width * 0.5;

    this.monkeySprite.anims.timeScale = this.gameSpeed / 300;
    if (this.hasBro && this.broObject) this.broObject.anims.timeScale = this.gameSpeed / 300; 
    
    this.broCollectibles.children.iterate(ball => {
      if (ball && ball.y > this.scale.height + 100) ball.destroy();
    });

    // --- MOVIMIENTO DE TRONCOS ---
    const move = this.gameSpeed * (delta / 1000);
    
    this.troncoGroup.children.iterate((tronco) => {
        tronco.y += move; 

        // SI SALE POR ABAJO... RECICLAR ARRIBA
        if (tronco.y > this.scale.height + (this.trunkHeight / 2) + 150) {
            
            let highestTronco = null;
            let minY = 99999;
            
            this.troncoGroup.children.iterate((t) => {
                if (t.y < minY) {
                    minY = t.y;
                    highestTronco = t;
                }
            });
            
            // POSICIONAMIENTO CON SOLAPAMIENTO EXTREMO (+10px)
            let newY = minY - this.trunkHeight + this.overlapAmount;
            tronco.y = Math.floor(newY); 
            
            const prevIndex = highestTronco.frame.name; 
            const nextIndex = this.getNextChunk(parseInt(prevIndex));
            tronco.setFrame(nextIndex);
        }
    });

    // --- LÍMITES DINÁMICOS ---
    const halfTree = this.currentTreeVisualWidth / 2;
    this.currentSafeMin = centerX - halfTree + 20;  
    this.currentSafeMax = centerX + halfTree - 20;

    if (this.input.activePointer.isDown) {
      this.player.x = this.input.activePointer.x
    }

    if (this.player.x < this.currentSafeMin || this.player.x > this.currentSafeMax) {
      this.triggerGameOver('FELL!')
    }

    this.scoreFloat += this.gameSpeed * 0.005
    this.score = Math.floor(this.scoreFloat)
    this.scoreText.setText(this.score + 'm')

    if (this.score >= this.nextLevelScore) this.levelUp()

    this.obstacles.setVelocityY(this.gameSpeed)
    this.bananas.setVelocityY(this.gameSpeed)
    this.chilis.setVelocityY(this.gameSpeed)
    this.rocks.setVelocityY(this.gameSpeed + 250)
    this.broCollectibles.setVelocityY(this.gameSpeed);

    if (this.hasBro && this.broObject) {
      const targetX = this.player.x;
      const targetY = this.player.y + 80; 
      this.broObject.x += (targetX - this.broObject.x) * 0.1;
      this.broObject.y += (targetY - this.broObject.y) * 0.1;
      this.broObject.anims.timeScale = this.gameSpeed / 300;
    }
  }

  getNextChunk(prevIndex) {
    if (prevIndex === 4) return 3; 
    if (prevIndex === 3) return 2; 
    if (prevIndex === 2 || prevIndex === 0 || prevIndex === 1) {
        const saleMusgo = Phaser.Math.Between(1, 100) <= 25;
        if (saleMusgo) return 4; 
        else return Phaser.Math.Between(0, 1);
    }
    return 0; 
  }

  getSpawnX() {
    const centerX = this.scale.width * 0.5;
    const playableWidth = this.currentTreeVisualWidth - 80;
    const halfPlayable = playableWidth / 2;
    return centerX + Phaser.Math.Between(-halfPlayable, halfPlayable);
  }

  spawnObstacle() {
    const x = this.getSpawnX();
    const w = Phaser.Math.Between(60, 150)
    const o = this.add.rectangle(x, -50, w, 20, 0x00ff00)
    this.physics.add.existing(o); o.setDepth(5); 
    this.obstacles.add(o)
  }

  spawnBanana() {
    const b = this.add.text(this.getSpawnX(), -50, '🍌', { fontSize: '30px' }).setOrigin(0.5)
    this.physics.add.existing(b); b.body.setCircle(15); b.setDepth(5);
    this.bananas.add(b)
  }

  spawnChili() {
    const c = this.add.text(this.getSpawnX(), -50, '🌶️', { fontSize: '35px' }).setOrigin(0.5)
    this.physics.add.existing(c); c.body.setCircle(15); c.setDepth(5);
    this.chilis.add(c)
  }

  spawnRock() {
    const r = this.add.circle(this.getSpawnX(), -50, 12, 0x8d8885)
    this.physics.add.existing(r); r.setDepth(5); 
    this.rocks.add(r)
  }

  spawnBroItem() {
    if (!this.hasBro && this.broCollectibles.getLength() === 0) {
      const skinToRescue = (this.currentLeaderSkin === 'monkey') ? 'monkeyBro' : 'monkey';
      const figureKey = (skinToRescue === 'monkeyBro') ? 'figureBro' : 'figureClimber';
      const sittingMonkey = this.add.sprite(this.getSpawnX(), -50, figureKey).setScale(2.0); 
      this.physics.add.existing(sittingMonkey);
      sittingMonkey.setDepth(5);
      sittingMonkey.setData('skin', skinToRescue);
      this.broCollectibles.add(sittingMonkey);
      sittingMonkey.body.setVelocityY(this.gameSpeed);
    }
  }

  collectBanana(_, banana) {
    banana.destroy(); this.sessionBananas++; this.totalBananas++;
    this.bananaText.setText('🍌 ' + this.sessionBananas); localStorage.setItem('monkey_bananas', this.totalBananas)
  }

  collectChili(_, chili) {
    chili.destroy(); if (this.isTurbo) return;
    this.isTurbo = true; this.gameSpeed += 400; this.monkeySprite.setTint(0xff4500);
    this.time.delayedCall(6000, () => { this.gameSpeed -= 400; this.monkeySprite.clearTint(); this.isTurbo = false })
  }

  rescueBro(_, ball) {
    const skinToApply = ball.getData('skin'); ball.destroy();
    if (this.hasBro) return;
    this.hasBro = true;
    this.broObject = this.add.sprite(this.player.x, this.player.y + 100, skinToApply).setScale(2.0);
    this.broObject.setDepth(9);
    const animKey = (skinToApply === 'monkeyBro') ? 'climbBro' : 'climb';
    this.broObject.play(animKey); 
  }

  levelUp() {
    this.level++
    this.nextLevelScore += 2000 
    this.levelText.setText('Lv ' + this.level)
    this.gameSpeed += 40
    
    const centerX = this.scale.width * 0.5;
    const centerY = this.scale.height * 0.5;

    const txt = this.add.text(centerX, centerY, `LEVEL ${this.level}`,
      { fontSize: '60px', fill: '#fff', stroke: '#000', strokeThickness: 6 })
      .setOrigin(0.5).setDepth(200)

    this.time.delayedCall(500, () => txt.destroy())

    if (this.level === 2 && !this.rocksActivated) {
      this.rocksActivated = true
      this.time.addEvent({ delay: 2000, loop: true, callback: () => this.spawnRock() })
    }
    if (this.level >= 3 && !this.hasBro) this.spawnBroItem()
  }

  hit() {
    if (this.isInvulnerable) return;
    if (this.hasBro && this.broObject) {
      this.hasBro = false;
      this.cameras.main.flash(300, 255, 255, 255);
      this.currentLeaderSkin = this.broObject.texture.key; 
      this.monkeySprite.setTexture(this.currentLeaderSkin); 
      const animKey = (this.currentLeaderSkin === 'monkeyBro') ? 'climbBro' : 'climb';
      this.monkeySprite.play(animKey);
      this.player.x = this.broObject.x;
      this.player.y = this.broObject.y;
      this.broObject.destroy();
      this.broObject = null;
      this.isInvulnerable = true;
      this.player.setAlpha(0.5);
      this.tweens.add({ targets: this.player, y: this.scale.height * 0.75, duration: 300, ease: 'Power2' });
      this.time.delayedCall(1500, () => { this.isInvulnerable = false; this.player.setAlpha(1); });
      return; 
    }
    this.triggerGameOver('GAME OVER!');
  }

  triggerGameOver(text) {
    if (this.isGameOver) return
    this.isGameOver = true
    this.physics.pause()
    this.monkeySprite.stop()

    const best = parseInt(localStorage.getItem('monkey_highscore') || 0)
    if (this.score > best) localStorage.setItem('monkey_highscore', this.score)
    localStorage.setItem('monkey_bananas', this.totalBananas)

    const width = this.scale.width;
    const height = this.scale.height;
    const centerX = width * 0.5;
    const centerY = height * 0.5;

    const overlay = this.add.rectangle(centerX, centerY, width, height, 0x000000)
    overlay.setAlpha(0.8).setDepth(999)

    this.add.text(centerX, centerY - 100, text, { fontSize: '45px', fill: '#ff4444', fontStyle: 'bold', stroke: '#000', strokeThickness: 6 }).setOrigin(0.5).setDepth(1000)
    this.add.text(centerX, centerY - 20, `Score: ${this.score}m`, { fontSize: '28px', fill: '#ffffff' }).setOrigin(0.5).setDepth(1000)
    this.add.text(centerX, centerY + 20, `Bananas: ${this.sessionBananas} 🍌`, { fontSize: '28px', fill: '#ffff00' }).setOrigin(0.5).setDepth(1000)

    const replayBtn = this.add.rectangle(centerX, centerY + 100, 260, 50, 0x2d9bf0).setInteractive().setDepth(1000)
    this.add.text(centerX, centerY + 100, 'TAP TO REPLAY', { fontSize: '24px', fill: '#fff', fontStyle: 'bold' }).setOrigin(0.5).setDepth(1001)
    replayBtn.on('pointerdown', () => this.scene.restart())

    const menuBtn = this.add.rectangle(centerX, centerY + 170, 260, 50, 0xff8c00).setInteractive().setDepth(1000)
    this.add.text(centerX, centerY + 170, 'MAIN MENU', { fontSize: '24px', fill: '#fff', fontStyle: 'bold' }).setOrigin(0.5).setDepth(1001)
    menuBtn.on('pointerdown', () => this.scene.start('MainMenu'))
  }
}

// ================== CONFIG (FINAL) ==================
const config = {
  type: Phaser.AUTO,
  width: '100%',  
  height: '100%', 
  backgroundColor: '#2d9bf0', // El mismo azul cielo
  pixelArt: true, 
  roundPixels: true,
  scale: {
    mode: Phaser.Scale.RESIZE, 
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: { default: 'arcade', arcade: { gravity: { y: 0 }, debug: false } },
  scene: [MainMenu, GameScene]
};

new Phaser.Game(config);