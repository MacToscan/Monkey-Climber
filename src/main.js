// ================== IMPORTS ==================
import './style.css'
import Phaser from 'phaser'
import { StatusBar } from '@capacitor/status-bar';               
import { KeepAwake } from '@capacitor-community/keep-awake';
// ================== CONFIGURACIÓN DE SKINS ==================
const SKINS = [
    // --- FAMILIA: PRINCIPALES ---
    { id: 'monkey', name: 'Monklimb', family: 'Monkeys', price: 0, shopImg: 'figureClimber', scaleShop: 2.5 },
    { id: 'monkeyBro', name: 'Climbro', family: 'Monkeys', price: 0, shopImg: 'figureBro', scaleShop: 2.5 },
  
    // --- FAMILIA: THE SIMPSBRON (Ganchos baratos para empezar) ---
    { id: 'bromer', name: 'Bromer', family: 'The Simpsbron', price: 1, shopImg: 'figureBromer', scaleShop: 2.5 },
    { id: 'brusty', name: 'Brusty', family: 'The Simpsbron', price: 3, shopImg: 'figureBrusty', scaleShop: 2.5 },
    { id: 'bort', name: 'Bort', family: 'The Simpsbron', price: 4, shopImg: 'figureBort', scaleShop: 2.3 }, // El meme caro
    { id: 'brolhouse', name: 'Brolhouse', family: 'The Simpsbron', price: 5, shopImg: 'figureBrolhouse', scaleShop: 2.3 },
    { id: 'sb_soon2', name: '???', family: 'The Simpsbron', shopImg: 'figureUnknown', scaleShop: 3.5, comingSoon: true },
    { id: 'sb_soon3', name: '???', family: 'The Simpsbron', shopImg: 'figureUnknown', scaleShop: 3.5, comingSoon: true },
  
    // --- FAMILIA: MARBREL (Nivel Medio) ---
    { id: 'spiderbro', name: 'Spider-Bro', family: 'Marbrel', price: 1, shopImg: 'figureSpiderBro', scaleShop: 2.8 },
    { id: 'brolverine', name: 'Brolverine', family: 'Marbrel', price: 3, shopImg: 'figureBrolverine', scaleShop: 2.8 },
    { id: 'deadbrool', name: 'Deadbrool', family: 'Marbrel', price: 4, shopImg: 'figureDeadbrool', scaleShop: 2.8 },
    { id: 'brhulk', name: 'Brulk', family: 'Marbrel', price: 6, shopImg: 'figureBrhulk', scaleShop: 2.8 }, // Gigante = Más caro
    { id: 'mb_soon2', name: '???', family: 'Marbrel', shopImg: 'figureUnknown', scaleShop: 3.5, comingSoon: true },
    { id: 'mb_soon3', name: '???', family: 'Marbrel', shopImg: 'figureUnknown', scaleShop: 3.5, comingSoon: true },
  
    // --- FAMILIA: DRAGON BROLL (Los más deseados) ---
    { id: 'broku', name: 'Broku', family: 'Dragon Broll', price: 2, shopImg: 'figureBroku', scaleShop: 2.5 },
    { id: 'broccolo', name: 'Broccolo', family: 'Dragon Broll', price: 4, shopImg: 'figureBroccolo', scaleShop: 2.8 },
    { id: 'brogeta', name: 'Brogeta', family: 'Dragon Broll', price: 6, shopImg: 'figureBrogeta', scaleShop: 2.5 },
    { id: 'breezer', name: 'Breezer', family: 'Dragon Broll', price: 6, shopImg: 'figureBreezer', scaleShop: 2.8 },
    { id: 'db_soon2', name: '???', family: 'Dragon Broll', shopImg: 'figureUnknown', scaleShop: 3.5, comingSoon: true },
    { id: 'db_soon3', name: '???', family: 'Dragon Broll', shopImg: 'figureUnknown', scaleShop: 3.5, comingSoon: true },
  
    // --- FAMILIA: MÍTICOS (Objetivo Final actual) ---
    { id: 'spongebrob', name: 'SpongeBrob', family: 'Míticos', price: 6, shopImg: 'figureSpongeBrob', scaleShop: 2.8 },
    { id: 'mt_soon1', name: '???', family: 'Míticos', shopImg: 'figureUnknown', scaleShop: 3.5, comingSoon: true },
    { id: 'mt_soon2', name: '???', family: 'Míticos', shopImg: 'figureUnknown', scaleShop: 3.5, comingSoon: true },
    { id: 'mt_soon3', name: '???', family: 'Míticos', shopImg: 'figureUnknown', scaleShop: 3.5, comingSoon: true },
    { id: 'mt_soon4', name: '???', family: 'Míticos', shopImg: 'figureUnknown', scaleShop: 3.5, comingSoon: true },
    { id: 'mt_soon5', name: '???', family: 'Míticos', shopImg: 'figureUnknown', scaleShop: 3.5, comingSoon: true },
  ];

// ================== ESCENA 0: SPLASH SCREEN (LOGO COMPLETO) ==================
class SplashScene extends Phaser.Scene {
  constructor() { 
      super({ key: 'SplashScene' }); 
  }

  preload() {
      // Cargamos tu imagen a pantalla completa
      this.load.image('logo_toscandev', '/toscandev.webp');
  }

  create() {
    const width = this.scale.width;
    const height = this.scale.height;
    const centerX = width * 0.5;
    const centerY = height * 0.5;

    // Fondo oscuro
    this.cameras.main.setBackgroundColor('#061423'); 
    
    // Añadimos el logo con transparencia 0 (invisible) para que aparezca poco a poco
    this.logo = this.add.image(centerX, centerY, 'logo_toscandev').setAlpha(0);

    const scaleX = width / this.logo.width;
    const scaleY = height / this.logo.height;
    const scale = Math.max(scaleX, scaleY); 
    this.logo.setScale(scale);

    // --- LA MAGIA ORGÁNICA (Sin tocar nada) ---
    // 1. El logo aparece suavemente desde las sombras (Fade In de 1 segundo)
    this.tweens.add({
        targets: this.logo,
        alpha: 1,
        duration: 1000,
        ease: 'Power2',
        onComplete: () => {
            // 2. Se queda estático brillando durante 1.5 segundos
            this.time.delayedCall(1500, () => {
                
                // 3. Fundido a negro muy suave (800ms) y salta al Menú Principal
                this.cameras.main.fadeOut(800, 0, 0, 0);
                this.cameras.main.once('camerafadeoutcomplete', () => {
                    this.scene.start('MainMenu');
                });
            });
        }
    });

    this.scale.on('resize', this.resize, this);
}

  resize(gameSize) {
      const width = gameSize.width;
      const height = gameSize.height;
      if (this.logo) {
          this.logo.setPosition(width * 0.5, height * 0.5);
          
          // Recalculamos la pantalla completa si el jugador gira el móvil
          const imgWidth = this.logo.texture.getSourceImage().width;
          const imgHeight = this.logo.texture.getSourceImage().height;
          const scaleX = width / imgWidth;
          const scaleY = height / imgHeight;
          this.logo.setScale(Math.max(scaleX, scaleY));
      }
  }
}

// ================== ESCENA 1: MENÚ PRINCIPAL ==================
class MainMenu extends Phaser.Scene {
  constructor() { super({ key: 'MainMenu' }); }

    preload() {
        this.load.audio('bgm_menu', '/music_menu.mp3');
  
        // --- PRECARGA PARA EL DIORAMA RETRO ---
        this.load.spritesheet('troncosSheet', '/troncos_final.png', { frameWidth: 256, frameHeight: 256 });
        this.load.image('figureClimber', '/monkeyclimber-figure.png');
        this.load.image('figureBro', '/monkeybro-figure.png');
        this.load.image('figureBroku', '/broku-figure.png');
        this.load.image('figureBrogeta', '/brogeta-figure.png');
        this.load.image('figureBroccolo', '/broccolo-figure.png');
        this.load.image('figureBrhulk', '/brhulk-figure.png');
        this.load.image('figureBrolverine', '/brolverine-figure.png');
        this.load.image('figureSpiderBro', '/spider-bro-figure.png');
        this.load.image('figureBromer', '/bromer-figure.png');
        this.load.image('figureBrusty', '/brusty-figure.png');
        this.load.image('figureBort', '/bort-figure.png');
    }


