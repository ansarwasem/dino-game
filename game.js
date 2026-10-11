/**
 * 🦖 Dino Run Adventure - Super Fun Dinosaur Web Game for Kids!
 * Designed with love, vibrant colors, procedural Web Audio, and joyful juice!
 */

// ==========================================
// 1. SOUND SYNTHESIZER (Web Audio API)
// ==========================================
class SoundSynth {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.bgMusicTimer = null;
    this.bgStep = 0;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playTone(freq, type = 'sine', duration = 0.15, gainVal = 0.1, pitchSweep = null) {
    if (!this.enabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      if (pitchSweep) {
        osc.frequency.exponentialRampToValueAtTime(pitchSweep, this.ctx.currentTime + duration);
      }
      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      // Audio not permitted or interrupted
    }
  }

  playJump() {
    this.init();
    if (!this.enabled || !this.ctx) return;
    this.playTone(280, 'triangle', 0.18, 0.12, 600);
  }

  playDuck() {
    this.init();
    if (!this.enabled || !this.ctx) return;
    this.playTone(320, 'sine', 0.1, 0.08, 200);
  }

  playCoin() {
    this.init();
    if (!this.enabled || !this.ctx) return;
    this.playTone(660, 'sine', 0.08, 0.1);
    setTimeout(() => this.playTone(980, 'sine', 0.12, 0.1), 80);
  }

  playPowerup() {
    this.init();
    if (!this.enabled || !this.ctx) return;
    const notes = [440, 554, 659, 880];
    notes.forEach((freq, idx) => {
      setTimeout(() => this.playTone(freq, 'triangle', 0.15, 0.15), idx * 70);
    });
  }

  playHit() {
    this.init();
    if (!this.enabled || !this.ctx) return;
    this.playTone(220, 'sawtooth', 0.22, 0.15, 90);
  }

  playGameOver() {
    this.init();
    if (!this.enabled || !this.ctx) return;
    const notes = [392, 349, 329, 261];
    notes.forEach((freq, idx) => {
      setTimeout(() => this.playTone(freq, 'triangle', 0.25, 0.12), idx * 120);
    });
  }

  startBgMusic() {
    if (!this.enabled) return;
    this.stopBgMusic();
    const melody = [
      261.63, 329.63, 392.00, 523.25,
      392.00, 329.63, 440.00, 392.00,
      349.23, 392.00, 440.00, 392.00,
      329.63, 293.66, 261.63, 329.63
    ];
    this.bgStep = 0;
    this.bgMusicTimer = setInterval(() => {
      if (this.enabled && this.ctx && this.ctx.state === 'running') {
        const note = melody[this.bgStep % melody.length];
        this.playTone(note, 'sine', 0.12, 0.035);
        this.bgStep++;
      }
    }, 280);
  }

  stopBgMusic() {
    if (this.bgMusicTimer) {
      clearInterval(this.bgMusicTimer);
      this.bgMusicTimer = null;
    }
  }
}

// ==========================================
// 2. CHARACTER DEFINITIONS
// ==========================================
const DINOS = [
  {
    id: 'rexy',
    name: 'Rexy',
    role: 'Green Hero 🦖',
    skin: '#4caf50',
    belly: '#a5d6a7',
    spikes: '#ff9800',
    eye: '#2e7d32',
    hat: '⭐',
    description: 'Chust aur taqatwar! Bhaagne me sab se aage!'
  },
  {
    id: 'spiky',
    name: 'Spiky',
    role: 'Golden Stego 🦕',
    skin: '#ffca28',
    belly: '#fff59d',
    spikes: '#f44336',
    eye: '#f57f17',
    hat: '👑',
    description: 'Pyaara golden dost! Hamesha muskurata hai!'
  },
  {
    id: 'pip',
    name: 'Pip',
    role: 'Pink Sweetie 🦩',
    skin: '#ff69b4',
    belly: '#f8bbd0',
    spikes: '#ba68c8',
    eye: '#c2185b',
    hat: '🌸',
    description: 'Cotton candy jesa pyara! Unchi chhalaang lagata hai!'
  },
  {
    id: 'bubbles',
    name: 'Bubbles',
    role: 'Aqua Ocean 🐬',
    skin: '#00bcd4',
    belly: '#b2ebf2',
    spikes: '#3f51b5',
    eye: '#00838f',
    hat: '🫧',
    description: 'Thanda thanda cool dino! Pani ki tarah tezz!'
  }
];

// ==========================================
// 3. GAME ENVIRONMENT THEMES
// ==========================================
const THEMES = [
  {
    name: 'Sunny Valley',
    skyTop: '#4fc3f7',
    skyBottom: '#b3e5fc',
    ground: '#7cb342',
    groundSub: '#558b2f',
    cloudColor: '#ffffff',
    sunColor: '#ffee58',
    hillFar: '#81c784',
    hillNear: '#aed581'
  },
  {
    name: 'Sunset Magic',
    skyTop: '#ff7043',
    skyBottom: '#ffcc80',
    ground: '#e64a19',
    groundSub: '#bf360c',
    cloudColor: '#ffe0b2',
    sunColor: '#ffca28',
    hillFar: '#d84315',
    hillNear: '#f4511e'
  },
  {
    name: 'Candy Dream',
    skyTop: '#ab47bc',
    skyBottom: '#f8bbd0',
    ground: '#ec407a',
    groundSub: '#c2185b',
    cloudColor: '#f3e5f5',
    sunColor: '#f06292',
    hillFar: '#ba68c8',
    hillNear: '#ce93d8'
  },
  {
    name: 'Starlight Space',
    skyTop: '#1a237e',
    skyBottom: '#3949ab',
    ground: '#283593',
    groundSub: '#1a237e',
    cloudColor: '#9fa8da',
    sunColor: '#fff59d',
    hillFar: '#303f9f',
    hillNear: '#3f51b5'
  }
];

