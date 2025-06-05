class Endboss extends MovableObject {

    height = 400;
    width = 250;
    y = 50;
    isDead = false;
    x = 3200;
    moveleftInt;
    playAniInt;
    animateInt;

    endbossHurt_sound = new Audio('audio/chicken.mp3');
    endbossAttack_sound = new Audio('audio/attack.mp3');

    IMAGES_WALKING = [
        'img/4_enemie_boss_chicken/1_walk/G1.png',
        'img/4_enemie_boss_chicken/1_walk/G2.png',
        'img/4_enemie_boss_chicken/1_walk/G3.png',
        'img/4_enemie_boss_chicken/1_walk/G4.png'
    ];

    IMAGES_ALERT = [
        'img/4_enemie_boss_chicken/2_alert/G5.png',
        'img/4_enemie_boss_chicken/2_alert/G6.png',
        'img/4_enemie_boss_chicken/2_alert/G7.png',
        'img/4_enemie_boss_chicken/2_alert/G8.png',
        'img/4_enemie_boss_chicken/2_alert/G9.png',
        'img/4_enemie_boss_chicken/2_alert/G10.png',
        'img/4_enemie_boss_chicken/2_alert/G11.png',
        'img/4_enemie_boss_chicken/2_alert/G12.png'
    ];

    IMAGES_ATTACK = [
        'img/4_enemie_boss_chicken/3_attack/G13.png',
        'img/4_enemie_boss_chicken/3_attack/G14.png',
        'img/4_enemie_boss_chicken/3_attack/G15.png',
        'img/4_enemie_boss_chicken/3_attack/G16.png',
        'img/4_enemie_boss_chicken/3_attack/G17.png',
        'img/4_enemie_boss_chicken/3_attack/G18.png',
        'img/4_enemie_boss_chicken/3_attack/G19.png',
        'img/4_enemie_boss_chicken/3_attack/G20.png'
    ];

    IMAGES_HURT = [
        'img/4_enemie_boss_chicken/4_hurt/G21.png',
        'img/4_enemie_boss_chicken/4_hurt/G22.png',
        'img/4_enemie_boss_chicken/4_hurt/G23.png'
    ];

    IMAGES_DEAD = [
        'img/4_enemie_boss_chicken/5_dead/G24.png',
        'img/4_enemie_boss_chicken/5_dead/G25.png',
        'img/4_enemie_boss_chicken/5_dead/G26.png'
    ];

    constructor() {
        super().loadImage(this.IMAGES_ALERT[0]);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.speed = 4;
        this.energy = 100;
        this.walkLeft();
        this.animate();
    }

      takeDamage(amount) {
    this.energy = Math.max(0, this.energy - amount);
    this.lastHit = new Date().getTime();
    if (this.energy === 0 && !this.isDead) {
        this.isDead = true;
    }
}

    walkLeft() {
      if (this.moveleftInt) clearInterval(this.moveleftInt);
      if (this.playAniInt) clearInterval(this.playAniInt);
      this.moveleftInt = setInterval(() => {
          this.moveLeft();
      }, 200);
      this.playAniInt = setInterval(() => {
          this.playAnimation(this.IMAGES_WALKING);
      }, 200);
  }
    
    animate() {
    this.animateInt = setInterval(() => {
        if (this.isDead) {
            clearInterval(this.animateInt);
            this.playdie();
        } else if (this.isHurt()) {
            this.playHurt();
        } else if (this.energy <= 80 && !this.alertActive && !this.alertattack) {
            this.playAlert();
        } else if (this.energy <= 60 && !this.alertattack) {
            this.playAttack();
        }
    }, 200);
}

  playHurt() {
      if (this.hurtAnimationPlayed || this.energy == 60) return;
      this.hurtAnimationPlayed = true;
      clearInterval(this.moveleftInt);
      clearInterval(this.playAniInt);
      this.endbossHurt_sound.play();
      this.playOnce(this.IMAGES_HURT, 1000);
      setTimeout(() => {
          this.hurtAnimationPlayed = false;
          this.walkLeft();
      }, 1200);
  }

  /**
   * Plays the death animation and removes the boss after delay.
   */
 playdie() {
    clearInterval(this.moveleftInt);
    clearInterval(this.playAniInt);
    this.speed = 0;
    this.currentImage = 0;
    let i = 0;
    let deathInterval = setInterval(() => {
        if (i >= this.IMAGES_DEAD.length) {
            clearInterval(deathInterval);
            setTimeout(() => {
                this.y = -1000;
                this.isSplicable = true;
            }, 1000);
        } else {
            this.img = this.imageCache[this.IMAGES_DEAD[i]];
            i++;
        }
    }, 150);
}



  /**
   * Plays alert animation when energy is low and increases speed.
   */
  playAlert() {
      if (this.alertActive) return;
      this.alertActive = true;
      clearInterval(this.moveleftInt);
      clearInterval(this.playAniInt);
      this.speed = 18;
      this.endbossAttack_sound.play();
      this.playOnce(this.IMAGES_ALERT, 1800);
      setTimeout(() => {
          this.alertActive = false;
          this.walkLeft();
      }, 3300);
  }

  /**
   * Plays the attack animation when energy is critical and charges forward.
   */
  playAttack() {
    if (this.alertattack) return;
    this.alertattack = true;
    clearInterval(this.moveleftInt);
    clearInterval(this.playAniInt);
    clearInterval(this.animateInt);
    this.speed = 60;
    this.playOnce(this.IMAGES_ATTACK, 2800);
    setTimeout(() => {
        this.alertattack = false;
        this.walkLeft();
        this.animate();
    }, 3300);
}

}