  create() {

    // --- CONFIGURACIÓN NATIVA DE APP ---
    StatusBar.hide().catch(() => {}); // Oculta batería y reloj
    KeepAwake.keepAwake().catch(() => {}); // Evita que la pantalla se apague

    // --- SISTEMA DE IDIOMA Y AUDIO (¡AQUÍ FALTABA ESTO!) ---
    this.lang = localStorage.getItem('monkey_lang') || 'en';
      
    const savedMute = localStorage.getItem('monkey_mute');
    if (savedMute !== null) {
        this.sound.mute = savedMute === 'true'; // Carga el sonido correctamente
    }

    // --- EFECTO DE APARECER DESDE NEGRO ---
      this.cameras.main.fadeIn(500, 0, 0, 0);
      
      
      // --- 1. FONDO CIELO Y DIORAMA VIVO ---
      // Cielo azul clásico de tu juego
      this.bg = this.add.rectangle(this.scale.width*0.5, this.scale.height*0.5, this.scale.width, this.scale.height, 0x2d9bf0).setDepth(-3);

      // Contenedor central para todo el escenario
      this.dioramaContainer = this.add.container(this.scale.width * 0.5, this.scale.height * 0.5).setDepth(-2);

      // 1.1 El Gran Tronco Central (3 piezas apiladas para cubrir toda la altura)
      const trunkScale = 1.8;
      const trunkHeight = 256 * trunkScale;
      const trunk1 = this.add.sprite(0, 0, 'troncosSheet', 7).setScale(trunkScale);
      const trunk2 = this.add.sprite(0, -trunkHeight + 2, 'troncosSheet', 6).setScale(trunkScale);
      const trunk3 = this.add.sprite(0, trunkHeight - 2, 'troncosSheet', 8).setScale(trunkScale);
      this.dioramaContainer.add([trunk1, trunk2, trunk3]);

      // 1.2 Reparto de Personajes (Coordenadas X e Y relativas al centro del tronco)
      const chars = [
          { key: 'figureClimber', x: -60, y: 350, scale: 3.5 },   // Principales
          { key: 'figureBro', x: 60, y: 350, scale: 3.5 },
          { key: 'figureBroku', x: -120, y: -150, scale: 2.2 },    // Dragon Broll
          { key: 'figureBrogeta', x: 120, y: -150, scale: 2.2 },
          { key: 'figureBroccolo', x: 0, y: -150, scale: 2.2 },
          { key: 'figureBrhulk', x: 0, y: 30, scale: 2.8 },    // Marbrel (Hulk más grande)
          { key: 'figureBrolverine', x: 100, y: 0, scale: 2.2 },
          { key: 'figureSpiderBro', x: -120, y: 0, scale: 2.2 },
          { key: 'figureBromer', x: -110, y: -350, scale: 2.2 },    // Simpsbron
          { key: 'figureBrusty', x: 90, y: -350, scale: 2.2 },
          { key: 'figureBort', x: 0, y: -380, scale: 2.2 }         // Bort asomando arriba
      ];

      chars.forEach((c, index) => {
          const sp = this.add.image(c.x, c.y, c.key).setScale(c.scale);
          
          // Hacemos que los de la izquierda miren hacia la derecha (hacia el tronco)
          if (c.x < 0) sp.setFlipX(true); 
          
          // Sombra sutil para que destaquen sobre la madera
          sp.setTint(0xf4f4f4); 

          this.dioramaContainer.add(sp);

          // ¡LA MAGIA! Animación de respiración orgánica para cada uno
          this.tweens.add({
              targets: sp,
              scaleX: c.scale * 1.05,
              scaleY: c.scale * 1.05,
              y: c.y - 8,
              duration: 1500 + Math.random() * 500, // Cada uno respira a un ritmo distinto
              yoyo: true,
              repeat: -1,
              ease: 'Sine.easeInOut',
              delay: index * 150 // Desfase para que no se muevan todos a la vez como robots
          });
      });

      // 1.3 Filtro oscuro por encima de la escena para que los botones y el texto se lean perfectamente
      this.menuOverlay = this.add.rectangle(this.scale.width*0.5, this.scale.height*0.5, this.scale.width, this.scale.height, 0x000000).setAlpha(0.4).setDepth(-1);

      // --- 2. AÑADE LA LÓGICA DE MÚSICA AQUÍ ---
      const menuMusic = this.sound.get('bgm_menu');
      if (!menuMusic) {
          this.sound.play('bgm_menu', { loop: true, volume: 0.5 });
      } else if (!menuMusic.isPlaying) {
          menuMusic.play({ loop: true, volume: 0.5 });
      }
      // --- AUTO-PAUSA DE MÚSICA AL BLOQUEAR EL MÓVIL ---
      this.game.events.on('hidden', () => {
        const music = this.sound.get('bgm_menu');
        if (music && music.isPlaying) music.pause();
    }, this);

    this.game.events.on('visible', () => {
        const music = this.sound.get('bgm_menu');
        if (music && music.isPaused) music.resume();
    }, this);

    // Limpiamos los eventos al cambiar de escena para que no se dupliquen
    this.events.on('shutdown', () => {
        this.game.events.off('hidden');
        this.game.events.off('visible');
    });
      
      const totalBananas = localStorage.getItem('monkey_bananas') || 0;
      const highScore = localStorage.getItem('monkey_highscore') || 0;

      this.titleText = this.add.text(0, 0, "RETRO\nCLIMBRO", { 
          fontSize: '45px', fill: '#ffd700', fontStyle: 'bold', align: 'center', fontFamily: 'Courier', stroke: '#000', strokeThickness: 4 
      }).setOrigin(0.5);

      this.bestScoreText = this.add.text(0, 0, this.lang === 'es' ? `Mejor: ${highScore}m` : `Best: ${highScore}m`, { fontSize: '24px', fill: '#fff', fontFamily: 'Courier', fontStyle: 'bold' }).setOrigin(0.5);
      this.bananasText = this.add.text(0, 0, `${totalBananas} 🍌`, { fontSize: '24px', fill: '#ffff00', fontFamily: 'Courier', fontStyle: 'bold' }).setOrigin(0.5);

      // ==========================================
      // --- SISTEMA DE LOGROS (TROFEO) ---
      // ==========================================
      
      // Botón Trofeo arriba a la izquierda
      this.achieveBtn = this.add.text(20, 20, '🏆', { 
        fontSize: '35px', padding: { top: 10, bottom: 10, left: 5, right: 10 } 
    }).setOrigin(0, 0).setInteractive();
    
    this.achieveGroup = this.add.group();
    
    // Fondo negro semi-transparente
    const achBg = this.add.rectangle(this.scale.width*0.5, this.scale.height*0.5, this.scale.width, this.scale.height, 0x000000).setAlpha(0.95).setInteractive();
    
    const achTitle = this.add.text(this.scale.width*0.5, this.scale.height * 0.15, this.lang === 'es' ? 'LOGROS' : 'ACHIEVEMENTS', { 
        fontSize: '40px', fill: '#ffd700', fontStyle: 'bold', fontFamily: 'Courier', stroke: '#000', strokeThickness: 6 
    }).setOrigin(0.5);

    this.achieveGroup.addMultiple([achBg, achTitle]);

    // --- LISTA DE LOGROS ---
    const achievements = [
        { id: 'lv5',  t_es: 'NIVEL 5', t_en: 'LEVEL 5', req: 5,  type: 'level', reward: 100 },
        { id: 'lv8',  t_es: 'NIVEL 8', t_en: 'LEVEL 8', req: 8,  type: 'level', reward: 150 },
        { id: 'lv10', t_es: 'NIVEL 10', t_en: 'LEVEL 10', req: 10, type: 'level', reward: 250 },
        { id: 'sk5',  t_es: '5 MONOS', t_en: '5 SKINS', req: 5,  type: 'skins', reward: 200 },
        { id: 'sk10', t_es: '10 MONOS', t_en: '10 SKINS', req: 10, type: 'skins', reward: 500 }
    ];

    // Leer datos del jugador
    let claimedAch = JSON.parse(localStorage.getItem('monkey_achievements') || '[]');
    const maxLevelReached = parseInt(localStorage.getItem('monkey_max_level') || 1);
    const skinsUnlocked = JSON.parse(localStorage.getItem('unlocked_skins') || '["monkey"]').length;

    let startY = this.scale.height * 0.28;

    achievements.forEach((ach) => {
        const isClaimed = claimedAch.includes(ach.id);
        let isUnlocked = false;

        if (ach.type === 'level' && maxLevelReached >= ach.req) isUnlocked = true;
        if (ach.type === 'skins' && skinsUnlocked >= ach.req) isUnlocked = true;

        // Caja del logro
        const box = this.add.rectangle(this.scale.width*0.5, startY, this.scale.width * 0.85, 75, 0x222222).setStrokeStyle(2, 0x444444);
        
        const title = this.add.text(this.scale.width*0.5 - 130, startY - 15, this.lang === 'es' ? ach.t_es : ach.t_en, { fontSize: '20px', fill: '#fff', fontStyle: 'bold', fontFamily: 'Courier' }).setOrigin(0, 0.5);
        const rewText = this.add.text(this.scale.width*0.5 - 130, startY + 15, `+${ach.reward} 🍌`, { fontSize: '18px', fill: '#ffff00', fontStyle: 'bold', fontFamily: 'Courier' }).setOrigin(0, 0.5);

        // Estado del botón: Cobrado (Verde), Listo para cobrar (Amarillo), Bloqueado (Gris)
        let btnColor = 0x555555;
        let btnTextStr = '🔒';
        if (isClaimed) { btnColor = 0x2ca02c; btnTextStr = 'OK'; }
        else if (isUnlocked) { btnColor = 0xffd700; btnTextStr = '¡GET!'; }

        const actionBtn = this.add.rectangle(this.scale.width*0.5 + 100, startY, 70, 45, btnColor).setInteractive();
        const actionText = this.add.text(this.scale.width*0.5 + 100, startY, btnTextStr, { fontSize: isUnlocked && !isClaimed ? '18px' : '22px', fill: isUnlocked && !isClaimed ? '#000' : '#fff', fontStyle: 'bold' }).setOrigin(0.5);

        // Lógica de cobrar recompensa
        actionBtn.on('pointerdown', () => {
            if (isUnlocked && !isClaimed) {
                // Sumar bananas
                let currentBananas = parseInt(localStorage.getItem('monkey_bananas') || 0);
                currentBananas += ach.reward;
                localStorage.setItem('monkey_bananas', currentBananas);
                
                // Actualizar textos en pantalla
                this.bananasText.setText(`${currentBananas} 🍌`);
                
                // Efecto visual satisfactorio
                this.cameras.main.flash(300, 255, 255, 0);
                this.tweens.add({ targets: this.bananasText, scale: 1.5, duration: 150, yoyo: true });

                // Marcar como cobrado
                claimedAch.push(ach.id);
                localStorage.setItem('monkey_achievements', JSON.stringify(claimedAch));

                // Cambiar botón a verde
                actionBtn.setFillStyle(0x2ca02c);
                actionText.setText('OK').setFill('#fff');
            } else if (!isUnlocked) {
                // Si toca uno bloqueado, tiembla
                this.cameras.main.shake(100, 0.005);
            }
        });

        this.achieveGroup.addMultiple([box, title, rewText, actionBtn, actionText]);
        startY += 85;
    });

    // Botón Cerrar (X roja)
    const closeAchBtn = this.add.text(this.scale.width*0.5, this.scale.height * 0.88, 'X', { 
        fontSize: '45px', fill: '#ff4444', fontStyle: 'bold', fontFamily: 'Courier', stroke: '#000', strokeThickness: 6 
    }).setOrigin(0.5).setInteractive();
    
    // --- LA SOLUCIÓN: OCULTAR LOS BOTONES COMPLETAMENTE ---
    closeAchBtn.on('pointerup', () => {
        this.achieveGroup.setVisible(false);
        
        // Volvemos a mostrar y activar los botones
        this.playBtn.setInteractive().setVisible(true);
        this.playShadow.setVisible(true);
        this.playText.setVisible(true);
        
        this.shopBtn.setInteractive().setVisible(true);
        this.shopShadow.setVisible(true);
        this.shopText.setVisible(true);
    });

    this.achieveGroup.add(closeAchBtn);
    
    // Forzamos a que todo el menú de logros tenga Depth 100 (por encima de todo)
    this.achieveGroup.setDepth(100); 
    this.achieveGroup.setVisible(false);

    // Abrir menú de logros
    this.achieveBtn.on('pointerdown', () => {
        this.achieveGroup.setVisible(true);
        
        // Ocultamos y desactivamos los botones del menú principal
        this.playBtn.disableInteractive().setVisible(false);
        this.playShadow.setVisible(false);
        this.playText.setVisible(false);
        
        this.shopBtn.disableInteractive().setVisible(false);
        this.shopShadow.setVisible(false);
        this.shopText.setVisible(false);
    });
    
      // --- BOTÓN PLAY (ESTILO RETRO PRO) ---
      // 1. Sombra oscura (No se mueve)
      this.playShadow = this.add.rectangle(0, 0, 260, 60, 0x000000).setOrigin(0.5); 
      // 2. Botón principal (Con borde blanco grueso)
      this.playBtn = this.add.rectangle(0, 0, 260, 60, 0x2d9bf0).setInteractive();
      this.playBtn.setStrokeStyle(4, 0xffffff); 
      // 3. Texto
      this.playText = this.add.text(0, 0, this.lang === 'es' ? 'JUGAR' : 'PLAY GAME', { 
          fontSize: '28px', fill: '#fff', fontFamily: 'Courier', fontStyle: 'bold' 
      }).setOrigin(0.5);

      // --- BOTÓN SHOP (ESTILO RETRO PRO) ---
      this.shopShadow = this.add.rectangle(0, 0, 260, 60, 0x000000).setOrigin(0.5);
      this.shopBtn = this.add.rectangle(0, 0, 260, 60, 0x2d9bf0).setInteractive();
      this.shopBtn.setStrokeStyle(4, 0xffffff);
      this.shopText = this.add.text(0, 0, this.lang === 'es' ? 'TIENDA' : 'SHOP', { 
          fontSize: '24px', fill: '#fff', fontFamily: 'Courier', fontStyle: 'bold' 
      }).setOrigin(0.5); 
      
      // ==========================================
      // --- BOTÓN DE AJUSTES (ENGRANAJE) ---
      this.settingsBtn = this.add.text(0, 0, '⚙️', { 
        fontSize: '35px', 
        padding: { top: 10, bottom: 10, left: 10, right: 5 } 
    }).setOrigin(1, 0).setInteractive();
      
      // --- INTERFAZ DEL MENÚ DE AJUSTES ---
      this.settingsGroup = this.add.group();
      
      // Fondo negro semi-transparente
      const setBg = this.add.rectangle(this.scale.width*0.5, this.scale.height*0.5, this.scale.width, this.scale.height, 0x000000).setAlpha(0.9).setInteractive();
      
      // Título
      const setTitle = this.add.text(this.scale.width*0.5, this.scale.height * 0.30, this.lang === 'es' ? 'AJUSTES' : 'SETTINGS', { 
          fontSize: '45px', fill: '#ffd700', fontStyle: 'bold', fontFamily: 'Courier', stroke: '#000', strokeThickness: 6 
      }).setOrigin(0.5);

     // Variables dinámicas para las etiquetas
     let t_soundLabel = this.lang === 'es' ? 'SONIDO:' : 'SOUND:';
     let t_langLabel = this.lang === 'es' ? 'IDIOMA: ESP' : 'LANG: ENG';

     // --- VARIABLE DE CONTROL ABSOLUTO ---
     let isMuted = this.sound.mute; 

     // 1. Toggle Sonido (Azul, estilo retro)
     const soundBtnBg = this.add.rectangle(this.scale.width*0.5, this.scale.height * 0.45, 260, 60, 0x2d9bf0).setInteractive();
     const soundBtnText = this.add.text(this.scale.width*0.5, this.scale.height * 0.45, `${t_soundLabel} ${isMuted ? 'OFF' : 'ON'}`, { 
         fontSize: '26px', fill: '#fff', fontStyle: 'bold', fontFamily: 'Courier' 
     }).setOrigin(0.5); // <--- ¡TEXTO SIN INTERACTIVIDAD!
     
     // Acción unificada para el botón de sonido
     const toggleSoundAction = () => {
         isMuted = !isMuted;               
         this.sound.mute = isMuted;        
         localStorage.setItem('monkey_mute', isMuted); 
         soundBtnText.setText(`${t_soundLabel} ${isMuted ? 'OFF' : 'ON'}`); 
     };

     soundBtnBg.on('pointerover', () => soundBtnBg.setFillStyle(0x1a7bc0));
     soundBtnBg.on('pointerout', () => soundBtnBg.setFillStyle(0x2d9bf0));
     soundBtnBg.on('pointerdown', toggleSoundAction); // <--- SOLO SE ASIGNA AL FONDO

     // 2. Toggle Idioma (Azul, estilo retro)
     const langBtnBg = this.add.rectangle(this.scale.width*0.5, this.scale.height * 0.60, 260, 60, 0x2d9bf0).setInteractive();
     const langBtnText = this.add.text(this.scale.width*0.5, this.scale.height * 0.60, t_langLabel, { 
         fontSize: '26px', fill: '#fff', fontStyle: 'bold', fontFamily: 'Courier' 
     }).setOrigin(0.5); // <--- ¡TEXTO SIN INTERACTIVIDAD!
     
     // Acción unificada para el botón de idioma
     const toggleLangAction = () => {
         this.lang = this.lang === 'en' ? 'es' : 'en';
         localStorage.setItem('monkey_lang', this.lang); // Ahora sí guarda perfecto
         
         t_soundLabel = this.lang === 'es' ? 'SONIDO:' : 'SOUND:';
         t_langLabel = this.lang === 'es' ? 'IDIOMA: ESP' : 'LANG: ENG';

         setTitle.setText(this.lang === 'es' ? 'AJUSTES' : 'SETTINGS');
         soundBtnText.setText(`${t_soundLabel} ${isMuted ? 'OFF' : 'ON'}`); 
         langBtnText.setText(t_langLabel);

         const hs = localStorage.getItem('monkey_highscore') || 0;
         this.bestScoreText.setText(this.lang === 'es' ? `Mejor: ${hs}m` : `Best: ${hs}m`);
         this.playText.setText(this.lang === 'es' ? 'JUGAR' : 'PLAY GAME');
         this.shopText.setText(this.lang === 'es' ? 'TIENDA' : 'SHOP');
     };

     langBtnBg.on('pointerover', () => langBtnBg.setFillStyle(0x1a7bc0));
     langBtnBg.on('pointerout', () => langBtnBg.setFillStyle(0x2d9bf0));
     langBtnBg.on('pointerdown', toggleLangAction); // <--- SOLO SE ASIGNA AL FONDO

      // Botón Cerrar (X roja retro)
      const closeSettingsBtn = this.add.text(this.scale.width*0.5, this.scale.height * 0.75, 'X', { 
        fontSize: '45px', fill: '#ff4444', fontStyle: 'bold', fontFamily: 'Courier', stroke: '#000', strokeThickness: 6 
    }).setOrigin(0.5).setInteractive();
    
    closeSettingsBtn.on('pointerup', () => {
        this.settingsGroup.setVisible(false);
        
        // Volvemos a mostrar los botones
        this.playBtn.setInteractive().setVisible(true);
        this.playShadow.setVisible(true);
        this.playText.setVisible(true);
        
        this.shopBtn.setInteractive().setVisible(true);
        this.shopShadow.setVisible(true);
        this.shopText.setVisible(true);
    });

    // Añadir todo al grupo y ocultarlo de inicio
    this.settingsGroup.addMultiple([setBg, setTitle, soundBtnBg, soundBtnText, langBtnBg, langBtnText, closeSettingsBtn]);
    this.settingsGroup.setDepth(100); // <-- Aseguramos que esté por encima
    this.settingsGroup.setVisible(false);

    // Acción de abrir ajustes al tocar el engranaje
    this.settingsBtn.on('pointerdown', () => {
        this.settingsGroup.setVisible(true);
        
        // Ocultamos los botones
        this.playBtn.disableInteractive().setVisible(false);
        this.playShadow.setVisible(false);
        this.playText.setVisible(false);
        
        this.shopBtn.disableInteractive().setVisible(false);
        this.shopShadow.setVisible(false);
        this.shopText.setVisible(false);
    });

     
      // ==========================================
      // --- ACCIÓN: QUÉ PASA AL PULSAR PLAY ---
      const startGame = () => {
        // Desactivamos los botones para evitar clics dobles fantasma
        this.playBtn.disableInteractive();
        this.shopBtn.disableInteractive();

        // Hacemos el fundido a negro (500 milisegundos)
        this.cameras.main.fadeOut(500, 0, 0, 0);

        // Le decimos que cuando termine el fundido, pase a la pantalla de juego
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('GameScene');
        });
    };

    // --- ACCIÓN: QUÉ PASA AL PULSAR SHOP ---
    const openShop = () => {
        this.scene.start('ShopScene');
    };

    // ==========================================
    // --- EFECTOS DE CLIC 3D (BOTÓN JUGAR) ---
    this.playBtn.on('pointerover', () => this.playBtn.setFillStyle(0x1a7bc0));
    
    this.playBtn.on('pointerout', () => {
        this.playBtn.setFillStyle(0x2d9bf0);
        // Si el jugador saca el dedo sin soltar, el botón vuelve a subir
        this.playBtn.x = this.playShadow.x - 6; this.playBtn.y = this.playShadow.y - 6;
        this.playText.x = this.playShadow.x - 6; this.playText.y = this.playShadow.y - 6;
    });
    
    this.playBtn.on('pointerdown', () => {
        // ¡HUNDIR EL BOTÓN! (Se mueve físicamente hacia la sombra)
        this.playBtn.x = this.playShadow.x; this.playBtn.y = this.playShadow.y;
        this.playText.x = this.playShadow.x; this.playText.y = this.playShadow.y;
    });
    
    this.playBtn.on('pointerup', () => {
        // REBOTA HACIA ARRIBA Y EJECUTA LA ACCIÓN
        this.playBtn.x = this.playShadow.x - 6; this.playBtn.y = this.playShadow.y - 6;
        this.playText.x = this.playShadow.x - 6; this.playText.y = this.playShadow.y - 6;
        startGame();
    });

    // ==========================================
    // --- EFECTOS DE CLIC 3D (BOTÓN TIENDA) ---
    this.shopBtn.on('pointerover', () => this.shopBtn.setFillStyle(0x1a7bc0));
    
    this.shopBtn.on('pointerout', () => {
        this.shopBtn.setFillStyle(0x2d9bf0);
        this.shopBtn.x = this.shopShadow.x - 6; this.shopBtn.y = this.shopShadow.y - 6;
        this.shopText.x = this.shopShadow.x - 6; this.shopText.y = this.shopShadow.y - 6;
    });
    
    this.shopBtn.on('pointerdown', () => {
        this.shopBtn.x = this.shopShadow.x; this.shopBtn.y = this.shopShadow.y;
        this.shopText.x = this.shopShadow.x; this.shopText.y = this.shopShadow.y;
    });
    
    this.shopBtn.on('pointerup', () => {
        this.shopBtn.x = this.shopShadow.x - 6; this.shopBtn.y = this.shopShadow.y - 6;
        this.shopText.x = this.shopShadow.x - 6; this.shopText.y = this.shopShadow.y - 6;
        openShop();
    });

      this.resize(this.scale.gameSize);
    
      this.scale.on('resize', this.resize, this);
  }

  resize(gameSize) {
    const width = gameSize.width;
    const height = gameSize.height;
    const centerX = width * 0.5;
    const centerY = height * 0.5;
    
    // 1. FONDOS
    if (this.bg) {
      this.bg.setPosition(centerX, centerY);
      this.bg.setSize(width, height);
    }
    if (this.menuOverlay) {
        this.menuOverlay.setPosition(centerX, centerY);
        this.menuOverlay.setSize(width, height);
    }

    // 2. ESCALA GLOBAL (La misma para el árbol y para los textos)
    const targetWidth = Math.min(width * 0.85, 500); 
    const globalScale = targetWidth / 460;

    if (this.dioramaContainer) {
        this.dioramaContainer.setPosition(centerX, centerY);
        this.dioramaContainer.setScale(globalScale);
    }

    // --- 3. UI SINCRONIZADA (¡LA MAGIA ESTÁ AQUÍ!) ---
    // Al multiplicar por 'globalScale', los textos se mueven y separan 
    // exactamente igual que los monos en cualquier dispositivo.

    // Título: En el hueco entre Simpsbron (-360) y Dragon Broll (-150)
    this.titleText.setPosition(centerX, centerY - (255 * globalScale));
    
    // Puntuaciones: En el hueco entre Dragon Broll (-150) y Marbrel (0)
    this.bestScoreText.setPosition(centerX, centerY - (85 * globalScale));
    this.bananasText.setPosition(centerX, centerY - (45 * globalScale));
    
    // Botones: En el hueco entre Marbrel (0) y los Monos Principales (+320)
    const playY = centerY + (130 * globalScale);
    this.playShadow.setPosition(centerX, playY); // ¡Atornillamos la sombra al centro!
    this.playBtn.setPosition(centerX - 6, playY - 6); // El botón flota un poco por encima
    this.playText.setPosition(centerX - 6, playY - 6);
    
    const shopY = centerY + (230 * globalScale);
    this.shopShadow.setPosition(centerX, shopY);
    this.shopBtn.setPosition(centerX - 6, shopY - 6);
    this.shopText.setPosition(centerX - 6, shopY - 6);

    // El engranaje de ajustes siempre arriba a la derecha
    if (this.settingsBtn) this.settingsBtn.setPosition(width - 20, 20);
}}