// ==========================================
// 4. MAIN GAME ENGINE
// ==========================================
class DinoGame {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.sound = new SoundSynth();

    // Game state
    this.state = 'START'; // 'START', 'PLAYING', 'GAMEOVER'
    this.score = 0;
    this.highScore = parseInt(localStorage.getItem('dino_highscore') || '0', 10);
    this.coins = 0;
    this.speed = 6;
    this.baseSpeed = 6;
    this.distance = 0;
    this.currentThemeIndex = 0;
    this.selectedDino = DINOS[0];
    this.difficulty = 'baby'; // 'baby' | 'kids' | 'turbo'
    this.maxHearts = 5;
    this.hearts = 5;

    // Player Dino
    this.groundY = 360;
    this.dino = {
      x: 80,
      y: this.groundY - 60,
      width: 60,
      height: 60,
      vy: 0,
      gravity: 0.9,
      jumpForce: -16.5,
      isGrounded: true,
      isDucking: false,
      runFrame: 0,
      invulnerableTimer: 0,
      powerup: null, // 'shield', 'magnet'
      powerupTimer: 0,
      powerupMax: 0
    };

    // Game Objects
    this.obstacles = [];
    this.items = [];
    this.particles = [];
    this.clouds = [];
    this.confetti = [];

    // Timers & Spawners
    this.obstacleTimer = 0;
    this.itemTimer = 0;
    this.cloudTimer = 0;

    // Keys State
    this.keys = {
      up: false,
      down: false
    };

    // Bind DOM
    this.bindDom();
    this.initClouds();
    this.updateHud();
    this.setupListeners();

