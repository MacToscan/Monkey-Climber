// ================== IMPORTS ==================
import './style.css'
import Phaser from 'phaser'

// ================== ESCENA 1: MENÚ PRINCIPAL ==================
class MainMenu extends Phaser.Scene {
  constructor() { super({ key: 'MainMenu' }); }

  create() {
      this.bg = this.add.rectangle(0, 0, 0, 0, 0x1b1b1b);
      
      const totalBananas = localStorage.getItem('monkey_bananas') || 0;
      const highScore = localStorage.getItem('monkey_highscore') || 0;

      this.titleText = this.add.text(0, 0, 'MONKEY\nCLIMBER', { 
          fontSize: '45px', fill: '#ffd700', fontStyle: 'bold', align: 'center' 
      }).setOrigin(0.5);

      this.bestScoreText = this.add.text(0, 0, `Best: ${highScore}m`, { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
      this.bananasText = this.add.text(0, 0, `Total Bananas: ${totalBananas} 🍌`, { fontSize: '24px', fill: '#ffff00' }).setOrigin(0.5);

      this.playBtn = this.add.rectangle(0, 0, 260, 60, 0x2d9bf0).setInteractive();
      this.playText = this.add.text(0, 0, 'PLAY GAME', { fontSize: '28px', fill: '#fff' }).setOrigin(0.5).setInteractive();

      const startGame = () => this.scene.start('GameScene');
      this.playBtn.on('pointerover', () => this.playBtn.setFillStyle(0x1a7bc0));
      this.playBtn.on('pointerout', () => this.playBtn.setFillStyle(0x2d9bf0));
      this.playBtn.on('pointerdown', startGame);
      this.playText.on('pointerdown', startGame);

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

// ================== ESCENA JUEGO ==================
class GameScene extends Phaser.Scene {
  constructor() { super({ key: 'GameScene' }) }

  preload() {
    this.load.spritesheet('troncosSheet', '/troncos_final.png', { frameWidth: 256, frameHeight: 256 });
    this.load.spritesheet('monkey', '/monkey_climb_strip.png', { frameWidth: 34, frameHeight: 34 });
    this.load.spritesheet('monkeyBro', '/monkey-bro.png', { frameWidth: 34, frameHeight: 34 });
    this.load.spritesheet('oruga', '/oruga_strip2.png', { frameWidth: 40, frameHeight: 40 });
    this.load.spritesheet('arana', '/arana.png', { frameWidth: 64, frameHeight: 64 });
    
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

    // SPAWN
    this.spawnAccumulator = 0;
    this.nextSpawnDistance = 400; 

    this.narrowOffset = 25; 

    this.cameras.main.setBackgroundColor('#2d9bf0'); 
    this.time.addEvent({ delay: 3000, loop: true, callback: () => this.spawnBroItem() });
    this.currentLeaderSkin = 'monkey';

    this.webGraphics = this.add.graphics();
    this.webGraphics.setDepth(4); 

    // -------- ANIMACIONES --------
    if (!this.anims.exists('climb')) {
        this.anims.create({ key: 'climb', frames: this.anims.generateFrameNumbers('monkey', { start: 0, end: 4 }), frameRate: 10, repeat: -1 })
    }
    if (!this.anims.exists('climbBro')) {
      this.anims.create({ key: 'climbBro', frames: this.anims.generateFrameNumbers('monkeyBro', { start: 0, end: 4 }), frameRate: 10, repeat: -1 })
    }
    if (!this.anims.exists('crawl')) {
      this.anims.create({ key: 'crawl', frames: this.anims.generateFrameNumbers('oruga', { start: 0, end: 1 }), frameRate: 4, repeat: -1 });
    }

    // --- TRONCOS ---
    this.troncoGroup = this.add.group();
    this.overlapAmount = 1; 
    this.calcDimensions(width);
    
    for(let i = 0; i < 5; i++) {
        let yPos = (height * 0.5) + (height * 0.2) - (i * (this.trunkHeight - this.overlapAmount));
        yPos = Math.round(yPos);
        let frameIndex = (i === 0) ? 7 : (i === 1) ? 6 : (i === 2) ? 5 : Phaser.Math.Between(0, 4);
        const tronco = this.add.sprite(centerX, yPos, 'troncosSheet', frameIndex);
        tronco.setScale(this.currentScale); 
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
    this.exitBtn = this.add.text(width - 30, 50, 'X', { fontSize: '24px', fill: '#ff4444' }).setOrigin(1, 0).setDepth(101).setInteractive();
    this.exitBtn.on('pointerdown', () => this.scene.start('MainMenu'));

    // -------- GRUPOS --------
    this.obstacles = this.physics.add.group(); 
    this.spiders = this.physics.add.group();   
    this.bananas = this.physics.add.group();
    this.chilis = this.physics.add.group();
    this.rocks = this.physics.add.group();
    this.broCollectibles = this.physics.add.group();

    // -------- COLISIONES --------
    this.physics.add.overlap(this.player, this.obstacles, () => this.hit());
    this.physics.add.overlap(this.player, this.spiders, () => this.hit()); 
    this.physics.add.overlap(this.player, this.rocks, (player, rock) => { rock.destroy(); this.hit(); });
    this.physics.add.overlap(this.player, this.bananas, this.collectBanana, null, this);
    this.physics.add.overlap(this.player, this.chilis, this.collectChili, null, this);
    this.physics.add.overlap(this.player, this.broCollectibles, this.rescueBro, null, this);

    this.time.addEvent({ delay: 1500, loop: true, callback: () => this.spawnBanana() })
    this.time.addEvent({ delay: 30000, loop: true, callback: () => this.spawnChili() })

    this.scale.on('resize', this.resize, this);
  }

  calcDimensions(width) {
      const minTreeWidth = 384; 
      const targetTreeWidth = Math.max(minTreeWidth, width * 0.65);
      let newScale = Math.round(targetTreeWidth / 256 * 2) / 2;
      this.currentScale = newScale;
      this.trunkHeight = Math.floor(256 * newScale);
      this.currentTreeVisualWidth = 256 * newScale;
  }

  resize(gameSize) {
    const width = gameSize.width;
    const height = gameSize.height;
    this.calcDimensions(width);
    if (this.troncoGroup && this.troncoGroup.getLength() > 0) {
        this.troncoGroup.children.iterate((tronco) => {
            tronco.setScale(this.currentScale);
            tronco.x = width * 0.5;
        });
        this.realignTrunks();
    }
    if (this.hudBar) {
        this.hudBar.setPosition(width * 0.5, 30);
        this.hudBar.setSize(width, 60);
        this.levelText.x = width * 0.5;
        this.bananaText.x = width - 60;
        this.exitBtn.x = width - 30; 
    }
    if (this.player) this.player.y = height * 0.75;
  }

  realignTrunks() {
      const sortedTroncos = this.troncoGroup.getChildren().sort((a, b) => b.y - a.y); 
      for (let i = 1; i < sortedTroncos.length; i++) {
          const abajo = sortedTroncos[i - 1];
          const actual = sortedTroncos[i];
          actual.y = abajo.y - this.trunkHeight + this.overlapAmount;
      }
  }

  update(_, delta) {
    if (this.isGameOver) return

    const width = this.scale.width;
    const centerX = width * 0.5;

    this.monkeySprite.anims.timeScale = this.gameSpeed / 300;
    if (this.hasBro && this.broObject) this.broObject.anims.timeScale = this.gameSpeed / 300; 
    
    this.broCollectibles.children.iterate(ball => { if (ball && ball.y > this.scale.height + 100) ball.destroy(); });

    const move = this.gameSpeed * (delta / 1000);
    this.troncoGroup.children.iterate((tronco) => { tronco.y += move; });
    this.realignTrunks();

    // === SPAWN POR DISTANCIA (AJUSTADO) ===
    this.spawnAccumulator += move; 
    if (this.spawnAccumulator >= this.nextSpawnDistance) {
        // AJUSTE DE PROBABILIDAD: Empieza en 15%, sube 3% por nivel, MAX 35%
        const chanceSpider = Math.min(35, this.level * 3 + 15); 
        
        if (Phaser.Math.Between(0, 100) < chanceSpider) {
             this.spawnSpider();
        } else {
             this.spawnOruga();
        }
        this.spawnAccumulator = 0;
        this.nextSpawnDistance = Phaser.Math.Between(400, 700);
    }

    // Reciclaje Troncos
    this.troncoGroup.children.iterate((tronco) => {
        if (tronco.y > this.scale.height + (this.trunkHeight/2) + 200) {
            let highestY = 99999;
            let highestTronco = null;
            this.troncoGroup.children.iterate(t => { if (t.y < highestY) { highestY = t.y; highestTronco = t; } });
            tronco.y = highestY - this.trunkHeight + this.overlapAmount;
            const prevIndex = highestTronco.frame.name; 
            const nextIndex = this.getNextChunk(parseInt(prevIndex));
            tronco.setFrame(nextIndex);
        }
    });

    // IA Orugas
    this.obstacles.children.iterate((oruga) => {
        if (oruga) {
            oruga.x += oruga.getData('speedX');
            const startX = oruga.getData('startX');
            const patrolRange = oruga.getData('patrolRange'); 
            const dist = oruga.x - startX;
            if ((oruga.getData('speedX') > 0 && dist > patrolRange) || (oruga.getData('speedX') < 0 && dist < -patrolRange)) {
                oruga.setData('speedX', -oruga.getData('speedX'));
                oruga.setFlipX(!oruga.flipX);
            }
            if (oruga.y > this.scale.height + 100) oruga.destroy();
        }
    });

    // === LÓGICA DE ARAÑAS E HILOS ===
    this.webGraphics.clear(); 
    this.webGraphics.lineStyle(2, 0xffffff, 0.8); 

    this.spiders.children.iterate((spider) => {
        if (spider) {
            // Mover anclaje
            const currentAnchorY = spider.getData('anchorY') + move;
            spider.setData('anchorY', currentAnchorY);

            let yoyoOffset = spider.getData('yoyoOffset');
            let yoyoSpeed = spider.getData('yoyoSpeed');
            const yoyoState = spider.getData('yoyoState'); 

            // --- MÁQUINA DE ESTADOS ---
            
            // ESTADO 0: OCULTO/IDLE
            if (yoyoState === 0) {
                if (spider.y > 50) {
                    spider.setData('yoyoState', 1); // AMENAZA
                    spider.setData('warningTimer', 0);
                }
            }
            
            // ESTADO 1: AMENAZA (Aviso)
            else if (yoyoState === 1) {
                let timer = spider.getData('warningTimer');
                timer += delta;
                spider.setData('warningTimer', timer);

                if (Math.floor(timer / 150) % 2 === 0) spider.setFrame(0);
                else spider.setFrame(1);

                if (timer > 800) { // Tras 0.8s, ATACA
                    spider.setData('yoyoState', 2);
                    spider.setData('yoyoSpeed', 12); 
                    spider.setFrame(2); 
                }
            }

            // ESTADO 2: ATAQUE (Caída)
            else if (yoyoState === 2) {
                yoyoOffset += yoyoSpeed;
                // === CAMBIO AQUÍ: Tela más corta (220px en vez de 350px) ===
                if (yoyoOffset >= 150) {
                    spider.setData('yoyoState', 3); // RETORNO
                    spider.setData('yoyoSpeed', -3); 
                    spider.setFrame(0); 
                }
            }

            // ESTADO 3: RETORNO
            else if (yoyoState === 3) {
                yoyoOffset += yoyoSpeed;
                if (yoyoOffset <= 0) {
                    yoyoOffset = 0;
                    spider.setData('yoyoState', 0); // Reset
                }
            }

            spider.setData('yoyoOffset', yoyoOffset);
            spider.y = currentAnchorY + yoyoOffset; 

            // Dibujar hilo
            this.webGraphics.beginPath();
            this.webGraphics.moveTo(spider.x, currentAnchorY);
            this.webGraphics.lineTo(spider.x, spider.y - 10);
            this.webGraphics.strokePath();

            if (currentAnchorY > this.scale.height + 100) spider.destroy();
        }
    });

    // LÍMITES JUGADOR
    let activeTrunk = null;
    this.troncoGroup.children.iterate((t) => { if (Math.abs(t.y - this.player.y) < this.trunkHeight / 2) activeTrunk = t; });
    const halfTree = this.currentTreeVisualWidth / 2;
    let safeMin = centerX - halfTree + 20; 
    let safeMax = centerX + halfTree - 20;

    if (activeTrunk) {
        const frame = parseInt(activeTrunk.frame.name);
        if ([9, 10, 11, 12, 13].includes(frame)) safeMin += (this.narrowOffset * this.currentScale);
        else if (frame === 8) {
             const dy = (this.player.y - activeTrunk.y) / this.currentScale;
             if (dy > -88 && dy < 76) { 
                const narrowSide = 15 * this.currentScale;
                safeMin += narrowSide; safeMax -= narrowSide;
             }
        }
    }

    if (this.input.activePointer.isDown) this.player.x = this.input.activePointer.x;
    if (this.player.x < safeMin || this.player.x > safeMax) this.triggerGameOver('FELL!');

    this.scoreFloat += this.gameSpeed * 0.005;
    this.score = Math.floor(this.scoreFloat);
    this.scoreText.setText(this.score + 'm');
    if (this.score >= this.nextLevelScore) this.levelUp();

    this.obstacles.setVelocityY(this.gameSpeed);
    this.spiders.setVelocityY(0); 
    this.bananas.setVelocityY(this.gameSpeed);
    this.chilis.setVelocityY(this.gameSpeed);
    this.rocks.setVelocityY(this.gameSpeed + 250);
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
    if (prevIndex === 7) return 6;
    if (prevIndex === 6) return 5;
    if (prevIndex === 5) return Phaser.Math.RND.pick([0, 1, 2, 3, 4]); 
    if (prevIndex === 9) return Phaser.Math.RND.pick([0, 1, 2, 3, 4]);
    if (prevIndex === 13) return Phaser.Math.RND.pick([10, 11, 12]);
    if ([10, 11, 12].includes(prevIndex)) {
        const chanceExit = this.level > 10 ? 15 : 40; 
        if (Phaser.Math.Between(1, 100) < chanceExit) return 9;
        return Phaser.Math.RND.pick([10, 11, 12]);
    }
    if ([0, 1, 2, 3, 4, 8].includes(prevIndex)) {
        const rand = Phaser.Math.Between(1, 100);
        if (this.level < 5) {
            if (rand < 20) return 7; 
            if (rand < 30) return 8; 
            return Phaser.Math.RND.pick([0, 1, 2, 3, 4]);
        }
        const chanceTunnel = this.level > 10 ? 40 : 20;
        if (rand < chanceTunnel) return 13; 
        if (rand < chanceTunnel + 20) return 7; 
        if (rand < chanceTunnel + 30) return 8; 
        return Phaser.Math.RND.pick([0, 1, 2, 3, 4]);
    }
    return 0;
  }

  getSpawnX() {
    const centerX = this.scale.width * 0.5;
    const playableWidth = this.currentTreeVisualWidth - 80;
    return centerX + Phaser.Math.Between(-playableWidth/2, playableWidth/2);
  }

  spawnOruga() {
    const centerX = this.scale.width * 0.5;
    let targetTrunk = null; let minDist = 99999;
    this.troncoGroup.children.iterate(t => { const dist = Math.abs(t.y - (-50)); if (dist < minDist) { minDist = dist; targetTrunk = t; } });
    if (!targetTrunk) return;
    const frame = parseInt(targetTrunk.frame.name);
    const treeWidth = this.currentTreeVisualWidth;
    let leftEdge = centerX - (treeWidth/2); let rightEdge = centerX + (treeWidth/2);
    if ([9,10,11,12,13].includes(frame)) leftEdge += (30 * this.currentScale);
    else if (frame === 8) { leftEdge += (15 * this.currentScale); rightEdge -= (15 * this.currentScale); }
    const safetyMargin = 60; const spawnMin = leftEdge + safetyMargin; const spawnMax = rightEdge - safetyMargin;
    if (spawnMax <= spawnMin) return;
    const spawnX = Phaser.Math.Between(spawnMin, spawnMax);
    
    const oruga = this.add.sprite(spawnX, -50, 'oruga').setScale(1.5);
    this.physics.add.existing(oruga); oruga.setDepth(5); oruga.play('crawl');
    oruga.body.setSize(25, 20); oruga.body.setOffset(7, 10);
    oruga.setData('startX', spawnX); oruga.setData('patrolRange', 40); oruga.setData('speedX', Phaser.Math.RND.pick([1, -1])); oruga.setFlipX(oruga.getData('speedX') < 0);
    this.obstacles.add(oruga);
  }

  spawnSpider() {
    const centerX = this.scale.width * 0.5;
    const playableWidth = this.currentTreeVisualWidth - 60;
    const spawnX = centerX + Phaser.Math.Between(-playableWidth/2, playableWidth/2);
    
    // Spawn arriba
    const startY = -100;

    const spider = this.add.sprite(spawnX, startY, 'arana', 0).setScale(1.2); 
    this.physics.add.existing(spider);
    spider.setDepth(5);
    spider.body.setSize(40, 40);
    spider.body.setOffset(12, 12);

    spider.setData('anchorY', startY); 
    spider.setData('yoyoOffset', 0);   
    spider.setData('yoyoState', 0);    
    spider.setData('yoyoSpeed', 0);
    spider.setData('warningTimer', 0);

    this.spiders.add(spider);
  }

  spawnBanana() { const b = this.add.text(this.getSpawnX(), -50, '🍌', { fontSize: '30px' }).setOrigin(0.5); this.physics.add.existing(b); b.body.setCircle(15); b.setDepth(5); this.bananas.add(b); }
  spawnChili() { const c = this.add.text(this.getSpawnX(), -50, '🌶️', { fontSize: '35px' }).setOrigin(0.5); this.physics.add.existing(c); c.body.setCircle(15); c.setDepth(5); this.chilis.add(c); }
  spawnRock() { const r = this.add.circle(this.getSpawnX(), -50, 12, 0x8d8885); this.physics.add.existing(r); r.setDepth(5); this.rocks.add(r); }
  spawnBroItem() { if (!this.hasBro && this.broCollectibles.getLength() === 0) { const s = (this.currentLeaderSkin === 'monkey') ? 'monkeyBro' : 'monkey'; const f = (s === 'monkeyBro') ? 'figureBro' : 'figureClimber'; const m = this.add.sprite(this.getSpawnX(), -50, f).setScale(2.0); this.physics.add.existing(m); m.setDepth(5); m.setData('skin', s); this.broCollectibles.add(m); m.body.setVelocityY(this.gameSpeed); } }
  collectBanana(_, b) { b.destroy(); this.sessionBananas++; this.totalBananas++; this.bananaText.setText('🍌 ' + this.sessionBananas); localStorage.setItem('monkey_bananas', this.totalBananas); }
  collectChili(_, c) { c.destroy(); if (this.isTurbo) return; this.isTurbo = true; this.gameSpeed += 400; this.monkeySprite.setTint(0xff4500); this.time.delayedCall(6000, () => { this.gameSpeed -= 400; this.monkeySprite.clearTint(); this.isTurbo = false; }); }
  rescueBro(_, b) { const s = b.getData('skin'); b.destroy(); if (this.hasBro) return; this.hasBro = true; this.broObject = this.add.sprite(this.player.x, this.player.y + 100, s).setScale(2.0); this.broObject.setDepth(9); const a = (s === 'monkeyBro') ? 'climbBro' : 'climb'; this.broObject.play(a); }
  levelUp() { this.level++; this.nextLevelScore += 2000; this.levelText.setText('Lv ' + this.level); this.gameSpeed += 40; const t = this.add.text(this.scale.width*0.5, this.scale.height*0.5, `LEVEL ${this.level}`, { fontSize: '60px', fill: '#fff', stroke: '#000', strokeThickness: 6 }).setOrigin(0.5).setDepth(200); this.time.delayedCall(500, () => t.destroy()); if (this.level === 2 && !this.rocksActivated) { this.rocksActivated = true; this.time.addEvent({ delay: 2000, loop: true, callback: () => this.spawnRock() }); } if (this.level >= 3 && !this.hasBro) this.spawnBroItem(); }
  
  hit() {
    if (this.isInvulnerable) return;
    if (this.hasBro && this.broObject) {
      this.hasBro = false; this.cameras.main.flash(300, 255, 255, 255);
      this.currentLeaderSkin = this.broObject.texture.key; this.monkeySprite.setTexture(this.currentLeaderSkin);
      const a = (this.currentLeaderSkin === 'monkeyBro') ? 'climbBro' : 'climb'; this.monkeySprite.play(a);
      this.player.x = this.broObject.x; this.player.y = this.broObject.y;
      this.broObject.destroy(); this.broObject = null;
      this.isInvulnerable = true; this.player.setAlpha(0.5);
      this.tweens.add({ targets: this.player, y: this.scale.height * 0.75, duration: 300, ease: 'Power2' });
      this.time.delayedCall(1500, () => { this.isInvulnerable = false; this.player.setAlpha(1); });
      return; 
    }
    this.triggerGameOver('GAME OVER!');
  }

  triggerGameOver(text) {
    if (this.isGameOver) return;
    this.isGameOver = true; this.physics.pause(); this.monkeySprite.stop();
    this.obstacles.children.iterate(o => { if(o && o.anims) o.stop() });
    const best = parseInt(localStorage.getItem('monkey_highscore') || 0);
    if (this.score > best) localStorage.setItem('monkey_highscore', this.score);
    localStorage.setItem('monkey_bananas', this.totalBananas);
    const w = this.scale.width; const h = this.scale.height; const cx = w*0.5; const cy = h*0.5;
    const ov = this.add.rectangle(cx, cy, w, h, 0x000000); ov.setAlpha(0.8).setDepth(999);
    this.add.text(cx, cy - 100, text, { fontSize: '45px', fill: '#ff4444', fontStyle: 'bold', stroke: '#000', strokeThickness: 6 }).setOrigin(0.5).setDepth(1000);
    this.add.text(cx, cy - 20, `Score: ${this.score}m`, { fontSize: '28px', fill: '#ffffff' }).setOrigin(0.5).setDepth(1000);
    this.add.text(cx, cy + 20, `Bananas: ${this.sessionBananas} 🍌`, { fontSize: '28px', fill: '#ffff00' }).setOrigin(0.5).setDepth(1000);
    const rb = this.add.rectangle(cx, cy + 100, 260, 50, 0x2d9bf0).setInteractive().setDepth(1000);
    const rt = this.add.text(cx, cy + 100, 'TAP TO REPLAY', { fontSize: '24px', fill: '#fff', fontStyle: 'bold' }).setOrigin(0.5).setInteractive().setDepth(1001);
    const rf = () => this.scene.restart(); rb.on('pointerdown', rf); rt.on('pointerdown', rf);
    const mb = this.add.rectangle(cx, cy + 170, 260, 50, 0xff8c00).setInteractive().setDepth(1000);
    const mt = this.add.text(cx, cy + 170, 'MAIN MENU', { fontSize: '24px', fill: '#fff', fontStyle: 'bold' }).setOrigin(0.5).setInteractive().setDepth(1001);
    const mf = () => this.scene.start('MainMenu'); mb.on('pointerdown', mf); mt.on('pointerdown', mf);
  }
}

// ================== CONFIG ==================
const config = {
  type: Phaser.AUTO, width: '100%', height: '100%', 
  backgroundColor: '#2d9bf0', pixelArt: true, roundPixels: true,
  scale: { mode: Phaser.Scale.RESIZE, autoCenter: Phaser.Scale.CENTER_BOTH },
  physics: { default: 'arcade', arcade: { gravity: { y: 0 }, debug: false } },
  scene: [MainMenu, GameScene]
};
new Phaser.Game(config);