// ================== ESCENA 2: TIENDA (MEJORADA) ==================
class ShopScene extends Phaser.Scene {
  constructor() { super({ key: 'ShopScene' }); }

  preload() {
    this.load.audio('bgm_menu', '/music_menu.mp3');

    // --- PRECARGA PARA EL DIORAMA RETRO ---
    this.load.spritesheet('troncosSheet', '/troncos_final.png', { frameWidth: 256, frameHeight: 256 });
    this.load.image('figureUnknown', '/unknown-figure.png');
    this.load.image('figureClimber', '/monkeyclimber-figure.png');
    this.load.image('figureBro', '/monkeybro-figure.png');
    this.load.image('figureBroku', '/broku-figure.png');
    this.load.image('figureBrogeta', '/brogeta-figure.png');
    this.load.image('figureBreezer', '/breezer-figure.png');
    this.load.image('figureBroccolo', '/broccolo-figure.png');
    this.load.image('figureBrhulk', '/brhulk-figure.png');
    this.load.image('figureBrolverine', '/brolverine-figure.png');
    this.load.image('figureSpiderBro', '/spider-bro-figure.png');
    this.load.image('figureDeadbrool', '/deadbrool-figure.png');
    this.load.image('figureBromer', '/bromer-figure.png');
    this.load.image('figureBrusty', '/brusty-figure.png');
    this.load.image('figureBort', '/bort-figure.png');
    this.load.image('figureBrolhouse', '/brolhouse-figure.png');
    this.load.image('figureSpongeBrob', '/spongebrob-figure.png');
}