    // Animation Loop
    this.lastTime = performance.now();
    requestAnimationFrame((t) => this.loop(t));
  }

  bindDom() {
    this.startScreen = document.getElementById('startScreen');
    this.gameOverScreen = document.getElementById('gameOverScreen');
    this.charModal = document.getElementById('charModal');
    this.startPlayBtn = document.getElementById('startPlayBtn');
    this.restartPlayBtn = document.getElementById('restartPlayBtn');
    this.soundToggleBtn = document.getElementById('soundToggleBtn');
    this.charSelectBtn = document.getElementById('charSelectBtn');
    this.difficultyBtn = document.getElementById('difficultyBtn');
    this.diffText = document.getElementById('diffText');
    this.livesContainer = document.getElementById('livesContainer');
    this.currentScoreEl = document.getElementById('currentScore');
    this.highScoreEl = document.getElementById('highScore');
    this.coinsCountEl = document.getElementById('coinsCount');
    this.hudPowerup = document.getElementById('hudPowerup');
    this.powerIcon = document.getElementById('powerIcon');
    this.powerName = document.getElementById('powerName');
    this.powerBarFill = document.getElementById('powerBarFill');
    this.selectedDinoLabel = document.getElementById('selectedDinoLabel');
    this.avatarPreview = document.getElementById('avatarPreview');

    this.touchJumpBtn = document.getElementById('touchJumpBtn');
    this.touchDuckBtn = document.getElementById('touchDuckBtn');

    this.highScoreEl.innerText = this.highScore;
    this.renderDinoSelectionCards();
  }

  setupListeners() {
    // Keyboard Controls
    window.addEventListener('keydown', (e) => {
      if (['Space', 'ArrowUp', 'KeyW'].includes(e.code)) {
        e.preventDefault();
        this.triggerJump();
      }
      if (['ArrowDown', 'KeyS'].includes(e.code)) {
        e.preventDefault();
        this.setDuck(true);
      }
    });

    window.addEventListener('keyup', (e) => {
      if (['ArrowDown', 'KeyS'].includes(e.code)) {
        this.setDuck(false);
      }
    });

    // Canvas click/tap
    this.canvas.addEventListener('pointerdown', (e) => {
      if (this.state === 'PLAYING') {
        const rect = this.canvas.getBoundingClientRect();
        const y = e.clientY - rect.top;
        if (y > rect.height * 0.7) {
          // Bottom area click = duck momentarily
          this.setDuck(true);
          setTimeout(() => this.setDuck(false), 350);
        } else {
          this.triggerJump();
        }
      }
    });

    // Touch controls
    this.touchJumpBtn.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      this.triggerJump();
    });

    this.touchDuckBtn.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      this.setDuck(true);
    });
    this.touchDuckBtn.addEventListener('pointerup', (e) => {
      e.preventDefault();
      this.setDuck(false);
    });
    this.touchDuckBtn.addEventListener('pointercancel', (e) => {
      e.preventDefault();
      this.setDuck(false);
    });

    // Buttons
    this.startPlayBtn.addEventListener('click', () => this.startGame());
    this.restartPlayBtn.addEventListener('click', () => this.startGame());

    this.soundToggleBtn.addEventListener('click', () => {
      this.sound.enabled = !this.sound.enabled;
      if (this.sound.enabled) {
        this.sound.init();
        if (this.state === 'PLAYING') this.sound.startBgMusic();
        this.soundToggleBtn.innerHTML = '<span class="btn-icon">🔊</span> <span class="btn-text">Music On</span>';
      } else {
        this.sound.stopBgMusic();
        this.soundToggleBtn.innerHTML = '<span class="btn-icon">🔇</span> <span class="btn-text">Music Off</span>';
      }
    });

    this.charSelectBtn.addEventListener('click', () => {
      this.charModal.style.display = 'flex';
    });

    document.getElementById('closeCharModalBtn').addEventListener('click', () => {
      this.charModal.style.display = 'none';
    });

    this.difficultyBtn.addEventListener('click', () => {
      if (this.difficulty === 'baby') {
        this.difficulty = 'kids';
        this.maxHearts = 3;
        this.baseSpeed = 7;
        this.diffText.innerText = 'Kids Adventure 🦖';
      } else if (this.difficulty === 'kids') {
        this.difficulty = 'turbo';
        this.maxHearts = 3;
        this.baseSpeed = 8.5;
        this.diffText.innerText = 'Super Turbo ⚡';
      } else {
        this.difficulty = 'baby';
        this.maxHearts = 5;
        this.baseSpeed = 5.5;
        this.diffText.innerText = 'Baby Mode 🍼';
      }
      this.hearts = this.maxHearts;
      this.updateHud();
    });
  }

  renderDinoSelectionCards() {
    const container = document.getElementById('dinoOptionsContainer');
    container.innerHTML = '';
    DINOS.forEach((d) => {
      const card = document.createElement('div');
      card.className = `dino-card-option ${d.id === this.selectedDino.id ? 'active' : ''}`;
      card.innerHTML = `
        <div class="dino-badge-preview" style="background: ${d.skin}25; color: ${d.skin}">
          ${d.id === 'rexy' ? '🦖' : d.id === 'spiky' ? '🦕' : d.id === 'pip' ? '🦩' : '🐬'}
        </div>
        <div class="dino-info">
          <div class="dino-info-name">${d.name} ${d.hat}</div>
          <div class="dino-info-skill">${d.role}</div>
        </div>
      `;
      card.addEventListener('click', () => {
        this.selectedDino = d;
        this.selectedDinoLabel.innerText = `${d.name} (${d.role})`;
        this.avatarPreview.innerText = d.id === 'rexy' ? '🦖' : d.id === 'spiky' ? '🦕' : d.id === 'pip' ? '🦩' : '🐬';
        this.renderDinoSelectionCards();
        this.sound.playCoin();
      });
      container.appendChild(card);
    });
  }

  triggerJump() {
    if (this.state !== 'PLAYING') return;
    if (this.dino.isGrounded) {
      this.dino.vy = this.dino.jumpForce;
      this.dino.isGrounded = false;
      this.sound.playJump();
      this.spawnJumpParticles();
    }
  }

  setDuck(ducking) {
    if (this.state !== 'PLAYING') return;
    if (this.dino.isDucking !== ducking) {
      this.dino.isDucking = ducking;
      if (ducking && this.dino.isGrounded) {
        this.sound.playDuck();
      }
    }
  }

  startGame() {
    this.sound.init();
    this.state = 'PLAYING';
    this.score = 0;
    this.coins = 0;
    this.distance = 0;
    this.speed = this.baseSpeed;
    this.hearts = this.maxHearts;
    this.currentThemeIndex = 0;

    this.dino.y = this.groundY - 60;
    this.dino.vy = 0;
    this.dino.isGrounded = true;
    this.dino.isDucking = false;
    this.dino.invulnerableTimer = 0;
    this.dino.powerup = null;
    this.dino.powerupTimer = 0;

    this.obstacles = [];
    this.items = [];
    this.particles = [];
    this.confetti = [];
    this.obstacleTimer = 70;
    this.itemTimer = 40;

    this.startScreen.style.display = 'none';
    this.gameOverScreen.style.display = 'none';
    this.charModal.style.display = 'none';

    this.updateHud();
    this.sound.startBgMusic();
  }

  gameOver() {
    this.state = 'GAMEOVER';
    this.sound.stopBgMusic();
    this.sound.playGameOver();

    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem('dino_highscore', this.highScore.toString());
      this.highScoreEl.innerText = this.highScore;
      this.spawnConfetti(120);
    }

    document.getElementById('finalScoreVal').innerText = this.score;
    document.getElementById('finalCoinsVal').innerText = `${this.coins} ⭐`;
    document.getElementById('finalBestVal').innerText = this.highScore;

    this.gameOverScreen.style.display = 'flex';
  }

  updateHud() {
    // Render hearts
    this.livesContainer.innerHTML = '';
    for (let i = 0; i < this.maxHearts; i++) {
      const heart = document.createElement('span');
      heart.className = `heart-icon ${i >= this.hearts ? 'heart-lost' : ''}`;
      heart.innerText = '❤️';
      this.livesContainer.appendChild(heart);
    }

    this.currentScoreEl.innerText = this.score;
    this.coinsCountEl.innerText = this.coins;
    this.highScoreEl.innerText = this.highScore;

    // Powerup display
    if (this.dino.powerup && this.dino.powerupTimer > 0) {
      this.hudPowerup.style.display = 'flex';
      const pct = (this.dino.powerupTimer / this.dino.powerupMax) * 100;
      this.powerBarFill.style.width = `${pct}%`;
      if (this.dino.powerup === 'shield') {
        this.powerIcon.innerText = '🌈';
        this.powerName.innerText = 'SHIELD!';
      } else if (this.dino.powerup === 'magnet') {
        this.powerIcon.innerText = '🧲';
        this.powerName.innerText = 'MAGNET!';
      }
    } else {
      this.hudPowerup.style.display = 'none';
    }
  }

  takeDamage() {
    if (this.dino.powerup === 'shield' || this.dino.invulnerableTimer > 0) return;
    this.hearts--;
    this.sound.playHit();
    this.dino.invulnerableTimer = 90; // Flash for ~1.5s
    this.spawnHitParticles();
    this.updateHud();

    if (this.hearts <= 0) {
      this.gameOver();
    }
  }

  initClouds() {
    this.clouds = [];
    for (let i = 0; i < 5; i++) {
      this.clouds.push({
        x: Math.random() * this.canvas.width,
        y: 40 + Math.random() * 120,
        width: 70 + Math.random() * 50,
        speed: 0.5 + Math.random() * 0.8
      });
    }
  }

  // ==========================================
  // 5. UPDATE CYCLE
  // ==========================================
  update(dt) {
    // Parallax clouds
    this.clouds.forEach((c) => {
      c.x -= c.speed;
      if (c.x + c.width < 0) {
        c.x = this.canvas.width + 30;
        c.y = 40 + Math.random() * 120;
      }
    });

    if (this.state !== 'PLAYING') {
      this.updateParticles();
      return;
    }

    // Distance & Themes
    this.distance += this.speed;
    this.score = Math.floor(this.distance / 10);
    this.currentScoreEl.innerText = this.score;

    // Difficulty speed ramp
    this.speed = this.baseSpeed + Math.min(this.score / 250, 4.5);

    // Dynamic Theme Progression (Sunny -> Sunset -> Candy -> Galaxy)
    if (this.score < 250) this.currentThemeIndex = 0;
    else if (this.score < 600) this.currentThemeIndex = 1;
    else if (this.score < 1100) this.currentThemeIndex = 2;
    else this.currentThemeIndex = 3;

    // Confetti on milestone rewards
    if (this.score > 0 && this.score % 200 === 0 && !this.lastMilestoneAward) {
      this.spawnConfetti(60);
      this.sound.playPowerup();
      this.lastMilestoneAward = true;
    } else if (this.score % 200 !== 0) {
      this.lastMilestoneAward = false;
    }

    // Powerup Timer
    if (this.dino.powerupTimer > 0) {
      this.dino.powerupTimer--;
      if (this.dino.powerupTimer <= 0) {
        this.dino.powerup = null;
      }
      this.updateHud();
    }

    // Invulnerability timer
    if (this.dino.invulnerableTimer > 0) {
      this.dino.invulnerableTimer--;
    }

    // Dino Physics
    this.dino.runFrame += 0.2;
    if (!this.dino.isGrounded) {
      this.dino.vy += this.dino.gravity;
      this.dino.y += this.dino.vy;

      if (this.dino.y >= this.groundY - (this.dino.isDucking ? 35 : 60)) {
        this.dino.y = this.groundY - (this.dino.isDucking ? 35 : 60);
        this.dino.vy = 0;
        this.dino.isGrounded = true;
      }
    } else {
      this.dino.y = this.groundY - (this.dino.isDucking ? 35 : 60);
    }

    // Ducking height adjust
    this.dino.height = this.dino.isDucking ? 35 : 60;
    this.dino.width = this.dino.isDucking ? 68 : 55;

    // Obstacle Spawning
    this.obstacleTimer--;
    if (this.obstacleTimer <= 0) {
      this.spawnObstacle();
      const minInterval = this.difficulty === 'baby' ? 110 : 75;
      this.obstacleTimer = minInterval + Math.floor(Math.random() * 60);
    }

    // Item Spawning (Fruits / Stars / Powerups)
    this.itemTimer--;
    if (this.itemTimer <= 0) {
      this.spawnItem();
      this.itemTimer = 60 + Math.floor(Math.random() * 70);
    }

    // Update Obstacles
    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      const obs = this.obstacles[i];
      obs.x -= this.speed;

      // Obstacle flap wings if flying
      if (obs.type === 'bird') {
        obs.wingTimer = (obs.wingTimer || 0) + 0.15;
      }

      // Collision Detection with Player
      if (this.checkCollision(this.dino, obs)) {
        if (this.dino.powerup === 'shield') {
          // Smash obstacle with rainbow shield!
          this.sound.playCoin();
          this.spawnHitParticles(obs.x + obs.width / 2, obs.y + obs.height / 2);
          this.obstacles.splice(i, 1);
          this.score += 20;
          continue;
        } else {
          this.takeDamage();
        }
      }

      // Remove offscreen
      if (obs.x + obs.width < -50) {
        this.obstacles.splice(i, 1);
      }
    }

    // Update Items (Goodies)
    for (let i = this.items.length - 1; i >= 0; i--) {
      const itm = this.items[i];
      itm.x -= this.speed;
      itm.bounceOffset = Math.sin((this.distance + itm.x) * 0.05) * 6;

      // Magnet effect: suck items toward Dino!
      if (this.dino.powerup === 'magnet') {
        const dx = (this.dino.x + 25) - itm.x;
        const dy = (this.dino.y + 25) - (itm.y + itm.bounceOffset);
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 320) {
          itm.x += dx * 0.1;
          itm.y += dy * 0.1;
        }
      }

      // Check Collection
      const itemBox = {
        x: itm.x,
        y: itm.y + itm.bounceOffset,
        width: itm.size,
        height: itm.size
      };

      if (this.checkCollision(this.dino, itemBox)) {
        this.collectItem(itm);
        this.items.splice(i, 1);
        continue;
      }

      if (itm.x + itm.size < -50) {
        this.items.splice(i, 1);
      }
    }

    this.updateParticles();
  }

  collectItem(itm) {
    this.sound.playCoin();
    this.spawnCollectParticles(itm.x, itm.y + itm.bounceOffset, itm.color);

    if (itm.type === 'star') {
      this.coins += 1;
      this.score += 15;
    } else if (itm.type === 'fruit') {
      this.coins += 2;
      this.score += 30;
    } else if (itm.type === 'heart') {
      if (this.hearts < this.maxHearts) {
        this.hearts++;
      }
      this.sound.playPowerup();
    } else if (itm.type === 'shield') {
      this.dino.powerup = 'shield';
      this.dino.powerupTimer = 450; // ~7.5 seconds
      this.dino.powerupMax = 450;
      this.sound.playPowerup();
    } else if (itm.type === 'magnet') {
      this.dino.powerup = 'magnet';
      this.dino.powerupTimer = 500; // ~8.5 seconds
      this.dino.powerupMax = 500;
      this.sound.playPowerup();
    }
    this.updateHud();
  }

  spawnObstacle() {
    const types = ['cactus', 'cactus_double', 'rock', 'bird'];
    const chosen = types[Math.floor(Math.random() * types.length)];

    if (chosen === 'cactus') {
      this.obstacles.push({
        type: 'cactus',
        x: this.canvas.width + 40,
        y: this.groundY - 50,
        width: 32,
        height: 50
      });
    } else if (chosen === 'cactus_double') {
      this.obstacles.push({
        type: 'cactus_double',
        x: this.canvas.width + 40,
        y: this.groundY - 52,
        width: 52,
        height: 52
      });
    } else if (chosen === 'rock') {
      this.obstacles.push({
        type: 'rock',
        x: this.canvas.width + 40,
        y: this.groundY - 32,
        width: 38,
        height: 32
      });
    } else if (chosen === 'bird') {
      // Birds fly at two heights: High (duck to pass) or Low (jump to pass)
      const flyHigh = Math.random() > 0.45;
      const birdY = flyHigh ? this.groundY - 80 : this.groundY - 45;
      this.obstacles.push({
        type: 'bird',
        x: this.canvas.width + 40,
        y: birdY,
        width: 44,
        height: 34,
        wingTimer: 0
      });
    }
  }

  spawnItem() {
    const rand = Math.random();
    let type = 'star';
    let color = '#ffd600';

    if (rand < 0.55) {
      type = 'star';
      color = '#ffd600';
    } else if (rand < 0.82) {
      type = 'fruit'; // Watermelon / Apple
      color = '#ff5252';
    } else if (rand < 0.92) {
      type = 'shield';
      color = '#e040fb';
    } else if (rand < 0.97) {
      type = 'magnet';
      color = '#2979ff';
    } else {
      type = 'heart';
      color = '#ff1744';
    }

    // High or low floating item
    const high = Math.random() > 0.4;
    const itemY = high ? this.groundY - 95 : this.groundY - 40;

    this.items.push({
      type,
      color,
      x: this.canvas.width + 20,
      y: itemY,
      size: 30,
      bounceOffset: 0
    });
  }

  checkCollision(rect1, rect2) {
    const pad = 8; // Friendly generous hitbox for kids!
    return (
      rect1.x + pad < rect2.x + rect2.width &&
      rect1.x + rect1.width - pad > rect2.x &&
      rect1.y + pad < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y + pad
    );
  }

  // ==========================================
  // 6. PARTICLES & JUICE
  // ==========================================
  spawnJumpParticles() {
    for (let i = 0; i < 6; i++) {
      this.particles.push({
        x: this.dino.x + 20 + (Math.random() * 20),
        y: this.groundY - 4,
        vx: -this.speed * 0.4 + (Math.random() - 0.5) * 3,
        vy: -Math.random() * 3,
        size: 4 + Math.random() * 4,
        color: '#ffffff',
        alpha: 1,
        life: 20
      });
    }
  }

  spawnCollectParticles(x, y, color) {
    for (let i = 0; i < 10; i++) {
      const angle = Math.random() * Math.PI * 2;
      const spd = 2 + Math.random() * 4;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        size: 4 + Math.random() * 5,
        color: color || '#ffd600',
        alpha: 1,
        life: 25
      });
    }
  }

  spawnHitParticles(x, y) {
    const posX = x || (this.dino.x + 30);
    const posY = y || (this.dino.y + 30);
    for (let i = 0; i < 14; i++) {
      const angle = Math.random() * Math.PI * 2;
      const spd = 2 + Math.random() * 5;
      this.particles.push({
        x: posX,
        y: posY,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        size: 5 + Math.random() * 4,
        color: '#ff3d00',
        alpha: 1,
        life: 30
      });
    }
  }

  spawnConfetti(count = 50) {
    const colors = ['#f44336', '#e91e63', '#9c27b0', '#2196f3', '#4caf50', '#ffeb3b', '#ff9800'];
    for (let i = 0; i < count; i++) {
      this.confetti.push({
        x: Math.random() * this.canvas.width,
        y: -10,
        vx: (Math.random() - 0.5) * 4,
        vy: 2 + Math.random() * 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 6 + Math.random() * 6,
        rot: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 10,
        life: 140
      });
    }
  }

  updateParticles() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 1 / p.life;
      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
      }
    }

    for (let i = this.confetti.length - 1; i >= 0; i--) {
      const c = this.confetti[i];
      c.x += c.vx;
      c.y += c.vy;
      c.rot += c.vRot;
      c.life--;
      if (c.y > this.canvas.height || c.life <= 0) {
        this.confetti.splice(i, 1);
      }
    }
  }

  // ==========================================
  // 7. RENDER CYCLE
  // ==========================================
  draw() {
    const theme = THEMES[this.currentThemeIndex];

    // Sky Gradient
    const skyGrad = this.ctx.createLinearGradient(0, 0, 0, this.groundY);
    skyGrad.addColorStop(0, theme.skyTop);
    skyGrad.addColorStop(1, theme.skyBottom);
    this.ctx.fillStyle = skyGrad;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Sun / Moon
    this.ctx.beginPath();
    this.ctx.arc(this.canvas.width - 90, 75, 40, 0, Math.PI * 2);
    this.ctx.fillStyle = theme.sunColor;
    this.ctx.fill();

    // Distant Rolling Hills (Parallax)
    this.drawHills(theme.hillFar, 180, 0.2);
    this.drawHills(theme.hillNear, 120, 0.5);

    // Puffy Clouds
    this.clouds.forEach((c) => {
      this.drawCloud(c.x, c.y, c.width, theme.cloudColor);
    });

    // Ground and Grass
    this.ctx.fillStyle = theme.ground;
    this.ctx.fillRect(0, this.groundY, this.canvas.width, this.canvas.height - this.groundY);

    // Ground Dirt Underneath
    this.ctx.fillStyle = theme.groundSub;
    this.ctx.fillRect(0, this.groundY + 16, this.canvas.width, this.canvas.height - this.groundY - 16);

    // Moving Ground Line dashes / grass tufts
    this.drawGroundDetails();

    // Render Items
    this.items.forEach((itm) => {
      this.drawItem(itm);
    });

    // Render Obstacles
    this.obstacles.forEach((obs) => {
      this.drawObstacle(obs);
    });

    // Render Dino Character
    this.drawDino();

    // Render Particles & Confetti
    this.drawParticles();
  }

  drawHills(color, heightOffset, speedFactor) {
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.groundY);

    const shift = (this.distance * speedFactor) % 400;
    for (let x = -shift; x <= this.canvas.width + 400; x += 200) {
      this.ctx.quadraticCurveTo(
        x + 100,
        this.groundY - heightOffset,
        x + 200,
        this.groundY
      );
    }
    this.ctx.lineTo(this.canvas.width, this.groundY);
    this.ctx.lineTo(0, this.groundY);
    this.ctx.fill();
  }

  drawCloud(x, y, w, color) {
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(x, y, w * 0.25, 0, Math.PI * 2);
    this.ctx.arc(x + w * 0.3, y - w * 0.1, w * 0.3, 0, Math.PI * 2);
    this.ctx.arc(x + w * 0.6, y, w * 0.25, 0, Math.PI * 2);
    this.ctx.fill();
  }

  drawGroundDetails() {
    this.ctx.fillStyle = '#ffffff40';
    const offset = this.distance % 60;
    for (let x = -offset; x < this.canvas.width; x += 60) {
      // Cute grass blades
      this.ctx.fillRect(x, this.groundY - 4, 6, 8);
      this.ctx.fillRect(x + 18, this.groundY - 6, 4, 10);
      // Little ground dots
      this.ctx.fillRect(x + 35, this.groundY + 8, 8, 4);
    }
  }

  drawDino() {
    const d = this.dino;
    const skin = this.selectedDino;

    // Invulnerability Flashing
    if (d.invulnerableTimer > 0 && Math.floor(d.invulnerableTimer / 4) % 2 === 0) {
      return;
    }

    this.ctx.save();
    this.ctx.translate(d.x, d.y);

    // Rainbow Power Shield Glow
    if (d.powerup === 'shield') {
      const rainbowHue = (performance.now() / 5) % 360;
      this.ctx.shadowColor = `hsl(${rainbowHue}, 100%, 60%)`;
      this.ctx.shadowBlur = 24;

      // Aura circle
      this.ctx.beginPath();
      this.ctx.arc(d.width / 2, d.height / 2, 42, 0, Math.PI * 2);
      this.ctx.fillStyle = `hsla(${rainbowHue}, 100%, 60%, 0.25)`;
      this.ctx.fill();
      this.ctx.lineWidth = 3;
      this.ctx.strokeStyle = `hsl(${rainbowHue}, 100%, 75%)`;
      this.ctx.stroke();
    }

    // Magnet Aura
    if (d.powerup === 'magnet') {
      this.ctx.shadowColor = '#00e5ff';
      this.ctx.shadowBlur = 18;
    }

    if (d.isDucking) {
      // DUCKING DINO (Cute stretched low body)
      // Body
      this.ctx.fillStyle = skin.skin;
      this.ctx.beginPath();
      this.ctx.roundRect(0, 8, d.width, d.height - 8, 14);
      this.ctx.fill();

      // Belly
      this.ctx.fillStyle = skin.belly;
      this.ctx.beginPath();
      this.ctx.roundRect(14, 16, 32, d.height - 18, 10);
      this.ctx.fill();

      // Eye
      this.ctx.fillStyle = '#ffffff';
      this.ctx.beginPath();
      this.ctx.arc(d.width - 12, 16, 7, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.fillStyle = skin.eye;
      this.ctx.beginPath();
      this.ctx.arc(d.width - 10, 16, 4, 0, Math.PI * 2);
      this.ctx.fill();

      // Ducking Legs
      this.ctx.fillStyle = skin.spikes;
      this.ctx.fillRect(8, d.height - 2, 12, 6);
      this.ctx.fillRect(36, d.height - 2, 12, 6);
    } else {
      // STANDING / RUNNING DINO
      const legOffset = Math.sin(d.runFrame) * 8;

      // Cute Tail
      this.ctx.fillStyle = skin.skin;
      this.ctx.beginPath();
      this.ctx.moveTo(10, 36);
      this.ctx.lineTo(-14, 28 + Math.sin(d.runFrame * 0.8) * 4);
      this.ctx.lineTo(8, 48);
      this.ctx.fill();

      // Back Spikes / Plates
      this.ctx.fillStyle = skin.spikes;
      for (let i = 0; i < 3; i++) {
        this.ctx.beginPath();
        this.ctx.moveTo(8 + i * 10, 18 + i * 8);
        this.ctx.lineTo(13 + i * 10, 8 + i * 8);
        this.ctx.lineTo(18 + i * 10, 20 + i * 8);
        this.ctx.fill();
      }

      // Main Round Body
      this.ctx.fillStyle = skin.skin;
      this.ctx.beginPath();
      this.ctx.roundRect(8, 12, 40, 38, 16);
      this.ctx.fill();

      // Soft Belly
      this.ctx.fillStyle = skin.belly;
      this.ctx.beginPath();
      this.ctx.roundRect(24, 22, 18, 24, 10);
      this.ctx.fill();

      // Head / Snout
      this.ctx.fillStyle = skin.skin;
      this.ctx.beginPath();
      this.ctx.roundRect(22, 0, 32, 26, 12);
      this.ctx.fill();

      // Big Anime Sparkle Eye
      this.ctx.fillStyle = '#ffffff';
      this.ctx.beginPath();
      this.ctx.arc(42, 10, 8, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.fillStyle = skin.eye;
      this.ctx.beginPath();
      this.ctx.arc(44, 10, 5, 0, Math.PI * 2);
      this.ctx.fill();

      // Sparkle Pupil Highlights
      this.ctx.fillStyle = '#ffffff';
      this.ctx.beginPath();
      this.ctx.arc(46, 8, 2, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.beginPath();
      this.ctx.arc(43, 12, 1, 0, Math.PI * 2);
      this.ctx.fill();

      // Smile / Cheek
      this.ctx.fillStyle = '#ff4081';
      this.ctx.beginPath();
      this.ctx.arc(36, 18, 3, 0, Math.PI * 2);
      this.ctx.fill();

      // Tiny Cute Arm
      this.ctx.fillStyle = skin.skin;
      this.ctx.beginPath();
      this.ctx.roundRect(32, 30, 10, 6, 3);
      this.ctx.fill();

      // Alternating Bouncy Legs
      this.ctx.fillStyle = skin.spikes;
      if (d.isGrounded) {
        // Left leg
        this.ctx.fillRect(16, 48, 8, 12 + legOffset);
        // Right leg
        this.ctx.fillRect(32, 48, 8, 12 - legOffset);
      } else {
        // Tucked jumping legs
        this.ctx.fillRect(18, 46, 8, 8);
        this.ctx.fillRect(30, 44, 8, 8);
      }
    }

    this.ctx.restore();
  }

  drawObstacle(obs) {
    this.ctx.save();
    this.ctx.translate(obs.x, obs.y);

    if (obs.type === 'cactus') {
      // Single Friendly Cactus
      this.ctx.fillStyle = '#43a047';
      this.ctx.beginPath();
      this.ctx.roundRect(10, 4, 12, obs.height - 4, 6);
      this.ctx.fill();

      // Left branch
      this.ctx.fillRect(2, 18, 10, 6);
      this.ctx.fillRect(2, 12, 6, 12);

      // Pink Flower on Top
      this.ctx.fillStyle = '#ff4081';
      this.ctx.beginPath();
      this.ctx.arc(16, 4, 6, 0, Math.PI * 2);
      this.ctx.fill();

      // Happy smile on cactus
      this.ctx.fillStyle = '#1b5e20';
      this.ctx.fillRect(13, 22, 2, 2);
      this.ctx.fillRect(17, 22, 2, 2);
    } else if (obs.type === 'cactus_double') {
      // Double Cactus Friends
      this.ctx.fillStyle = '#388e3c';
      this.ctx.beginPath();
      this.ctx.roundRect(6, 10, 14, obs.height - 10, 6);
      this.ctx.roundRect(26, 2, 16, obs.height - 2, 6);
      this.ctx.fill();

      // Flower on the taller one
      this.ctx.fillStyle = '#ffd600';
      this.ctx.beginPath();
      this.ctx.arc(34, 2, 6, 0, Math.PI * 2);
      this.ctx.fill();
    } else if (obs.type === 'rock') {
      // Cute Rolling Boulder with Googly Eyes
      this.ctx.fillStyle = '#78909c';
      this.ctx.beginPath();
      this.ctx.arc(obs.width / 2, obs.height / 2, obs.height / 2, 0, Math.PI * 2);
      this.ctx.fill();

      // Googly Eyes
      this.ctx.fillStyle = '#ffffff';
      this.ctx.beginPath();
      this.ctx.arc(14, 12, 4, 0, Math.PI * 2);
      this.ctx.arc(24, 12, 4, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.fillStyle = '#263238';
      this.ctx.beginPath();
      this.ctx.arc(15, 12, 2, 0, Math.PI * 2);
      this.ctx.arc(25, 12, 2, 0, Math.PI * 2);
      this.ctx.fill();
    } else if (obs.type === 'bird') {
      // Flying Baby Pterodactyl with Flapping Wings
      const wingY = Math.sin(obs.wingTimer) * 10;
      this.ctx.fillStyle = '#ab47bc';
      // Body
      this.ctx.beginPath();
      this.ctx.ellipse(22, 18, 14, 9, 0, 0, Math.PI * 2);
      this.ctx.fill();

      // Beak
      this.ctx.fillStyle = '#ffb300';
      this.ctx.beginPath();
      this.ctx.moveTo(10, 18);
      this.ctx.lineTo(0, 19);
      this.ctx.lineTo(10, 23);
      this.ctx.fill();

      // Wing
      this.ctx.fillStyle = '#ce93d8';
      this.ctx.beginPath();
      this.ctx.moveTo(22, 18);
      this.ctx.lineTo(34, 4 + wingY);
      this.ctx.lineTo(38, 20);
      this.ctx.fill();

      // Cute eye
      this.ctx.fillStyle = '#ffffff';
      this.ctx.beginPath();
      this.ctx.arc(15, 15, 3, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.fillStyle = '#4a148c';
      this.ctx.beginPath();
      this.ctx.arc(14, 15, 1.5, 0, Math.PI * 2);
      this.ctx.fill();
    }

    this.ctx.restore();
  }

  drawItem(itm) {
    this.ctx.save();
    const renderY = itm.y + itm.bounceOffset;
    this.ctx.translate(itm.x, renderY);

    if (itm.type === 'star') {
      // Golden 5-point Star ⭐
      this.ctx.fillStyle = '#ffd600';
      this.ctx.shadowColor = '#ffea00';
      this.ctx.shadowBlur = 10;
      this.drawStarShape(15, 15, 5, 14, 6);
    } else if (itm.type === 'fruit') {
      // Juicy Watermelon Slice 🍉
      this.ctx.fillStyle = '#43a047'; // Rind
      this.ctx.beginPath();
      this.ctx.arc(15, 15, 14, 0, Math.PI);
      this.ctx.fill();

      this.ctx.fillStyle = '#ff1744'; // Flesh
      this.ctx.beginPath();
      this.ctx.arc(15, 15, 11, 0, Math.PI);
      this.ctx.fill();

      // Seeds
      this.ctx.fillStyle = '#212121';
      this.ctx.fillRect(11, 18, 2, 3);
      this.ctx.fillRect(18, 18, 2, 3);
    } else if (itm.type === 'heart') {
      // Heart 💖
      this.ctx.fillStyle = '#ff1744';
      this.ctx.shadowColor = '#ff5252';
      this.ctx.shadowBlur = 8;
      this.ctx.font = '24px serif';
      this.ctx.fillText('❤️', 2, 22);
    } else if (itm.type === 'shield') {
      // Rainbow Shield Orb 🌈
      this.ctx.shadowColor = '#e040fb';
      this.ctx.shadowBlur = 12;
      this.ctx.font = '24px serif';
      this.ctx.fillText('🌈', 2, 22);
    } else if (itm.type === 'magnet') {
      // Magnet Orb 🧲
      this.ctx.shadowColor = '#00e5ff';
      this.ctx.shadowBlur = 12;
      this.ctx.font = '24px serif';
      this.ctx.fillText('🧲', 2, 22);
    }

    this.ctx.restore();
  }

  drawStarShape(cx, cy, spikes, outerRadius, innerRadius) {
    let rot = (Math.PI / 2) * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    this.ctx.beginPath();
    this.ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      this.ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      this.ctx.lineTo(x, y);
      rot += step;
    }
    this.ctx.lineTo(cx, cy - outerRadius);
    this.ctx.closePath();
    this.ctx.fill();
  }

  drawParticles() {
    this.particles.forEach((p) => {
      this.ctx.save();
      this.ctx.globalAlpha = Math.max(0, p.alpha);
      this.ctx.fillStyle = p.color;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    });

    this.confetti.forEach((c) => {
      this.ctx.save();
      this.ctx.translate(c.x, c.y);
      this.ctx.rotate((c.rot * Math.PI) / 180);
      this.ctx.fillStyle = c.color;
      this.ctx.fillRect(-c.size / 2, -c.size / 2, c.size, c.size * 0.6);
      this.ctx.restore();
    });
  }

  // ==========================================
  // 8. ANIMATION LOOP
  // ==========================================
  loop(timestamp) {
    const dt = timestamp - this.lastTime;
    this.lastTime = timestamp;

    this.update(dt);
    this.draw();

    requestAnimationFrame((t) => this.loop(t));
  }
}

// Start Game on load
window.addEventListener('DOMContentLoaded', () => {
  window.dinoApp = new DinoGame();
});
