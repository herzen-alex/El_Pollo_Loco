class Endboss extends MovableObject {

    /**
     * General properties for Endboss character:
     * Position, size, movement state, speed, energy, timers, and reference to game world.
     */
    height = 400;
    width = 250;
    y = 50;
    isDead = false;
    x = 3200;
    moveleftInt;
    playAniInt;
    animateInt;
    speed = 1;
    energy = 100;
    lastDamageTime = 0;
    damageCooldown = 1000;
    world;
    firstHitTaken = false;

    /**
     * Offset values for collision detection or positioning.
     * @type {{top: number, left: number, right: number, bottom: number}}
     */
    offset = {
        top: 0,
        left: 110,
        right: 110,
        bottom: 0
    };

    /**
     * Audio objects for Endboss sounds: hurt and attack effects.
     */
    endbossHurt_sound = new Audio('audio/chicken.mp3');
    endbossAttack_sound = new Audio('audio/attack.mp3');

    /**
     * @constant {string[]} IMAGES_WALKING
     * Array of image paths for the Endboss walking animation frames.
     */
    IMAGES_WALKING = [
        'img/4_enemie_boss_chicken/1_walk/G1.png',
        'img/4_enemie_boss_chicken/1_walk/G2.png',
        'img/4_enemie_boss_chicken/1_walk/G3.png',
        'img/4_enemie_boss_chicken/1_walk/G4.png'
    ];

    /**
     * @constant {string[]} IMAGES_ALERT
     * Array of image paths for the Endboss alert animation frames.
     */
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

    /**
     * @constant {string[]} IMAGES_ATTACK
     * Array of image paths for the Endboss attack animation frames.
     */
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

    /**
     * @constant {string[]} IMAGES_HURT
     * Array of image paths for the Endboss hurt animation frames.
     */
    IMAGES_HURT = [
        'img/4_enemie_boss_chicken/4_hurt/G21.png',
        'img/4_enemie_boss_chicken/4_hurt/G22.png',
        'img/4_enemie_boss_chicken/4_hurt/G23.png'
    ];

    /**
     * @constant {string[]} IMAGES_DEAD
     * Array of image paths for the Endboss dead animation frames.
     */
    IMAGES_DEAD = [
        'img/4_enemie_boss_chicken/5_dead/G24.png',
        'img/4_enemie_boss_chicken/5_dead/G25.png',
        'img/4_enemie_boss_chicken/5_dead/G26.png'
    ];

    /**
     * Constructor
     * - Loads the initial alert image.
     * - Preloads all animation images.
     * - Starts walking left and animating.
     * - Initiates collision checking with the player.
     */
    constructor() {
        super().loadImage(this.IMAGES_ALERT[0]);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.walkLeft();
        this.animate();
        this.startCollisionCheck();
        this.startAggressiveLoop();
    }

    /**
     * checkPlayerCollision
     * Checks if Endboss collides with the player and is alive.
     * Calls onCollisionWithPlayer() if collision detected.
     */
    checkPlayerCollision() {
        if (this.isColliding(world.character) && !this.isDead) {
            this.onCollisionWithPlayer();
        }
    }

    /**
     * startCollisionCheck
     * Starts interval to check player collision every 100 milliseconds.
     */
    startCollisionCheck() {
        setInterval(() => {
            this.checkPlayerCollision();
        }, 100);
    }

    /**
     * takeDamage
     * Reduces energy by given amount (min 0).
     * Updates last hit time.
     * If energy is zero and Endboss is alive, marks as dead and plays death animation.
     * @param {number} amount - Amount of damage to apply.
     */
    takeDamage(amount) {
        this.energy = Math.max(0, this.energy - amount);
        this.lastHit = new Date().getTime();
        if (!this.firstHitTaken) {
            this.firstHitTaken = true;
            this.speed = 18;
        }
        if (this.energy === 0 && !this.isDead) {
            this.isDead = true;
            this.playdie();
        }
    }

    /**
     * walkLeft
     * Starts intervals to move Endboss left and play walking animation.
     * Clears previous intervals if they exist.
     */
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

    /**
     * moveLeft
     * Moves Endboss left by its speed.
     * Checks collision with the player and triggers collision handler if collided.
     */
    moveLeft() {
        this.x -= this.speed;
        if (this.isColliding(world.character)) {
            this.onCollisionWithPlayer();
        }
    }

    /**
     * onCollisionWithPlayer
     * Handles collision with player.
     * Applies damage cooldown and plays attack animation and sound.
     */
    onCollisionWithPlayer() {
    const now = Date.now();
    if (!this.isDead && now - this.lastDamageTime > this.damageCooldown) {
        this.lastDamageTime = now;
        this.endbossAttack_sound.play();
        this.playOnce(this.IMAGES_ATTACK, 1000);
        world.character.handlePlayerHit(this); // ← вместо этого
    }
}

    /**
     * animate
     * Main animation loop running every 200ms.
     * Chooses animation based on Endboss state: hurt, alert, attack, or idle walking.
     */
    animate() {
        this.animateInt = setInterval(() => {
            if (this.isDead) return;
            else if (this.isHurt()) {
                this.playHurt();
            } else if (this.energy <= 80 && !this.alertActive && !this.alertattack) {
                this.playAlert();
            } else if (this.energy <= 60 && !this.alertattack) {
                this.playAttack();
            }
        }, 200);
    }

    /**
     * playHurt
     * Plays hurt animation and sound once.
     * Stops movement and resumes walking after animation ends.
     */
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
     * playdie
     * Plays death animation frames sequentially.
     * Calls preparation and finish methods for death sequence.
     */
    playdie() {
        this.prepareDeath();
        let i = 0;
        const deathInterval = setInterval(() => {
            if (i >= this.IMAGES_DEAD.length) {
                clearInterval(deathInterval);
                this.finishDeath();
            } else {
                this.img = this.imageCache[this.IMAGES_DEAD[i]];
                i++;
            }
        }, 150);
    }

    /**
     * Pauses all endboss-related sounds to stop them from playing.
     */
    pauseAllSounds() {
        this.endbossHurt_sound.pause();
        this.endbossAttack_sound.pause();
    }

    /**
     * prepareDeath
     * Stops movement and animation intervals.
     * Sets speed to zero and resets current image index.
     */
    prepareDeath() {
        clearInterval(this.moveleftInt);
        clearInterval(this.playAniInt);
        this.speed = 0;
        this.currentImage = 0;
        this.pauseAllSounds();
    }

    /**
     * finishDeath
     * Finalizes death by moving Endboss offscreen.
     * Sets splicable flag and plays win sound.
     * Triggers win screen after delay.
     */
    finishDeath() {
        setTimeout(() => {
            this.y = -1000;
            this.isSplicable = true;
            if (world && world.win_sound) world.win_sound.play();
            setTimeout(() => showWinScreen(), 1000);
        }, 1000);
    }

    /**
     * playAlert
     * Plays alert animation and sound once.
     * Stops movement and sets high speed during alert.
     * Resumes walking after animation ends.
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
     * playAttack
     * Plays attack animation and sound once.
     * Stops all intervals and sets very high speed during attack.
     * Resumes walking and main animation after animation ends.
     */
    playAttack() {
        if (this.alertattack) return;
        this.alertattack = true;
        clearInterval(this.moveleftInt);
        clearInterval(this.playAniInt);
        clearInterval(this.animateInt);
        this.speed = 25;
        this.playOnce(this.IMAGES_ATTACK, 2800);
        setTimeout(() => {
            this.alertattack = false;
            this.walkLeft();
            this.animate();
        }, 3300);
    }

    /**
     * Starts the boss's aggressive behavior after first hit.
     * Boss hunts the player and attacks when close.
     */
    startAggressiveLoop() {
        setInterval(() => {
            if (this.firstHitTaken && !this.isDead) {
                this.huntPlayer();
                if (!this.alertattack && this.isPlayerClose()) {
                    this.playAttack();
                }
            }
        }, 2000);
    }

    /**
     * Moves the boss toward the player's position.
     * Adjusts direction based on player's x-coordinate.
     */
    huntPlayer() {
        clearInterval(this.moveleftInt);
        clearInterval(this.playAniInt);
        this.moveleftInt = setInterval(() => {
            if (world.character.x < this.x) {
                this.x -= this.speed;
            } else if (world.character.x > this.x) {
                this.x += this.speed;
            }
        }, 50);
        this.playAniInt = setInterval(() => {
            this.playAnimation(this.IMAGES_WALKING);
        }, 150);
    }

    /**
     * Checks if the player is within attack range.
     * @returns {boolean} True if player is closer than 300px
     */
    isPlayerClose() {
        const distance = Math.abs(this.x - world.character.x);
        return distance < 300;
    }

}