  // Recibimos 'data' al iniciar (aquí viene la posición del scroll guardada)
  create(data) {
    const width = this.scale.width;
    const height = this.scale.height;

    // Detectamos el idioma
    this.lang = localStorage.getItem('monkey_lang') || 'en';

    // --- AUTO-PAUSA DE MÚSICA AL BLOQUEAR EL MÓVIL ---
    this.game.events.on('hidden', () => {
        const music = this.sound.get('bgm_menu');
        if (music && music.isPlaying) music.pause();
    }, this);

    this.game.events.on('visible', () => {
        const music = this.sound.get('bgm_menu');
        if (music && music.isPaused) music.resume();
    }, this);

    // Limpiamos los eventos al cambiar de escena para que no se dupliquen
    this.events.on('shutdown', () => {
        this.game.events.off('hidden');
        this.game.events.off('visible');
    });

    // --- 1. FONDO DE LA TIENDA (Detrás de todo) ---
    this.add.rectangle(0, 0, width, height, 0x1a1a1a)
        .setOrigin(0)
        .setScrollFactor(0); 

    // --- 2. GENERAR LISTA DE PERSONAJES (Capa Baja) ---
    // Empezamos más abajo (150px) para que no choque con la cabecera
    let yPos = 150; 
    
    const unlockedSkins = JSON.parse(localStorage.getItem('unlocked_skins') || '["monkey"]');
    const equippedSkin = localStorage.getItem('equipped_skin') || 'monkey';

    const families = {};
    SKINS.forEach(skin => {
        if (!families[skin.family]) families[skin.family] = [];
        families[skin.family].push(skin);
    });

    for (const [familyName, skins] of Object.entries(families)) {
        // Título Familia
        this.add.text(width/2, yPos, familyName.toUpperCase(), { fontSize: '20px', fill: '#2d9bf0', fontStyle: 'bold' }).setOrigin(0.5);
        yPos += 45;

        const cardWidth = 110; 
        const spacing = 15;
        const maxCols = 3; // <--- LÍMITE: 3 tarjetas por fila

        // Recorremos las skins de esta familia en bloques de 3 en 3
        for (let i = 0; i < skins.length; i += maxCols) {
            const rowSkins = skins.slice(i, i + maxCols);
            
            // Calculamos el ancho exacto de ESTA fila concreta para centrarla siempre
            const totalRowWidth = (rowSkins.length * cardWidth) + ((rowSkins.length - 1) * spacing);
            let startX = (width - totalRowWidth) / 2 + (cardWidth / 2);

            rowSkins.forEach((skin) => {
                const isUnlocked = unlockedSkins.includes(skin.id);
                const isEquipped = equippedSkin === skin.id;

                // --- DIBUJAR TARJETA ---
                const container = this.add.container(startX, yPos + 60);

                if (skin.comingSoon) {
                    // --- MODO: PRÓXIMAMENTE ---
                    // Fondo oscuro apagado
                    const bg = this.add.rectangle(0, 0, cardWidth, 150, 0x222222).setInteractive();
                    bg.setStrokeStyle(2, 0x444444);
                    container.add(bg);

                    // Imagen (Interrogante medio transparente)
                    if (this.textures.exists(skin.shopImg)) {
                        const sprite = this.add.image(0, -20, skin.shopImg).setScale(skin.scaleShop).setAlpha(0.6);
                        container.add(sprite);
                    }

                    // Texto descriptivo abajo
                    const t_soon = this.lang === 'es' ? 'PRÓXIMO' : 'SOON';
                    const nameText = this.add.text(0, 55, t_soon, { 
                        fontSize: '18px', fill: '#666666', fontStyle: 'bold', fontFamily: 'Courier' 
                    }).setOrigin(0.5);
                    container.add(nameText);

                    // Si hacen clic, la cámara tiembla para indicar "no disponible"
                    bg.on('pointerup', () => {
                        if (this.isDragging) return;
                        this.cameras.main.shake(150, 0.005);
                    });

                } else {
                    // --- MODO: TARJETA NORMAL (COMPRABLE/SELECCIONABLE) ---
                    let bgColor = 0x333333;
                    let strokeColor = 0x000000;
                    if (isEquipped) { bgColor = 0x2d9bf0; strokeColor = 0xffffff; } 
                    else if (isUnlocked) { bgColor = 0x317db8; }

                    const bg = this.add.rectangle(0, 0, cardWidth, 150, bgColor).setInteractive();
                    bg.setStrokeStyle(isEquipped ? 3 : 2, strokeColor);
                    container.add(bg);

                    if (this.textures.exists(skin.shopImg)) {
                        const sprite = this.add.image(0, -20, skin.shopImg).setScale(skin.scaleShop);
                        container.add(sprite);
                    } else {
                        container.add(this.add.text(0, -25, '?', { fontSize: '30px' }).setOrigin(0.5));
                    }

                    const nameText = this.add.text(0, 65, skin.name.toUpperCase(), { 
                        fontSize: '16px', fill: '#ffffff', fontStyle: 'bold', fontFamily: 'Courier' 
                    }).setOrigin(0.5);
                    container.add(nameText);

                    if (isUnlocked) {
                        bg.on('pointerup', () => {
                            if (this.isDragging) return; 
                            localStorage.setItem('equipped_skin', skin.id);
                            const currentScroll = this.cameras.main.scrollY;
                            this.scene.restart({ savedScroll: currentScroll });
                        });

                        if (isEquipped) {
                            const stampBox = this.add.rectangle(0, 0, 90, 30);
                            stampBox.setStrokeStyle(3, 0xffffff);
                            stampBox.setRotation(-0.2);
                            container.add(stampBox);
                            
                            const stampTextStr = this.lang === 'es' ? 'ELEGIDO' : 'SELECTED';
                            const stampText = this.add.text(0, 0, stampTextStr, { fontSize: '16px', fill: '#ffffff', fontStyle: 'bold' }).setOrigin(0.5).setRotation(-0.2);
                            container.add(stampText);
                        }
                    } else {
                        const priceText = this.add.text(0, 45, `${skin.price} 🍌`, { fontSize: '14px', fill: '#ffff00', fontStyle: 'bold' }).setOrigin(0.5);
                        container.add(priceText);
                        
                        bg.on('pointerup', () => {
                            if (this.isDragging) return;
                            if (this.totalBananas >= skin.price) {
                                // 1. Lógica de cobro (La que ya tenías)
                                this.totalBananas -= skin.price;
                                localStorage.setItem('monkey_bananas', this.totalBananas);
                                
                                // Actualizamos el marcador superior al instante
                                this.moneyText.setText(`${this.totalBananas} 🍌`);

                                unlockedSkins.push(skin.id);
                                localStorage.setItem('unlocked_skins', JSON.stringify(unlockedSkins));
                                localStorage.setItem('equipped_skin', skin.id);
                                
                                // 2. Ocultamos el precio para dejar la carta limpia
                                priceText.setVisible(false);

                                // 3. Ponemos la carta por encima del resto para que al crecer no se corte
                                // --- LA NUEVA MAGIA: EL VIAJE DE LA CARTA ---
                                // 1. Guardamos dónde estaba la carta originalmente
                                const origX = container.x;
                                const origY = container.y;
                                
                                // 2. Calculamos el centro exacto de la pantalla (sumando el scroll actual)
                                const targetX = this.scale.width * 0.5;
                                const targetY = this.cameras.main.scrollY + (this.scale.height * 0.5);

                                // Ponemos la carta por encima de toda la tienda y la cabecera
                                container.setDepth(1000); 

                                // FASE 1: Viaje al centro y zoom
                                this.tweens.add({
                                    targets: container,
                                    x: targetX,
                                    y: targetY,
                                    scaleX: 2,   // Se hace casi el doble de grande
                                    scaleY: 2,
                                    duration: 5, // Medio segundito de viaje
                                    ease: 'Back.easeOut', // Efecto de frenada elástica al llegar al centro
                                    onComplete: () => {
                                        
                                        // FASE 2: Latido en el centro (Pum-Pum)
                                        this.tweens.add({
                                            targets: container,
                                            scaleX: 2.5,   // Crece un poco más
                                            scaleY: 2.5,
                                            duration: 300,
                                            yoyo: true,    // Vuelve a 1.8
                                            repeat: 1,     // Hace 2 latidos
                                            onComplete: () => {
                                                
                                                // FASE 3: Vuelta rápida a su estante
                                                this.tweens.add({
                                                    targets: container,
                                                    x: origX,
                                                    y: origY,
                                                    scaleX: 1,     // Vuelve a tamaño normal
                                                    scaleY: 1,
                                                    duration: 250,
                                                    ease: 'Power2',
                                                    onComplete: () => {
                                                        // 4. Reiniciamos la tienda cuando todo ha terminado
                                                        const currentScroll = this.cameras.main.scrollY;
                                                        this.scene.restart({ savedScroll: currentScroll });
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });

                            } else {
                                this.cameras.main.shake(200, 0.005);
                            }
                        });
                    }
                }

                this.add.existing(container);
                startX += cardWidth + spacing;
            });
            
            // Bajamos la Y para dibujar la siguiente fila de la misma familia
            yPos += 180; 
        }
        
        // Espacio extra antes del título de la siguiente familia
        yPos += 40; 
    }
    

    // --- 3. CABECERA UI (Depth alto para tapar el scroll) ---
    // Creamos un rectángulo sólido arriba del todo
    // Depth 100 asegura que esté por encima de los personajes (Depth 0)
    const headerHeight = 100;
    this.add.rectangle(0, 0, width, headerHeight, 0x1a1a1a) // Mismo color que el fondo
        .setOrigin(0)
        .setScrollFactor(0)
        .setDepth(100); 

        const shopTitle = this.lang === 'es' ? 'TIENDA' : 'SHOP';
        this.add.text(width/2, 50, shopTitle, { fontSize: '36px', fill: '#ffd700', fontStyle: 'bold' }).setOrigin(0.5).setScrollFactor(0).setDepth(101);
    
        this.totalBananas = parseInt(localStorage.getItem('monkey_bananas') || 0);
        this.moneyText = this.add.text(width - 30, 50, `${this.totalBananas} 🍌`, { fontSize: '24px', fill: '#fff' }).setOrigin(1, 0.5).setScrollFactor(0).setDepth(101);
    
        const backText = this.lang === 'es' ? '< ' : '< BACK';
        const exitBtn = this.add.text(30, 50, backText, { fontSize: '24px', fill: '#fff' }).setOrigin(0, 0.5).setInteractive().setScrollFactor(0).setDepth(101);
        
        exitBtn.on('pointerdown', () => this.scene.start('MainMenu'));

    // --- 4. CONFIGURACIÓN DE SCROLL ---
    const contentHeight = yPos + 50; 
    
    if (contentHeight > height) {
        this.cameras.main.setBounds(0, 0, width, contentHeight);
        
        // RECUPERAR POSICIÓN GUARDADA
        if (data && data.savedScroll) {
            this.cameras.main.scrollY = data.savedScroll;
        }

        this.isDragging = false;
        let startY = 0;

        this.input.on('pointerdown', (pointer) => {
            this.isDragging = false;
            startY = pointer.y;
        });

        this.input.on('pointermove', (pointer) => {
            if (pointer.isDown) {
                const distY = pointer.y - pointer.prevPosition.y;
                if (Math.abs(pointer.y - startY) > 10) this.isDragging = true;
                this.cameras.main.scrollY -= distY;
                
                // Clamping
                if (this.cameras.main.scrollY < 0) this.cameras.main.scrollY = 0;
                const maxScroll = contentHeight - height;
                if (this.cameras.main.scrollY > maxScroll) this.cameras.main.scrollY = maxScroll;
            }
        });

        this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
            this.cameras.main.scrollY += deltaY;
            if (this.cameras.main.scrollY < 0) this.cameras.main.scrollY = 0;
            const maxScroll = contentHeight - height;
            if (this.cameras.main.scrollY > maxScroll) this.cameras.main.scrollY = maxScroll;
        });
    }
  }
}

// ================== ESCENA 3: JUEGO ==================
class GameScene extends Phaser.Scene {
  constructor() { super({ key: 'GameScene' }) }

  preload() {
    //Los que están dentro del juego
    this.load.spritesheet('troncosSheet', '/troncos_final.png', { frameWidth: 256, frameHeight: 256 });
    this.load.spritesheet('monkey', '/monkey_climb_strip.png', { frameWidth: 34, frameHeight: 34 });
    this.load.spritesheet('monkeyBro', '/monkey-bro.png', { frameWidth: 34, frameHeight: 34 });
    this.load.spritesheet('oruga', '/oruga_strip2.png', { frameWidth: 40, frameHeight: 40 });
    this.load.spritesheet('oruga2', '/oruga2.png', { frameWidth: 40, frameHeight: 40 });
    this.load.spritesheet('arana', '/arana.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('abeja', '/bee.png', { frameWidth: 40, frameHeight: 40 });
    this.load.spritesheet('broku', '/broku.png', { frameWidth: 40, frameHeight: 40 });
    this.load.spritesheet('brogeta', '/brogeta.png', { frameWidth: 40, frameHeight: 40 });
    this.load.spritesheet('broccolo', '/broccolo.png', { frameWidth: 40, frameHeight: 40 });
    this.load.spritesheet('breezer', '/breezer.png', { frameWidth: 34, frameHeight: 34 });
    this.load.spritesheet('brhulk', '/brhulk.png', { frameWidth: 40, frameHeight: 40 });
    this.load.spritesheet('brolverine', '/brolverine.png', { frameWidth: 40, frameHeight: 40 });
    this.load.spritesheet('spiderbro', '/spider-bro.png', { frameWidth: 34, frameHeight: 34 });
    this.load.spritesheet('deadbrool', '/deadbrool.png', { frameWidth: 34, frameHeight: 34 });
    this.load.spritesheet('bromer', '/bromer.png', { frameWidth: 40, frameHeight: 40 });
    this.load.spritesheet('brusty', '/brusty.png', { frameWidth: 40, frameHeight: 40 });
    this.load.spritesheet('bort', '/bort.png', { frameWidth: 40, frameHeight: 40 });
    this.load.spritesheet('brolhouse', '/brolhouse.png', { frameWidth: 40, frameHeight: 40 });
    this.load.spritesheet('spongebrob', '/spongebrob.png', { frameWidth: 34, frameHeight: 34 }); 



    //Los que están en la tienda
    this.load.image('figureClimber', '/monkeyclimber-figure.png');
    this.load.image('figureBro', '/monkeybro-figure.png');
    this.load.image('figureBroku', '/broku-figure.png');
    this.load.image('figureBrogeta', '/brogeta-figure.png');
    this.load.image('figureBroccolo', '/broccolo-figure.png');
    this.load.image('figureBreezer', '/breezer-figure.png');
    this.load.image('figureBrhulk', '/brhulk-figure.png');
    this.load.image('figureBrolverine', '/brolverine-figure.png');
    this.load.image('figureSpiderBro', '/spider-bro-figure.png');
    this.load.image('figureDeadbrool', '/deadbrool-figure.png');
    this.load.image('figureBromer', '/bromer-figure.png');
    this.load.image('figureBrusty', '/brusty-figure.png');
    this.load.image('figureBort', '/bort-figure.png');
    this.load.image('figureBrolhouse', '/brolhouse-figure.png');
    this.load.image('figureSpongeBrob', '/spongebrob-figure.png');
    

    // --- Sonidos del juego ---
    this.load.audio('bgm_game', '/music_game.mp3');
    this.load.audio('sfx_collect', '/collect.wav');
    this.load.audio('sfx_chili', '/chili.wav');
    this.load.audio('sfx_hit', '/hit.wav');
    this.load.audio('sfx_gameover', '/hit-1.wav');
    this.load.audio('sfx_rescue', '/rescue.mp3');

    // --- NUBES Y ROCAS ---
    this.load.image('nube1', '/nube1.png');
    this.load.image('nube2', '/nube2.png');
    this.load.image('nube3', '/nube3.png');
    this.load.image('rock1', '/rock1.png');
    this.load.image('rock2', '/rock2.png');

    // --- COLECCIONABLES ---
    this.load.image('banana', '/banana.png');
    this.load.image('chili', '/chili.png');

  }

  create() {

        // --- EFECTO DE APARECER DESDE NEGRO ---
        this.cameras.main.fadeIn(500, 0, 0, 0);

        // --- 1. GESTIÓN DE AUDIO (CROSSFADE SUAVE) ---
        const menuMusic = this.sound.get('bgm_menu');
        
        if (menuMusic && menuMusic.isPlaying) {
            this.tweens.add({
                targets: menuMusic,
                volume: 0,
                duration: 1000,
                onComplete: () => menuMusic.stop() 
            });
        }
    
        this.gameMusic = this.sound.add('bgm_game', { loop: true, volume: 0 });
        
    
        // --- 2. PREPARAR LOS NUEVOS EFECTOS ---
        this.collectSound = this.sound.add('sfx_collect', { volume: 0.8 });
        this.chiliSound = this.sound.add('sfx_chili', { volume: 0.8 });
        this.hitSound = this.sound.add('sfx_hit', { volume: 1.0 });
        this.gameOverSound = this.sound.add('sfx_gameover', { volume: 1.0 });
        this.rescueSound = this.sound.add('sfx_rescue', { volume: 1.0 });


    const width = this.scale.width;
    const height = this.scale.height;
    const centerX = width * 0.5;

    // Detectamos el idioma
    this.lang = localStorage.getItem('monkey_lang') || 'en';

    // -------- ESTADO (ÚNICO Y DEFINITIVO) --------
    this.isGameOver = false;
    this.hasRevived = false;  
    this.gameStarted = false;
    this.score = 0;
    this.scoreFloat = 0;
    this.level = 1;         // <--- Empezamos en el Nivel 1
    this.nextLevelScore = 2000; 
    this.gameSpeed = 330;   // <--- Un poco más rápido para darle ritmo
    this.isTurbo = false;
    this.hasBro = false;
    this.broObject = null;
    this.isInvulnerable = false;
    this.rocksActivated = false;
    this.totalBananas = parseInt(localStorage.getItem('monkey_bananas') || 0);
    this.sessionBananas = 0;
    

    // SPAWN
    this.spawnAccumulator = 0;
    this.nextSpawnDistance = 400; 

    this.narrowOffset = 25; 

    // --- FONDOS Y CICLO DÍA/NOCHE ---
    // 1. Capas del cielo
    this.skyBg = this.add.rectangle(centerX, height * 0.5, width, height, 0x2d9bf0).setDepth(-10);
    this.sunsetBg = this.add.rectangle(centerX, height * 0.5, width, height, 0xff7b00).setDepth(-9).setAlpha(0); // Atardecer oculto
    this.nightBg = this.add.rectangle(centerX, height * 0.5, width, height, 0x061423).setDepth(-8).setAlpha(0);  // Noche oculta

    // 2. Contenedor de estrellas (Oculto al empezar)
    this.starsContainer = this.add.container(0, 0).setDepth(-7).setAlpha(0);
    
    // Generar 40 estrellas que titilan de forma asíncrona
    for (let i = 0; i < 40; i++) {
        const star = this.add.circle(Phaser.Math.Between(0, width), Phaser.Math.Between(0, height), Phaser.Math.FloatBetween(1, 2), 0xffffff);
        this.tweens.add({ 
            targets: star, 
            alpha: Phaser.Math.FloatBetween(0.2, 0.8), 
            duration: Phaser.Math.Between(800, 2000), 
            yoyo: true, 
            repeat: -1 
        });
        this.starsContainer.add(star);
    }

    // 3. Preparar las nubes
    this.cloudTint = 0xffffff; // Color base de las nubes (Blanco puro)
    this.cloudsGroup = this.add.group();

    // Llenar el cielo de nubes desde el primer segundo
    for (let i = 0; i < 8; i++) {
        this.spawnCloud(true); 
    }
    
    // --- GESTIÓN DE SKIN EQUIPADA ---
    // Leemos qué skin elegiste en la tienda. Si no hay ninguna, usamos 'monkey'.
    const equippedSkin = localStorage.getItem('equipped_skin') || 'monkey';
    this.currentLeaderSkin = equippedSkin;

    this.webGraphics = this.add.graphics();
    this.webGraphics.setDepth(4); 

    // -------- ANIMACIONES --------
    // Creamos animación genérica para 'monkey', 'monkeyBro', 'broku', etc.
    // Como las animaciones dependen de la textura, las creamos dinámicamente si es necesario,
    // o simplemente usamos play con la textura correcta.
    
    if (!this.anims.exists('climb')) {
        this.anims.create({ key: 'climb', frames: this.anims.generateFrameNumbers('monkey', { start: 0, end: 4 }), frameRate: 10, repeat: -1 })
    }
    if (!this.anims.exists('climbBro')) {
      this.anims.create({ key: 'climbBro', frames: this.anims.generateFrameNumbers('monkeyBro', { start: 0, end: 4 }), frameRate: 10, repeat: -1 })
    }
    // Animación para BROKU
    if (!this.anims.exists('climbBroku')) {
        // Solo la crea si la textura 'broku' ha cargado
        if(this.textures.exists('broku')) {
            this.anims.create({ 
              key: 'climbBroku', 
              frames: this.anims.generateFrameNumbers('broku', { start: 0, end: 4 }), 
              frameRate: 10, 
              repeat: -1 });
        }
    }

    if (this.textures.exists('brogeta')) {
      if (!this.anims.exists('climbBrogeta')) {
          this.anims.create({ 
              key: 'climbBrogeta', 
              frames: this.anims.generateFrameNumbers('brogeta', { start: 0, end: 4 }), 
              frameRate: 10, 
              repeat: -1 
          });
      }
  }

  if (this.textures.exists('broccolo')) {
    if (!this.anims.exists('climbBroccolo')) {
        this.anims.create({ 
            key: 'climbBroccolo', 
            frames: this.anims.generateFrameNumbers('broccolo', { start: 0, end: 4 }), 
            frameRate: 10, 
            repeat: -1 
        });
    }
}
if (this.textures.exists('breezer')) {
    if (!this.anims.exists('climbBreezer')) {
        this.anims.create({ 
            key: 'climbBreezer', 
            frames: this.anims.generateFrameNumbers('breezer', { start: 0, end: 4 }), 
            frameRate: 10, 
            repeat: -1 
        });
    }
}
    if (this.textures.exists('brhulk')) {
      if (!this.anims.exists('climbBrhulk')) {
          this.anims.create({ 
              key: 'climbBrhulk', 
              frames: this.anims.generateFrameNumbers('brhulk', { start: 0, end: 4 }), 
              frameRate: 10, 
              repeat: -1 
          });
      }

      if (this.textures.exists('brolverine')) {
        if (!this.anims.exists('climbBrolverine')) {
            this.anims.create({ 
                key: 'climbBrolverine', 
                frames: this.anims.generateFrameNumbers('brolverine', { start: 0, end: 4 }), 
                frameRate: 10, 
                repeat: -1 
            });
        }
    }
  }
  if (this.textures.exists('spiderbro')) {
    if (!this.anims.exists('climbSpiderBro')) {
        this.anims.create({ 
            key: 'climbSpiderBro', 
            frames: this.anims.generateFrameNumbers('spiderbro', { start: 0, end: 4 }), 
            frameRate: 10, 
            repeat: -1 
        });
    }
}
    if (this.textures.exists('deadbrool')) {
        if (!this.anims.exists('climbDeadbrool')) {
            this.anims.create({ 
                key: 'climbDeadbrool', 
                frames: this.anims.generateFrameNumbers('deadbrool', { start: 0, end: 4 }), 
                frameRate: 10, 
                repeat: -1 
        });
    }
}
  if (this.textures.exists('bromer')) {
    if (!this.anims.exists('climbBromer')) {
        this.anims.create({ 
            key: 'climbBromer', 
            frames: this.anims.generateFrameNumbers('bromer', { start: 0, end: 4 }), 
            frameRate: 10, 
            repeat: -1 
        });
    }
}

if (this.textures.exists('brusty')) {
    if (!this.anims.exists('climbBrusty')) {
        this.anims.create({ 
            key: 'climbBrusty', 
            frames: this.anims.generateFrameNumbers('brusty', { start: 0, end: 4 }), 
            frameRate: 10, 
            repeat: -1 
        });
    }
}
if (this.textures.exists('bort')) {
    if (!this.anims.exists('climbBort')) {
        this.anims.create({ 
            key: 'climbBort', 
            frames: this.anims.generateFrameNumbers('bort', { start: 0, end: 4 }), 
            frameRate: 10, 
            repeat: -1 
        });
    }
}
if (this.textures.exists('brolhouse')) {
    if (!this.anims.exists('climbBrolhouse')) {
        this.anims.create({ 
            key: 'climbBrolhouse', 
            frames: this.anims.generateFrameNumbers('brolhouse', { start: 0, end: 4 }), 
            frameRate: 10, 
            repeat: -1 
        });
    }
}
if (this.textures.exists('spongebrob')) {
    if (!this.anims.exists('climbSpongeBrob')) {
        this.anims.create({ 
            key: 'climbSpongeBrob', 
            frames: this.anims.generateFrameNumbers('spongebrob', { start: 0, end: 4 }), 
            frameRate: 10, 
            repeat: -1 
        });
    }
  }

    if (!this.anims.exists('crawl')) {
      this.anims.create({ key: 'crawl', frames: this.anims.generateFrameNumbers('oruga', { start: 0, end: 1 }), frameRate: 4, repeat: -1 });
    }

    if (!this.anims.exists('crawl2')) {
        this.anims.create({ key: 'crawl2', frames: this.anims.generateFrameNumbers('oruga2', { start: 0, end: 1 }), frameRate: 4, repeat: -1 });
      }
    // --- ANIMACIONES ABEJA ---
    if (!this.anims.exists('beeLeft')) {
      this.anims.create({ key: 'beeLeft', frames: this.anims.generateFrameNumbers('abeja', { frames: [1, 2] }), frameRate: 10, repeat: -1 });
  }
  if (!this.anims.exists('beeRight')) {
      this.anims.create({ key: 'beeRight', frames: this.anims.generateFrameNumbers('abeja', { frames: [4, 5] }), frameRate: 10, repeat: -1 });
  }
    

    // --- TRONCOS ---
    this.troncoGroup = this.add.group();
    this.overlapAmount = 1; 
    this.calcDimensions(width);
    
    // Aumentamos de 5 a 6 troncos para ir sobrados por arriba
    for(let i = 0; i < 6; i++) {
        // Empujamos el tronco base (i=0) hasta el fondo del todo (height + 100px extra de seguridad)
        let yPos = (height + 100) - (i * (this.trunkHeight - this.overlapAmount));
        yPos = Math.round(yPos);
        
        let frameIndex = (i === 0) ? 7 : (i === 1) ? 6 : (i === 2) ? 5 : Phaser.Math.Between(0, 4);
        const tronco = this.add.sprite(centerX, yPos, 'troncosSheet', frameIndex);
        tronco.setScale(this.currentScale); 
        tronco.setDepth(1);
        this.troncoGroup.add(tronco);
    }

    // -------- JUGADOR (CON SKIN ELEGIDA) --------
    // Si la skin elegida no existe (ej: borraste la imagen), usa 'monkey' por seguridad
    const spriteKey = this.textures.exists(this.currentLeaderSkin) ? this.currentLeaderSkin : 'monkey';
    
    // Definir escala: Si es Brhulk usa 2.6 (Gigante), si no usa 2.0 (Normal)
    const startScale = (spriteKey === 'brhulk') ? 2.4 : 2.0; 
    
    // Aplicamos esa escala
    this.monkeySprite = this.add.sprite(0, 0, spriteKey).setScale(startScale);
    
    // Reproducir la animación correcta según la skin
    if (spriteKey === 'monkey') this.monkeySprite.play('climb');
    else if (spriteKey === 'monkeyBro') this.monkeySprite.play('climbBro');
    else if (spriteKey === 'broku') this.monkeySprite.play('climbBroku');
    else if (spriteKey === 'brogeta') this.monkeySprite.play('climbBrogeta');
    else if (spriteKey === 'broccolo') this.monkeySprite.play('climbBroccolo');
    else if (spriteKey === 'breezer') this.monkeySprite.play('climbBreezer');
    else if (spriteKey === 'brhulk') this.monkeySprite.play('climbBrhulk');
    else if (spriteKey === 'brolverine') this.monkeySprite.play('climbBrolverine');
    else if (spriteKey === 'spiderbro') this.monkeySprite.play('climbSpiderBro');
    else if (spriteKey === 'deadbrool') this.monkeySprite.play('climbDeadbrool');
    else if (spriteKey === 'bromer') this.monkeySprite.play('climbBromer');
    else if (spriteKey === 'brusty') this.monkeySprite.play('climbBrusty');
    else if (spriteKey === 'bort') this.monkeySprite.play('climbBort');
    else if (spriteKey === 'brolhouse') this.monkeySprite.play('climbBrolhouse');
    else if (spriteKey === 'spongebrob') this.monkeySprite.play('climbSpongeBrob');

    this.player = this.add.container(centerX, height * 0.75, [this.monkeySprite])
    this.physics.add.existing(this.player)
    this.player.body.setSize(30, 45)
    this.player.body.setOffset(-15, -22)
    this.player.setDepth(10)

    // -------- HUD RETRO PREMIUM --------
    // Fondo oscuro un pelín más intenso
    this.hudBar = this.add.rectangle(centerX, 30, width, 60, 0x000000).setAlpha(0.7).setDepth(100);
    // Finísima línea dorada para separar el menú del juego
    this.hudLine = this.add.rectangle(centerX, 60, width, 2, 0xffd700).setAlpha(0.8).setDepth(101); 

    // Estilo base para todos los textos del marcador
    const hudStyle = { fontSize: '22px', fontStyle: 'bold', fontFamily: 'Courier', stroke: '#000000', strokeThickness: 4 };

    // Textos alineados matemáticamente al centro vertical de la barra (Y: 30)
    this.scoreText = this.add.text(15, 30, '0m', { ...hudStyle, fill: '#ffffff' }).setOrigin(0, 0.5).setDepth(102);
    
    // Verde más "fósforo" tipo consola retro
    this.levelText = this.add.text(centerX, 30, 'Lv 1', { ...hudStyle, fill: '#00ffcc' }).setOrigin(0.5).setDepth(102);
    
    this.bananaText = this.add.text(width - 65, 30, '🍌 0', { ...hudStyle, fill: '#ffff00' }).setOrigin(1, 0.5).setDepth(102);
    
    // Botón de pausa en rojo clásico para que se vea claro que es una acción
    this.pauseBtn = this.add.text(width - 15, 30, '||', { ...hudStyle, fill: '#ff4444', fontSize: '24px' }).setOrigin(1, 0.5).setDepth(102).setInteractive();
    this.pauseBtn.on('pointerdown', () => this.pauseGame());

    // --- MENÚ DE PAUSA UI (Oculto al empezar) ---
    this.pauseGroup = this.add.group();
    
    // Fondo oscuro
    const pauseBg = this.add.rectangle(centerX, height * 0.5, width, height, 0x000000).setAlpha(0.8).setDepth(300).setInteractive(); // setInteractive bloquea clics detrás
    
    // Título PAUSED
    const t_pause = this.lang === 'es' ? 'PAUSA' : 'PAUSED';
    const pauseTitle = this.add.text(centerX, height * 0.3, 'PAUSED', { fontSize: '50px', fill: '#ffd700', fontStyle: 'bold', fontFamily: 'Courier', stroke: '#000', strokeThickness: 6 }).setOrigin(0.5).setDepth(301);

    // 1. Botón RESUME (Seguir jugando)
    const t_resume = this.lang === 'es' ? 'CONTINUAR' : 'RESUME';
    const resumeBtn = this.add.rectangle(centerX, height * 0.40, 220, 55, 0x2d9bf0).setInteractive().setDepth(301);
    const resumeText = this.add.text(centerX, height * 0.40, t_resume, { fontSize: '26px', fill: '#fff', fontStyle: 'bold', fontFamily: 'Courier' }).setOrigin(0.5).setDepth(302);
    const resumeAction = () => this.resumeGame();
    resumeBtn.on('pointerup', resumeAction); resumeText.on('pointerup', resumeAction);

    // 2. Botón RETRY (Empezar de nuevo)
    const t_retry = this.lang === 'es' ? 'REINTENTAR' : 'RETRY';
    const retryBtn = this.add.rectangle(centerX, height * 0.52, 220, 55, 0x2d9bf0).setInteractive().setDepth(301);
    const retryText = this.add.text(centerX, height * 0.52, t_retry, { fontSize: '26px', fill: '#fff', fontStyle: 'bold', fontFamily: 'Courier' }).setOrigin(0.5).setDepth(302);
    const retryAction = () => {
        if (this.gameMusic) this.gameMusic.stop(); // Paramos música actual
        this.scene.restart();
    };
    retryBtn.on('pointerup', retryAction); retryText.on('pointerup', retryAction);

    // 3. Botón QUIT (Menú principal)
    const t_quit = this.lang === 'es' ? 'SALIR' : 'QUIT';
    const quitBtn = this.add.rectangle(centerX, height * 0.64, 220, 55, 0xff4444).setInteractive().setDepth(301);
    const quitText = this.add.text(centerX, height * 0.64, t_quit, { fontSize: '26px', fill: '#fff', fontStyle: 'bold', fontFamily: 'Courier' }).setOrigin(0.5).setDepth(302);
    const quitAction = () => {
        if (this.gameMusic) this.gameMusic.stop(); // Paramos música
        this.scene.start('MainMenu');
    };
    quitBtn.on('pointerup', quitAction); quitText.on('pointerup', quitAction);

    // Agrupamos todo y lo ocultamos
    this.pauseGroup.addMultiple([pauseBg, pauseTitle, resumeBtn, resumeText, retryBtn, retryText, quitBtn, quitText]);
    this.pauseGroup.setVisible(false);
    this.isPaused = false;

    // -------- GRUPOS --------
    this.obstacles = this.physics.add.group(); 
    this.spiders = this.physics.add.group(); 
    this.bees = this.physics.add.group();  
    this.bananas = this.physics.add.group();
    this.chilis = this.physics.add.group();
    this.rocks = this.physics.add.group();
    this.broCollectibles = this.physics.add.group();

    // -------- COLISIONES --------
    this.physics.add.overlap(this.player, this.obstacles, () => this.hit());
    this.physics.add.overlap(this.player, this.spiders, () => this.hit()); 
    this.physics.add.overlap(this.player, this.bees, () => this.hit()); 
    this.physics.add.overlap(this.player, this.rocks, () => this.hit());
    this.physics.add.overlap(this.player, this.bananas, this.collectBanana, null, this);
    this.physics.add.overlap(this.player, this.chilis, this.collectChili, null, this);
    this.physics.add.overlap(this.player, this.broCollectibles, this.rescueBro, null, this);

    
   // --- TUTORIAL UI (ESTILO RETRO PREMIUM) ---
   const tutY = height - 90; 
   this.tutorialGroup = this.add.group();

   // 1. Carril oscuro sutil con bordes
   const trackBg = this.add.rectangle(centerX, tutY, width - 100, 16, 0x000000).setAlpha(0.4).setDepth(200);
   trackBg.setStrokeStyle(2, 0xffffff, 0.2); // Un bordecito blanco muy sutil

   // 2. Línea guía interior
   const line = this.add.rectangle(centerX, tutY, width - 140, 2, 0xffffff).setAlpha(0.3).setDepth(200);
   
   // 3. Flechas (Blancas y limpias)
   const leftArrows = this.add.text(50, tutY, '<<', { fontSize: '35px', fill: '#ffffff', fontStyle: 'bold', fontFamily: 'Courier' }).setOrigin(0.5).setDepth(200);
   const rightArrows = this.add.text(width - 50, tutY, '>>', { fontSize: '35px', fill: '#ffffff', fontStyle: 'bold', fontFamily: 'Courier' }).setOrigin(0.5).setDepth(200);
   
   // 4. Texto Pulsante (Amarillo Arcade con borde Negro grueso)
   const t_swipe = this.lang === 'es' ? 'DESLIZA PARA EMPEZAR' : 'SWIPE TO START';
   const tutText = this.add.text(centerX, tutY - 50, t_swipe, { 
       fontSize: '28px',
       fill: '#ffff00', 
       fontStyle: 'bold', 
       fontFamily: 'Courier',
       stroke: '#000000',     // Borde negro para máximo contraste
       strokeThickness: 8 
   }).setOrigin(0.5).setDepth(200);

   // Animación de Latido (Suave, más lento y sin desaparecer del todo)
   this.tweens.add({
       targets: tutText,
       alpha: { from: 1, to: 0.2 }, 
       duration: 800,        // Más lento (800ms en lugar de 500ms)
       yoyo: true,
       repeat: -1,
       ease: 'Sine.easeInOut' // Transición súper suave
   });

   // Animación de las flechas (se abren un poco hacia los lados suavemente)
   this.tweens.add({
       targets: [leftArrows, rightArrows],
       x: (target) => target === leftArrows ? 35 : width - 35,
       alpha: { from: 1, to: 0.3 },
       duration: 600,
       yoyo: true,
       repeat: -1,
       ease: 'Sine.easeInOut'
   });

   // 5. Botón deslizante (Estilo Joystick Arcade: Blanco y Rojo)
   const circleShadow = this.add.circle(centerX, tutY + 5, 20, 0x000000).setAlpha(0.5).setDepth(201); 
   const circleBorder = this.add.circle(centerX, tutY, 22, 0xffffff).setDepth(201); // Borde blanco limpio
   const circle = this.add.circle(centerX, tutY, 18, 0xe60000).setDepth(201);       // Rojo clásico arcade

   this.tutorialGroup.addMultiple([trackBg, line, leftArrows, rightArrows, tutText, circleShadow, circleBorder, circle]);

   // Animación del deslizador (Un poco más lenta y orgánica)
   this.tweens.add({
       targets: [circleShadow, circleBorder, circle],
       x: { from: centerX - 70, to: centerX + 70 },
       duration: 900, 
       yoyo: true, 
       repeat: -1, 
       ease: 'Quad.easeInOut' // Acelera y frena en los bordes suavemente
   });

   this.physics.pause();
   this.anims.pauseAll();

   // --- PRIMER TOQUE (EMPIEZA EL JUEGO) ---
// --- AUTO-PAUSA AL BLOQUEAR EL MÓVIL ---
this.game.events.on('hidden', () => {
    // Si el juego está corriendo y no estamos ya en la pantalla de Game Over
    if (this.gameStarted && !this.isGameOver && !this.isPaused) {
        this.pauseGame();
    }
}, this);

// Opcional pero recomendable: limpiar el evento al salir de la escena
// para que no se acumulen si el jugador entra y sale del nivel muchas veces.
this.events.on('shutdown', () => {
    this.game.events.off('hidden');
});

   this.input.once('pointerdown', () => {
       this.gameStarted = true;
       
       // ¡DESCONGELAR!
       this.physics.resume();
       this.anims.resumeAll();
       
       // Quitar el tutorial
       this.tutorialGroup.clear(true, true);
       
       // Empezar Música
       if (this.gameMusic) {
           this.gameMusic.play();
           this.tweens.add({ targets: this.gameMusic, volume: 0.4, duration: 1000 });
       }

       // --- PUNTO 6: GENERACIÓN POR DISTANCIA ---
       this.itemCounter = 0; 
       this.itemSpawnAccumulator = 0; // Medidor de distancia para objetos
       this.nextItemSpawnDistance = 600; // Un plátano cada 600 píxeles aprox.
       
       // Generar una nube nueva cada 2 o 4 segundos (Esta la dejamos por tiempo, es solo decorativa)
       this.time.addEvent({ delay: Phaser.Math.Between(2000, 4000), loop: true, callback: () => this.spawnCloud() });
       
   });
   // -------------------------------------

   this.scale.on('resize', this.resize, this);

  }

  calcDimensions(width) {
    // El árbol ocupará siempre el 75% del ancho de cualquier pantalla.
    // Le ponemos un tope de 450px para que en el iPad no parezca un muro gigante.
    const targetTreeWidth = Math.min(width * 0.88, 550); 
    
    this.currentScale = targetTreeWidth / 256; 
    this.trunkHeight = Math.floor(256 * this.currentScale);
    this.currentTreeVisualWidth = targetTreeWidth;
}

spawnCloud(randomY = false) {
    if (this.isGameOver) return; // <--- EL CANDADO (También para las nubes)
    
    const width = this.scale.width;
    const height = this.scale.height;
    
    // 1. Elegir una nube al azar
    const cloudKey = Phaser.Math.RND.pick(['nube1', 'nube2', 'nube3']);
    
    // 2. Coordenadas (randomY sirve para poblar la pantalla al empezar)
    const startX = Phaser.Math.Between(-50, width + 50);
    const startY = randomY ? Phaser.Math.Between(-100, height) : Phaser.Math.Between(-150, -50);

    // 3. Crear el sprite
    const cloud = this.add.image(startX, startY, cloudKey);
    
    // 4. Aplicar escala aleatoria para dar variedad
    cloud.setScale(Phaser.Math.FloatBetween(1.5, 3.5));
    cloud.setDepth(-5); // Detrás del árbol pero delante del cielo
    cloud.setAlpha(Phaser.Math.FloatBetween(0.5, 0.9)); // Medio transparentes
    
    // 5. Aplicarle el tinte de luz (Blanco de día, Naranja de tarde, Azul oscuro de noche)
    cloud.setTint(this.cloudTint); 
    
    // 6. ¡LA MAGIA PARALLAX! Cada nube se moverá a una velocidad distinta
    cloud.setData('parallaxSpeed', Phaser.Math.FloatBetween(0.40, 0.75));

    this.cloudsGroup.add(cloud);
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
    if (this.skyBg) {
        const cx = width * 0.5;
        const cy = height * 0.5;
        this.skyBg.setPosition(cx, cy).setSize(width, height);
        this.sunsetBg.setPosition(cx, cy).setSize(width, height);
        this.nightBg.setPosition(cx, cy).setSize(width, height);
    }
    if (this.hudBar) {
        this.hudBar.setPosition(width * 0.5, 30);
        this.hudBar.setSize(width, 60);
        if (this.hudLine) {
            this.hudLine.setPosition(width * 0.5, 60);
            this.hudLine.setSize(width, 2);
        }
        this.levelText.x = width * 0.5;
        this.bananaText.x = width - 65;
        this.pauseBtn.x = width - 15;
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
    if (!this.gameStarted || this.isPaused) return; // <--- AHORA BLOQUEA SI ESTÁ PAUSADO
    if (this.isGameOver) return;

    const width = this.scale.width;
    const centerX = width * 0.5;

    this.monkeySprite.anims.timeScale = this.gameSpeed / 300;
    if (this.hasBro && this.broObject) this.broObject.anims.timeScale = this.gameSpeed / 300; 
    
    this.broCollectibles.children.iterate(ball => { if (ball && ball.y > this.scale.height + 100) ball.destroy(); });

    const move = this.gameSpeed * (delta / 1000);
    this.troncoGroup.children.iterate((tronco) => { tronco.y += move; });
    // --- PARALLAX DE NUBES ---
    this.cloudsGroup.children.iterate((cloud) => {
        if (cloud) {
            cloud.y += move * cloud.getData('parallaxSpeed');
            // Reciclarla si sale de la pantalla por abajo
            if (cloud.y > this.scale.height + 150) cloud.destroy();
        }
    });
    this.realignTrunks();

    // === SPAWN DE ENEMIGOS POR DISTANCIA ===
    this.spawnAccumulator += move;
    if (this.spawnAccumulator >= this.nextSpawnDistance) {
        
        const roll = Phaser.Math.Between(0, 100);

        // Curva de dificultad que programamos:
        if (this.level < 3) {
            this.spawnOruga();
        } 
        else if (this.level === 3) {
            if (roll < 40) this.spawnSpider();
            else this.spawnOruga();
        } 
        else {
            if (roll < 30) this.spawnSpider();
            else if (roll < 60) this.spawnBee(); 
            else this.spawnOruga();
        }

        this.spawnAccumulator = 0;
        this.nextSpawnDistance = Phaser.Math.Between(300, 600); // Distancia aleatoria entre enemigos
    }

    // === SPAWN DE OBJETOS (BANANAS / CHILIS) POR DISTANCIA ===
    this.itemSpawnAccumulator += move;
    if (this.itemSpawnAccumulator >= this.nextItemSpawnDistance) {
        
        this.itemCounter++;
        // Cada 20 objetos instanciamos un Chili en lugar de una Banana
        if (this.itemCounter % 20 === 0) {
            this.spawnChili();
        } else {
            this.spawnBanana();
        }

        this.itemSpawnAccumulator = 0;
        this.nextItemSpawnDistance = Phaser.Math.Between(400, 800); // Distancia un poco aleatoria para que no se vea robótico
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

    // IA Abejas (Con GIRO SUAVE usando Frame 0) 🐝✨
    if (this.bees) {
      this.bees.getChildren().forEach((bee) => {
          // Siempre baja con el árbol
          bee.y += move; 

          // Si está girando, NO hacemos nada más (se queda quieta mirando de frente)
          if (bee.getData('isTurning')) return;

          // --- MOVIMIENTO NORMAL ---
          const dir = bee.getData('direction');
          const speed = bee.getData('speedX');
          
          if (dir && speed) {
              // Mover X
              bee.body.velocity.x = dir * speed;

              // Curva vertical (Péndulo)
              const offsetFromCenter = bee.x - bee.getData('patrolCenter');
              const curveHeight = Math.cos(offsetFromCenter / 40) * 3; 
              bee.y -= curveHeight; 
              
              // Inclinación
              bee.setRotation(bee.body.velocity.x * 0.002);

              // --- DETECCIÓN DE GIRO ---
              const currentX = bee.x;
              const center = bee.getData('patrolCenter');
              const range = bee.getData('patrolRange');

              // ¿Ha llegado al límite?
              if ((dir === 1 && currentX > center + range) || (dir === -1 && currentX < center - range)) {
                  
                  // 1. ACTIVAR MODO GIRO
                  bee.setData('isTurning', true);
                  bee.body.velocity.x = 0; // Frenar en seco
                  bee.setRotation(0);      // Ponerla recta
                  bee.anims.stop();        // Parar aleteo lateral
                  bee.setFrame(0);         // <--- ¡AQUÍ USAMOS EL FRAME DE FRENTE! 👀

                  // 2. ESPERAR UN POCO (200ms) Y CAMBIAR DIRECCIÓN
                  this.time.delayedCall(200, () => {
                      if (!bee.active) return; // Por si la matas justo en ese momento
                      
                      // Calcular nueva dirección
                      const newDir = (dir === 1) ? -1 : 1;
                      bee.setData('direction', newDir);
                      
                      // Arrancar de nuevo
                      if (newDir === 1) bee.play('beeRight');
                      else bee.play('beeLeft');
                      
                      bee.setData('isTurning', false); // Fin del giro
                  });
              }
          }

          if (bee.y > this.scale.height + 100) bee.destroy();
      });
  }

    // === LÓGICA DE ARAÑAS E HILOS ===
    this.webGraphics.clear(); 
    this.webGraphics.lineStyle(2, 0xffffff, 0.8); 

    this.spiders.children.iterate((spider) => {
        if (spider) {
            const currentAnchorY = spider.getData('anchorY') + move;
            spider.setData('anchorY', currentAnchorY);

            let yoyoOffset = spider.getData('yoyoOffset');
            let yoyoSpeed = spider.getData('yoyoSpeed');
            const yoyoState = spider.getData('yoyoState'); 

            if (yoyoState === 0) {
                if (spider.y > 50) {
                    spider.setData('yoyoState', 1); 
                    spider.setData('warningTimer', 0);
                }
            }
            else if (yoyoState === 1) {
                let timer = spider.getData('warningTimer');
                timer += delta;
                spider.setData('warningTimer', timer);
                if (Math.floor(timer / 150) % 2 === 0) spider.setFrame(0);
                else spider.setFrame(1);
                if (timer > 800) { 
                    spider.setData('yoyoState', 2);
                    spider.setData('yoyoSpeed', 12); 
                    spider.setFrame(2); 
                }
            }
            else if (yoyoState === 2) {
                yoyoOffset += yoyoSpeed;
                if (yoyoOffset >= 140) {
                    spider.setData('yoyoState', 3); 
                    spider.setData('yoyoSpeed', -3); 
                    spider.setFrame(0); 
                }
            }
            else if (yoyoState === 3) {
                yoyoOffset += yoyoSpeed;
                if (yoyoOffset <= 0) {
                    yoyoOffset = 0;
                    spider.setData('yoyoState', 0); 
                }
            }

            spider.setData('yoyoOffset', yoyoOffset);
            spider.y = currentAnchorY + yoyoOffset; 

            this.webGraphics.beginPath();
            this.webGraphics.moveTo(spider.x, currentAnchorY);
            this.webGraphics.lineTo(spider.x, spider.y - 15);
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

    // --- PUNTO 3: MARGEN DE SEGURIDAD HUD ---
    // Si el dedo está tocando la pantalla...
    if (this.input.activePointer.isDown) {
        
        // ...pero SOLO si está por debajo del botón de pausa (Y mayor que 90)
        if (this.input.activePointer.y > 90) {
            
            // --- PUNTO 2: MOVIMIENTO SÚPER FLUIDO ---
            // En lugar de teletransportar al mono, hacemos que se deslice suavemente 
            // hacia el dedo (eso arregla los saltos táctiles de móviles ajustados)
            const targetX = this.input.activePointer.x;
            this.player.x = Phaser.Math.Linear(this.player.x, targetX, 0.25); // 0.25 es la suavidad
        }
    }
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
    
    // Elegir aleatoriamente entre la oruga verde (oruga) y la roja/neón (oruga2)
    const orugaType = Phaser.Math.RND.pick(['oruga', 'oruga2']);
    
    const oruga = this.add.sprite(spawnX, -50, orugaType).setScale(1.5);
    this.physics.add.existing(oruga); 
    oruga.setDepth(5); 
    
    // Reproducir la animación correspondiente a la que ha tocado
    if (orugaType === 'oruga') {
        oruga.play('crawl');
    } else {
        oruga.play('crawl2');
    }
    oruga.body.setSize(25, 20); oruga.body.setOffset(7, 10);
    oruga.setData('startX', spawnX); oruga.setData('patrolRange', 40); oruga.setData('speedX', Phaser.Math.RND.pick([1, -1])); oruga.setFlipX(oruga.getData('speedX') < 0);
    this.obstacles.add(oruga);
  }

  spawnBee() {
    const centerX = this.scale.width * 0.5;
    const playableWidth = this.currentTreeVisualWidth - 40;
    const spawnX = centerX + Phaser.Math.Between(-playableWidth/3, playableWidth/3);
    
    // Crear sprite
    const bee = this.add.sprite(spawnX, -60, 'abeja').setScale(2);
    this.physics.add.existing(bee);
    bee.setDepth(6);
    bee.body.setCircle(12); 
    bee.body.setOffset(8, 8);

    // Datos de IA
    const startDir = Phaser.Math.RND.pick([1, -1]);
    bee.setData('direction', startDir);
    bee.setData('speedX', 100);
    bee.setData('patrolCenter', spawnX);
    bee.setData('patrolRange', 70);

    // Animación inicial segura
    if (startDir === 1) bee.play('beeRight');
    else bee.play('beeLeft');

    // Añadir al grupo (Importante)
    this.bees.add(bee);
  }

  spawnSpider() {
    const centerX = this.scale.width * 0.5;
    const playableWidth = this.currentTreeVisualWidth - 60;
    const spawnX = centerX + Phaser.Math.Between(-playableWidth/2, playableWidth/2);
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

  spawnBanana() { 
    const b = this.add.image(this.getSpawnX(), -50, 'banana').setScale(1.5); 
    this.physics.add.existing(b); 
    
    // Ajustamos la caja de colisión para que no sobre mucho espacio invisible
    b.body.setCircle(b.width * 0.4); 
    b.body.setOffset(b.width * 0.1, b.height * 0.1);
    
    b.setDepth(5); 
    this.bananas.add(b); 
    
    // Animación: Un latido suave y orgánico con un poco de rotación
    this.tweens.add({
        targets: b,
        scaleX: 1.7,
        scaleY: 1.7,
        angle: 10,
        duration: 600,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
    });
}

spawnChili() { 
    const c = this.add.image(this.getSpawnX(), -50, 'chili').setScale(1.5); 
    this.physics.add.existing(c); 
    
    c.body.setCircle(c.width * 0.4); 
    c.body.setOffset(c.width * 0.1, c.height * 0.1);
    c.setDepth(5); 
    this.chilis.add(c); 
    
    // Animación: Un latido más rápido y nervioso (¡es un Turbo!)
    this.tweens.add({
        targets: c,
        scaleX: 1.8,
        scaleY: 1.8,
        angle: -15,
        duration: 350,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
    });
}
  spawnRock() { 
    if (this.isGameOver) return; // <--- EL CANDADO ANTIA-APILAMIENTOS
    // 1. Elegir una textura de roca al azar
    const rockKey = Phaser.Math.RND.pick(['rock1', 'rock2']);
    
    // 2. Crear el sprite (le pongo escala 2.0 provisional, ajústala si la ves muy grande/pequeña)
    const r = this.add.image(this.getSpawnX(), -50, rockKey).setScale(2.0); 
    
    this.physics.add.existing(r); 
    
    // 3. Ajustar la caja de colisión para que sea un círculo (más justo a la imagen)
    r.body.setCircle(r.width * 0.4);
    r.body.setOffset(r.width * 0.1, r.height * 0.1);
    
    r.setDepth(5); 
    this.rocks.add(r); 
    
    // 4. ¡LA MAGIA! Añadir una rotación infinita para que caiga dando vueltas
    this.tweens.add({
        targets: r,
        angle: Phaser.Math.RND.pick([360, -360]), // Gira a derecha o izquierda al azar
        duration: Phaser.Math.Between(2000, 3000), // Velocidad de giro variable
        repeat: -1
    });
}
  spawnBroItem() {
    // 1. Si ya tienes compañero o ya hay uno en pantalla, no sacar nada
    if (this.hasBro || this.broCollectibles.getLength() > 0) return;

    // 2. OBTENER CANDIDATOS
    // Leemos los desbloqueados de la memoria
    const unlocked = JSON.parse(localStorage.getItem('unlocked_skins') || '["monkey"]');
    
    // Filtramos: Queremos a cualquiera MENOS al que lleva el jugador puesto ahora
    // (Ejemplo: Si llevas a Broku, pueden salir Monkey o MonkeyBro)
    const candidates = unlocked.filter(id => id !== this.currentLeaderSkin);

    // Si no hay candidatos (ej: solo tienes el mono básico), no spawneamos nada
    if (candidates.length === 0) return;

    // 3. ELECCIÓN ALEATORIA (Igualdad de Probabilidad)
    // Phaser.Math.RND.pick elige uno al azar del array con la misma probabilidad para todos
    const selectedSkinID = Phaser.Math.RND.pick(candidates);

    // 4. BUSCAR LA IMAGEN CORRECTA (La de estar sentado)
    // Buscamos en tu lista SKINS (la que está arriba del todo del archivo)
    // Nota: Asegúrate de que SKINS está accesible aquí. Si da error, define SKINS como variable global o expórtala.
    const skinData = SKINS.find(s => s.id === selectedSkinID);
    
    // Si encontramos datos usamos su imagen de tienda, si no, un fallback
    const figureImage = skinData ? skinData.shopImg : 'figureClimber';

    // 5. CREAR EL SPRITE
    const m = this.add.sprite(this.getSpawnX(), -50, figureImage).setScale(2.0);
    this.physics.add.existing(m);
    m.setDepth(5);
    
    // ¡IMPORTANTE! Guardamos quién es para saber en qué convertirse al rescatarlo
    m.setData('skin', selectedSkinID); 
    
    this.broCollectibles.add(m);
    m.body.setVelocityY(this.gameSpeed);
  }
  collectBanana(_, b) { 
    this.collectSound.play();
    b.destroy(); 
    this.sessionBananas++; this.totalBananas++; this.bananaText.setText('🍌 ' + this.sessionBananas); 
    localStorage.setItem('monkey_bananas', this.totalBananas); }
    collectChili(_, c) { 
        this.chiliSound.play();
        c.destroy(); 
        
        if (this.isTurbo) {
            // Si ya tenías chili, reseteamos el temporizador para que no se raye
            if (this.chiliTimer) this.chiliTimer.remove();
        } else {
            this.isTurbo = true; 
            const targetTurboSpeed = 700;
            this.speedBoost = Math.max(100, targetTurboSpeed - this.gameSpeed);
            this.gameSpeed += this.speedBoost; 
        }
  
        this.monkeySprite.setTint(0xff4500); 
        
        // Guardamos el temporizador en this.chiliTimer
        this.chiliTimer = this.time.delayedCall(2200, () => { 
            this.gameSpeed -= this.speedBoost; 
            this.monkeySprite.clearTint(); 
            this.isTurbo = false; 
        }); 
    }
  
  
  rescueBro(_, b) { 
    this.rescueSound.play();
    const s = b.getData('skin'); 
    b.destroy(); 
    
    if (this.hasBro) return; 
    
    this.hasBro = true; 
    
    // 1. ESCALA: Si es Brhulk lo ponemos gigante (2.4), si no normal (2.2 o 2.0)
    // Ajustamos escalas por defecto
    let scale = 2.0;
    if (s === 'brhulk') scale = 2.4;
    else if (['broku', 'brogeta', 'broccolo', 'brolverine'].includes(s)) scale = 2.2; 
    else scale = 2.0; // Monos normales

    // Crear el objeto
    this.broObject = this.add.sprite(this.player.x, this.player.y + 100, s).setScale(scale); 
    this.broObject.setDepth(9); 
    
    // 2. ANIMACIÓN: Elegir la correcta según quién sea
    if (s === 'broku' && this.anims.exists('climbBroku')) {
        this.broObject.play('climbBroku');
    } 
    else if (s === 'brogeta' && this.anims.exists('climbBrogeta')) {
        this.broObject.play('climbBrogeta');
    }
    else if (s === 'broccolo' && this.anims.exists('climbBroccolo')) { 
        this.broObject.play('climbBroccolo');
    }
    else if (s === 'breezer' && this.anims.exists('climbBreezer')) { 
        this.broObject.play('climbBreezer');
    }
    else if (s === 'monkeyBro') {
        this.broObject.play('climbBro');
    } 
    else if (s === 'brhulk' && this.anims.exists('climbBrhulk')) { 
        this.broObject.play('climbBrhulk');
    } 
    else if (s === 'brolverine' && this.anims.exists('climbBrolverine')) {
        this.broObject.play('climbBrolverine');
    }
    else if (s === 'spiderbro' && this.anims.exists('climbSpiderBro')) {
        this.broObject.setScale(2.2); 
        this.broObject.play('climbSpiderBro');
    }
    else if (s === 'deadbrool' && this.anims.exists('climbDeadbrool')) {
        this.broObject.setScale(2.2); 
        this.broObject.play('climbDeadbrool');
    }

    else if (s === 'bromer' && this.anims.exists('climbBromer')) {
      this.broObject.setScale(2.2); 
      this.broObject.play('climbBromer');
    }
    else if (s === 'brusty' && this.anims.exists('climbBrusty')) {
    this.broObject.setScale(2.2); 
    this.broObject.play('climbBrusty');
    }
    
    else if (s === 'bort' && this.anims.exists('climbBort')) {
        this.broObject.setScale(2.0); // Tamaño estándar (o 1.8 si lo quieres más bajito)
        this.broObject.play('climbBort');
    }
    else if (s === 'brolhouse' && this.anims.exists('climbBrolhouse')) {
        this.broObject.setScale(2.0); // Tamaño estándar (o 1.8 si lo quieres más bajito)
        this.broObject.play('climbBrolhouse');
    }
    else if (s === 'spongebrob' && this.anims.exists('climbSpongeBrob')) {
        this.broObject.setScale(2.2); 
        this.broObject.play('climbSpongeBrob');
    }
    
    else {
        // Fallback: Mono normal
        this.broObject.play('climb');
    }
  }
  
  levelUp() { 
    this.level++; 
    const maxLv = parseInt(localStorage.getItem('monkey_max_level') || 1);
    if (this.level > maxLv) localStorage.setItem('monkey_max_level', this.level);
    
    this.nextLevelScore += 2000;
    this.levelText.setText('Lv ' + this.level); 
    // --- CURVA DE VELOCIDAD CONTROLADA ---
    if (this.level <= 4) {
        // En los primeros niveles, sube 25 puntos
        this.gameSpeed += 25; 
    } else if (this.level <= 8) {
        // A partir del nivel 5, solo sube 10 puntos (ya va rápido, no queremos pasarnos)
        this.gameSpeed += 10; 
    } else {
        // En niveles altísimos (9+), apenas sube 2 puntitos para mantener la tensión sin volverse loco
        this.gameSpeed += 2;  
    }
    
    const t = this.add.text(this.scale.width*0.5, this.scale.height*0.5, `LEVEL ${this.level}`, { fontSize: '60px', fill: '#fff', stroke: '#000', strokeThickness: 6 }).setOrigin(0.5).setDepth(200); 
    this.time.delayedCall(500, () => t.destroy()); 
    
    if (this.level === 5 && !this.rocksActivated) { 
        this.rocksActivated = true; 
        this.time.addEvent({ delay: 2000, loop: true, callback: () => this.spawnRock() }); 
    } 
    // --- PUNTO 1: UN COMPAÑERO CADA 2 NIVELES ---
    // Si el nivel es par (2, 4, 6...), no tienes compañero, y no hay ya un ítem cayendo en pantalla:
    if (this.level % 2 === 0 && !this.hasBro && this.broCollectibles.getLength() === 0) {
        this.spawnBroItem();
    }

    // ==========================================
      // --- MAGIA: TRANSICIÓN RÁPIDA A LA NOCHE (NIVEL 5) ---
      // ==========================================
      if (this.level === 5) {
          
        // FASE 1: Entra el atardecer naranja (Dura 1,5 segundos)
        this.cloudTint = 0xffccaa; 
        this.cloudsGroup.children.iterate(c => c.setTint(this.cloudTint));
        this.tweens.add({ targets: this.sunsetBg, alpha: 0.8, duration: 1500 }); 
        
        // FASE 2: Justo a los 1 segundos, cruzamos a la Noche y salen las estrellas
        this.time.delayedCall(1000, () => {
            this.cloudTint = 0x555577; // Nubes oscuras
            this.cloudsGroup.children.iterate(c => c.setTint(this.cloudTint));
            
            // Se apaga el naranja y se enciende el azul oscuro a la vez
            this.tweens.add({ targets: this.sunsetBg, alpha: 0, duration: 2000 }); 
            this.tweens.add({ targets: this.nightBg, alpha: 1, duration: 2000 });
            
            // Las estrellas aparecen brillando junto con la noche
            this.tweens.add({ targets: this.starsContainer, alpha: 1, duration: 2000 });
        });
      } // <--- ¡AQUÍ CERRAMOS EL NIVEL 5!

      // ==========================================
      // --- MAGIA: AMANECER (NIVEL 10) ---
      // ==========================================
      if (this.level === 10) {
          
        // FASE 1: Se van las estrellas, desaparece la noche y entra el naranja del amanecer
        this.cloudTint = 0xffccaa; 
        this.cloudsGroup.children.iterate(c => c.setTint(this.cloudTint));
        
        this.tweens.add({ targets: this.starsContainer, alpha: 0, duration: 2000 }); 
        this.tweens.add({ targets: this.nightBg, alpha: 0, duration: 2000 });        
        this.tweens.add({ targets: this.sunsetBg, alpha: 0.8, duration: 2000 });     
        
        // FASE 2: A los 2 segundos, el naranja se desvanece dejando el cielo azul brillante
        this.time.delayedCall(2000, () => {
            this.cloudTint = 0xffffff; 
            this.cloudsGroup.children.iterate(c => c.setTint(this.cloudTint));
            
            this.tweens.add({ targets: this.sunsetBg, alpha: 0, duration: 2000 }); 
        });
      }
    }
  
    hit() {
        if (this.isInvulnerable) return;
        
        if (this.hasBro && this.broObject) {
          this.hitSound.play();
          this.hasBro = false; 
          this.cameras.main.flash(300, 255, 255, 255);
          
          // Cambio de skin al ser golpeado (el bro toma el relevo)
          this.currentLeaderSkin = this.broObject.texture.key; 
          this.monkeySprite.setTexture(this.currentLeaderSkin);
    
          if (this.currentLeaderSkin === 'brhulk') this.monkeySprite.setScale(2.6);
          else this.monkeySprite.setScale(2.0);
          
          // Reproducir animación correcta
          if (this.currentLeaderSkin === 'broku') this.monkeySprite.play('climbBroku');
          else if (this.currentLeaderSkin === 'monkeyBro') this.monkeySprite.play('climbBro');
          else if (this.currentLeaderSkin === 'monkey') this.monkeySprite.play('climb'); 
          else if (this.currentLeaderSkin === 'brhulk') this.monkeySprite.play('climbBrhulk');
          else if (this.currentLeaderSkin === 'brolverine') { this.monkeySprite.play('climbBrolverine'); this.monkeySprite.setScale(2.2); }
          else if (this.currentLeaderSkin === 'spiderbro') { this.monkeySprite.play('climbSpiderBro'); this.monkeySprite.setScale(2.2); }
          else if (this.currentLeaderSkin === 'deadbrool') { this.monkeySprite.play('climbDeadbrool'); this.monkeySprite.setScale(2.2); }
          else if (this.currentLeaderSkin === 'brogeta') { this.monkeySprite.play('climbBrogeta'); this.monkeySprite.setScale(2.2); }
          else if (this.currentLeaderSkin === 'broccolo') { this.monkeySprite.play('climbBroccolo'); this.monkeySprite.setScale(2.2); }
          else if (this.currentLeaderSkin === 'breezer') { this.monkeySprite.play('climbBreezer'); this.monkeySprite.setScale(2.2); }
          else if (this.currentLeaderSkin === 'bromer') { this.monkeySprite.play('climbBromer'); this.monkeySprite.setScale(2.2); }
          else if (this.currentLeaderSkin === 'brusty') { this.monkeySprite.play('climbBrusty'); this.monkeySprite.setScale(2.2); }
          else if (this.currentLeaderSkin === 'bort') { this.monkeySprite.play('climbBort'); this.monkeySprite.setScale(2.0); }
          else if (this.currentLeaderSkin === 'brolhouse') { this.monkeySprite.play('climbBrolhouse'); this.monkeySprite.setScale(2.0); }
          else if (this.currentLeaderSkin === 'spongebrob') { this.monkeySprite.play('climbSpongeBrob'); this.monkeySprite.setScale(2.0); }
    
          this.player.x = this.broObject.x; 
          this.player.y = this.broObject.y;
          this.broObject.destroy(); 
          this.broObject = null;
          
          this.isInvulnerable = true; 
          
          // EFECTO REAL DE PARPADEO (Obliga a limpiar el estado)
          this.player.setAlpha(1);
          if (this.hitTween) this.hitTween.stop();
          this.hitTween = this.tweens.add({
              targets: this.player,
              alpha: 0.2,
              duration: 150,
              yoyo: true,
              repeat: 5 // Parpadea rápido durante el 1.5s
          });
    
          this.tweens.add({ targets: this.player, y: this.scale.height * 0.75, duration: 300, ease: 'Power2' });
          
          this.time.delayedCall(1500, () => { 
              this.isInvulnerable = false; 
              this.player.setAlpha(1); 
          });
          
          return; 
        }
        
        this.triggerGameOver('GAME OVER!');
      }

  pauseGame() {
    // Si el tutorial no ha acabado o si ya estás muerto, no se puede pausar
    if (!this.gameStarted || this.isGameOver || this.isPaused) return;
    
    this.isPaused = true;
    this.physics.pause();
    this.anims.pauseAll();
    
    // --- LA SOLUCIÓN ---
    // Congelamos el reloj creador de objetos y los latidos/rotaciones
    this.time.paused = true;
    this.tweens.pauseAll();
    
    // Pausar música suavemente
    if (this.gameMusic && this.gameMusic.isPlaying) {
        this.gameMusic.pause();
    }
    
    this.pauseGroup.setVisible(true);
}

resumeGame() {
    if (!this.isPaused) return;
    
    this.isPaused = false;
    this.physics.resume();
    this.anims.resumeAll();
    
    // --- LA SOLUCIÓN ---
    // Descongelamos el reloj y los latidos
    this.time.paused = false;
    this.tweens.resumeAll();
    
    // Reanudar música
    if (this.gameMusic && this.gameMusic.isPaused) {
        this.gameMusic.resume();
    }
    
    this.pauseGroup.setVisible(false);
}

triggerGameOver(text) {
    if (this.isGameOver) return;

    this.gameOverSound.play();
    if (this.gameMusic) this.gameMusic.stop();

    // --- CONGELAR EL JUEGO AL 100% ---
    this.isGameOver = true; 
    this.physics.pause();        
    
    this.monkeySprite.stop();
    this.obstacles.children.iterate(o => { if (o && o.anims) o.stop(); });
    this.spiders.children.iterate(s => { if (s && s.anims) s.stop(); });
    this.bees.children.iterate(b => { if (b && b.anims) b.stop(); });

    // --- GUARDAR PUNTUACIONES ---
    const best = parseInt(localStorage.getItem('monkey_highscore') || 0);
    if (this.score > best) localStorage.setItem('monkey_highscore', this.score);
    localStorage.setItem('monkey_bananas', this.totalBananas);

    // --- MEDIDAS Y GRUPO DE UI ---
    // Metemos todo en un array para poder "destruirlo" y limpiar la pantalla si decide revivir
    this.gameOverUI = []; 

    const w = this.scale.width; 
    const h = this.scale.height; 
    const cx = w * 0.5; 
    const cy = h * 0.5;

    const ov = this.add.rectangle(cx, cy, w, h, 0x000000).setAlpha(0.8).setDepth(999);
    
    const titleText = this.add.text(cx, cy - 120, text, { 
        fontSize: '45px', fill: '#ff4444', fontStyle: 'bold', stroke: '#000', strokeThickness: 6, fontFamily: 'Courier'
    }).setOrigin(0.5).setDepth(1000);

    const t_score = this.lang === 'es' ? 'Puntos' : 'Score';
    const scoreTextObj = this.add.text(cx, cy - 50, `${t_score}: ${this.score}m`, { 
        fontSize: '28px', fill: '#ffffff', fontStyle: 'bold', fontFamily: 'Courier' 
    }).setOrigin(0.5).setDepth(1000);
    
    const sessionBananasText = this.add.text(cx, cy - 10, `Bananas: ${this.sessionBananas} 🍌`, { 
        fontSize: '28px', fill: '#ffff00', fontStyle: 'bold', fontFamily: 'Courier' 
    }).setOrigin(0.5).setDepth(1000);

    this.gameOverUI.push(ov, titleText, scoreTextObj, sessionBananasText);

    // =========================================================
        // --- LÓGICA DE BOTONES APILADOS DINÁMICAMENTE ---
        // =========================================================
        let btnY = cy + 55; 

        // Usamos setTimeout puro para que no se congele el candado táctil
        let canClick = false;
        setTimeout(() => { canClick = true; }, 800);

        // Bandera maestra para bloquear acciones simultáneas
        let isAdPlaying = false; 

        // Variables fuera de los IF para poder apagarse el uno al otro
        let revBtn = null, revText = null, revTween = null;
        let adBtn = null, adText = null, adTween = null;

        // 1. BOTÓN REVIVIR (Solo sale 1 vez por partida)
        if (!this.hasRevived) {
            const t_revive = this.lang === 'es' ? '¡REVIVIR! 📺' : 'REBORN! 📺';
            revBtn = this.add.rectangle(cx, btnY, 300, 60, 0x2ca02c).setInteractive().setDepth(1000); 
            revBtn.setStrokeStyle(4, 0xffffff);
            revText = this.add.text(cx, btnY, t_revive, { fontSize: '26px', fill: '#ffffff', fontStyle: 'bold', fontFamily: 'Courier' }).setOrigin(0.5).setInteractive().setDepth(1001);
            
            revTween = this.tweens.add({ targets: [revBtn, revText], scaleX: 1.08, scaleY: 1.08, duration: 400, yoyo: true, repeat: -1, ease: 'Quad.easeInOut' });

            const reviveAction = () => {
                if (!canClick || isAdPlaying) return; 
                isAdPlaying = true; 

                revBtn.disableInteractive(); revText.disableInteractive(); revTween.stop();
                revBtn.setScale(1); revBtn.setFillStyle(0xaaaaaa); revBtn.setStrokeStyle(0);
                revText.setText(this.lang === 'es' ? 'CARGANDO...' : 'LOADING...');

                // Apagamos visualmente el botón de bananas si estaba en pantalla
                if (adBtn) {
                    adBtn.disableInteractive(); adText.disableInteractive();
                    if (adTween) adTween.stop();
                    adBtn.setScale(1); adBtn.setFillStyle(0x333333); adBtn.setStrokeStyle(0); adText.setFill('#555555');
                }

                // SIMULACIÓN DE ANUNCIO DE REVIVIR
                setTimeout(() => {
                    this.hasRevived = true;
                    
                    // Limpieza segura (el if(el) evita crasheos invisibles)
                    this.gameOverUI.forEach(el => { if (el) el.destroy(); });

                    this.player.x = cx;
                    this.player.y = h * 0.75;
                    this.isInvulnerable = true;
                    
                    this.tweens.add({ targets: this.player, alpha: 0.2, duration: 200, yoyo: true, repeat: 8 });
                    setTimeout(() => { this.isInvulnerable = false; this.player.setAlpha(1); }, 3500);

                    this.isGameOver = false;
                    this.physics.resume();
                    if (this.gameMusic) this.gameMusic.play();
                    
                    const currentAnim = this.monkeySprite.anims.currentAnim ? this.monkeySprite.anims.currentAnim.key : 'climb';
                    this.monkeySprite.play(currentAnim);
                    this.obstacles.children.iterate(o => { if (o && o.anims) o.resume(); });
                    this.spiders.children.iterate(s => { if (s && s.anims) s.resume(); });
                    this.bees.children.iterate(b => { if (b && b.anims) b.resume(); });

                }, 2000);
            };
            revBtn.on('pointerup', reviveAction); revText.on('pointerup', reviveAction);
            this.gameOverUI.push(revBtn, revText);
            
            btnY += 75; 
        }

        // 2. BOTÓN X2 BANANAS
        if (this.sessionBananas > 0) {
            const t_ad = this.lang === 'es' ? '¡BANANAS X2! 📺' : 'BANANAS X2! 📺';
            adBtn = this.add.rectangle(cx, btnY, 300, 60, 0xffd700).setInteractive().setDepth(1000); 
            adBtn.setStrokeStyle(4, 0xffffff);
            adText = this.add.text(cx, btnY, t_ad, { fontSize: '26px', fill: '#000000', fontStyle: 'bold', fontFamily: 'Courier' }).setOrigin(0.5).setInteractive().setDepth(1001);

            if (this.hasRevived) {
                adTween = this.tweens.add({ targets: [adBtn, adText], scaleX: 1.10, scaleY: 1.10, duration: 400, yoyo: true, repeat: -1, ease: 'Quad.easeInOut' });
            }

            const showAdFunc = () => {
                if (!canClick || isAdPlaying) return; 
                isAdPlaying = true; 

                adBtn.disableInteractive(); adText.disableInteractive(); 
                if (adTween) adTween.stop();
                adBtn.setScale(1); adBtn.setFillStyle(0xaaaaaa); adBtn.setStrokeStyle(0);
                adText.setText(this.lang === 'es' ? 'CARGANDO...' : 'LOADING...');

                // --- LA PENALIZACIÓN --- 
                // Al elegir doblar dinero, quemamos su oportunidad de revivir
                this.hasRevived = true; 

                // Apagamos el botón de revivir para que sepa que ha perdido la opción
                if (revBtn) {
                    revBtn.disableInteractive(); revText.disableInteractive();
                    if (revTween) revTween.stop();
                    revBtn.setScale(1); revBtn.setFillStyle(0x333333); revBtn.setStrokeStyle(0); revText.setFill('#555555');
                }

                // SIMULACIÓN DE ANUNCIO DE BANANAS
                setTimeout(() => {
                    this.totalBananas += this.sessionBananas; 
                    this.sessionBananas *= 2; 
                    localStorage.setItem('monkey_bananas', this.totalBananas);
                    
                    this.cameras.main.flash(400, 255, 255, 0); 
                    sessionBananasText.setText(`Bananas: ${this.sessionBananas} 🍌`);
                    this.tweens.add({ targets: sessionBananasText, scaleX: 1.5, scaleY: 1.5, duration: 300, yoyo: true });
                    
                    adBtn.setFillStyle(0x2ca02c); 
                    adText.setFill('#ffffff');
                    adText.setText(this.lang === 'es' ? '¡CONSEGUIDO!' : 'ALRIGHT!');

                    // Liberamos los botones secundarios por si quiere salir o reintentar
                    isAdPlaying = false;
                }, 2000);
            };
            adBtn.on('pointerup', showAdFunc); adText.on('pointerup', showAdFunc);
            this.gameOverUI.push(adBtn, adText);
            
            btnY += 75; 
        }

        // 3. BOTONES SECUNDARIOS (Replay y Menú)
        
        const t_replay = this.lang === 'es' ? 'JUGAR DE NUEVO' : 'REPLAY';
        const rb = this.add.rectangle(cx, btnY + 10, 240, 45, 0x1a7bc0).setInteractive().setDepth(1000);
        const rt = this.add.text(cx, btnY + 10, t_replay, { fontSize: '20px', fill: '#ddd', fontStyle: 'bold', fontFamily: 'Courier' }).setOrigin(0.5).setInteractive().setDepth(1001);
        
        const rbDown = () => { if (!canClick || isAdPlaying) return; rb.setScale(0.95); rt.setScale(0.95); rb.setFillStyle(0x115585); };
        const rbUp = () => { if (!canClick || isAdPlaying) return; rb.setScale(1); rt.setScale(1); rb.setFillStyle(0x1a7bc0); };
        
        rb.on('pointerdown', rbDown); rt.on('pointerdown', rbDown); rb.on('pointerout', rbUp); rt.on('pointerout', rbUp); 
        
        const rf = () => { if (!canClick || isAdPlaying) return; rbUp(); this.scene.restart(); };
        rb.on('pointerup', rf); rt.on('pointerup', rf);

        const t_menu = this.lang === 'es' ? 'SALIR AL MENÚ' : 'BACK TO MENU';
        const mb = this.add.rectangle(cx, btnY + 70, 240, 45, 0x555555).setInteractive().setDepth(1000);
        const mt = this.add.text(cx, btnY + 70, t_menu, { fontSize: '20px', fill: '#bbb', fontStyle: 'bold', fontFamily: 'Courier' }).setOrigin(0.5).setInteractive().setDepth(1001);
        
        const mbDown = () => { if (!canClick || isAdPlaying) return; mb.setScale(0.95); mt.setScale(0.95); mb.setFillStyle(0x333333); };
        const mbUp = () => { if (!canClick || isAdPlaying) return; mb.setScale(1); mt.setScale(1); mb.setFillStyle(0x555555); };
        
        mb.on('pointerdown', mbDown); mt.on('pointerdown', mbDown); mb.on('pointerout', mbUp); mt.on('pointerout', mbUp);
        
        const mf = () => { if (!canClick || isAdPlaying) return; mbUp(); this.scene.start('MainMenu'); };
        mb.on('pointerup', mf); mt.on('pointerup', mf);
        
        this.gameOverUI.push(rb, rt, mb, mt);
    }} // <--- Cierre de triggerGameOver

// ================== CONFIG ==================
const config = {
    type: Phaser.AUTO, 
    backgroundColor: '#2d9bf0', 
    pixelArt: true, 
    roundPixels: true,
    scale: { 
        mode: Phaser.Scale.RESIZE, // <--- VOLVEMOS A PANTALLA COMPLETA 100% (Sin cajas ni bandas)
        width: '100%',
        height: '100%'
    },
    physics: { default: 'arcade', arcade: { gravity: { y: 0 }, debug: false } },
    scene: [SplashScene, MainMenu, ShopScene, GameScene]
  };
  new Phaser.Game(config);