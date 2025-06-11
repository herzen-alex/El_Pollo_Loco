class Character extends MovableObject {

    /**
     * Basic properties defining position, size, state, inventory, and world reference.
     */
    y = 150;
    height = 280;
    width = 180;
    speed = 7;
    isJumping = false;
    world;
    amountCoins = 0;
    amountBottle = 0;
    isThrowingBottle = false;

    /**
     * Audio elements for various character sounds (snoring, dead, walking, jumping, hurt).
     * @type {HTMLAudioElement}
     */
    snoring = new Audio('audio/snoring.mp3');
    deadAudio = new Audio('audio/dead_audio.mp3');
    walking = new Audio('audio/running.mp3');
    jumping = new Audio('audio/jump.mp3');
    hurt_sound = new Audio('audio/hurt.mp3');

    /**
     * Offset values for collision detection or positioning.
     * @type {{top: number, left: number, right: number, bottom: number}}
     */
    offset = {
        top: 80,
        left: 20,
        right: 20,
        bottom: 10
    };

    /**
     * Timestamp of the last action performed by the character.
     * @type {number}
     */
    lastActionTime = new Date().getTime();

    /**
     * Image paths for walking animation frames.
     * @type {string[]}
     */
    IMAGES_WALKING = [
        'img/2_character_pepe/2_walk/W-21.png',
        'img/2_character_pepe/2_walk/W-22.png',
        'img/2_character_pepe/2_walk/W-23.png',
        'img/2_character_pepe/2_walk/W-24.png',
        'img/2_character_pepe/2_walk/W-25.png',
        'img/2_character_pepe/2_walk/W-26.png'
    ];

    /**
    * Image paths for jumping animation frames.
    * @type {string[]}
    */
    IMAGES_JUMPING = [
        'img/2_character_pepe/3_jump/J-31.png',
        'img/2_character_pepe/3_jump/J-32.png',
        'img/2_character_pepe/3_jump/J-33.png',
        'img/2_character_pepe/3_jump/J-34.png',
        'img/2_character_pepe/3_jump/J-35.png',
        'img/2_character_pepe/3_jump/J-36.png',
        'img/2_character_pepe/3_jump/J-37.png',
        'img/2_character_pepe/3_jump/J-38.png',
        'img/2_character_pepe/3_jump/J-39.png'
    ];

    /**
     * Image paths for death animation frames.
     * @type {string[]}
     */
    IMAGES_DEAD = [
        'img/2_character_pepe/5_dead/D-51.png',
        'img/2_character_pepe/5_dead/D-52.png',
        'img/2_character_pepe/5_dead/D-53.png',
        'img/2_character_pepe/5_dead/D-54.png',
        'img/2_character_pepe/5_dead/D-55.png',
        'img/2_character_pepe/5_dead/D-56.png',
        'img/2_character_pepe/5_dead/D-57.png'
    ];

    /**
     * Image paths for hurt animation frames.
     * @type {string[]}
     */
    IMAGES_HURT = [
        'img/2_character_pepe/4_hurt/H-41.png',
        'img/2_character_pepe/4_hurt/H-42.png',
        'img/2_character_pepe/4_hurt/H-43.png'
    ];

    /**
     * Image paths for idle animation frames.
     * @type {string[]}
     */
    IMAGES_IDLE = [
        'img/2_character_pepe/1_idle/idle/I-1.png',
        'img/2_character_pepe/1_idle/idle/I-2.png',
        'img/2_character_pepe/1_idle/idle/I-3.png',
        'img/2_character_pepe/1_idle/idle/I-4.png',
        'img/2_character_pepe/1_idle/idle/I-5.png',
        'img/2_character_pepe/1_idle/idle/I-6.png',
        'img/2_character_pepe/1_idle/idle/I-7.png',
        'img/2_character_pepe/1_idle/idle/I-8.png',
        'img/2_character_pepe/1_idle/idle/I-9.png',
        'img/2_character_pepe/1_idle/idle/I-10.png'
    ];

    /**
     * Image paths for long idle animation frames.
     * @type {string[]}
     */
    IMAGES_LONG_IDLE = [
        'img/2_character_pepe/1_idle/long_idle/I-11.png',
        'img/2_character_pepe/1_idle/long_idle/I-12.png',
        'img/2_character_pepe/1_idle/long_idle/I-13.png',
        'img/2_character_pepe/1_idle/long_idle/I-14.png',
        'img/2_character_pepe/1_idle/long_idle/I-15.png',
        'img/2_character_pepe/1_idle/long_idle/I-16.png',
        'img/2_character_pepe/1_idle/long_idle/I-17.png',
        'img/2_character_pepe/1_idle/long_idle/I-18.png',
        'img/2_character_pepe/1_idle/long_idle/I-19.png',
        'img/2_character_pepe/1_idle/long_idle/I-20.png'
    ];

    /**
     * Initializes character by loading images, applying gravity, and starting animations.
     */
    constructor() {
        super().loadImage('img/2_character_pepe/2_walk/W-21.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_LONG_IDLE);
        this.applyGravity();
        this.animate();
        this.idleCharacter();
        this.idleLongCharacter();
    }

    /**
     * Starts the animation loops for character movement and frame updates.
     */
    animate() {
        setInterval(() => {
            this.moveCharacter();
        }, 1000 / 60);
        setInterval(() => {
            this.playCharacter();
        }, 50);
    }

    /**
     * Updates character movement and interactions each frame.
     */
    moveCharacter() {
        if (!this.world.keyboard.RIGHT && !this.world.keyboard.LEFT) {
            if (!this.walking.paused) {
                this.walking.pause();
            }
        }
        this.handleRight();
        this.handleLeft();
        this.handleJump();
        this.checkEndbossCollision();
        this.checkChickenCollisions();
        this.world.camera_x = -this.x + 100;
    }

    /**
     * Handles movement and actions when moving right.
     */
    handleRight() {
        if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
            this.moveRight();
            this.otherDirection = false;
            this.snoring.pause();
            this.lastActionTime = new Date().getTime();
            if (!this.isAboveGround()) {
                if (this.walking.paused) {
                    this.walking.currentTime = 0;
                    this.walking.play().catch(e => {
                        if (e.name !== 'AbortError') console.warn("walking sound error:", e);
                    });
                }
            }
        }
    }

    /**
     * Handles movement and actions when moving left.
     */
    handleLeft() {
        if (this.world.keyboard.LEFT && this.x > 0) {
            this.moveLeft();
            this.otherDirection = true;
            this.snoring.pause();
            this.lastActionTime = new Date().getTime();
            if (!this.isAboveGround()) {
                if (this.walking.paused) {
                    this.walking.currentTime = 0;
                    this.walking.play().catch(e => {
                        if (e.name !== 'AbortError') console.warn("walking sound error:", e);
                    });
                }
            }
        }
    }

    /**
     * Handles jump action when space is pressed.
     */
    handleJump() {
        if (this.world.keyboard.SPACE && !this.isAboveGround()) {
            this.jump();
            this.snoring.pause();
            this.jumping.currentTime = 0;
            this.jumping.play();
            this.walking.pause();
            this.lastActionTime = new Date().getTime();
        }
    }

    /**
     * Initiates jump by setting vertical speed and flags.
     */
    jump() {
        this.speedY = 30;
        this.isJumping = true;
        this.currentImageIndex = 0;
    }

    /**
     * Plays animation sequence once for given images.
     * @param {string[]} images - Array of image paths.
     */
    playAnimationOnce(images) {
        if (!this.currentImageIndex || this.currentImageIndex >= images.length) {
            this.currentImageIndex = 0;
        }
        this.img = this.imageCache[images[this.currentImageIndex]];
        this.currentImageIndex++;
        if (this.currentImageIndex >= images.length) {
            this.currentImageIndex = images.length - 1;
        }
    }

    /**
     * Updates character animations based on state.
     */
    playCharacter() {
        this.handleDeadAnimation();
        this.handleHurtAnimation();
        this.handleJumpingAnimation();
        this.handleWalkingAnimation();
    }

    /**
     * Plays dead animation and triggers death sequence.
     */
    handleDeadAnimation() {
        if (this.isDead()) {
            this.playAnimation(this.IMAGES_DEAD);
            this.snoring.pause();
            this.pepeIsDead();
        }
    }

    /**
     * Plays hurt animation if character is damaged but alive.
     */
    handleHurtAnimation() {
        if (this.isHurt() && !this.isDead()) {
            this.playAnimation(this.IMAGES_HURT);
            this.snoring.pause();
        }
    }

    /**
     * Plays jumping animation when character is in the air.
     */
    handleJumpingAnimation() {
        if (this.isAboveGround() && !this.isDead() && !this.isHurt()) {
            this.playAnimationOnce(this.IMAGES_JUMPING);
            this.snoring.pause();
        }
    }

    /**
     * Plays walking animation if character is moving on the ground.
     */
    handleWalkingAnimation() {
        if (!this.isAboveGround() &&
            !this.isDead() &&
            !this.isHurt() &&
            (this.world.keyboard.RIGHT || this.world.keyboard.LEFT)) {
            this.playAnimation(this.IMAGES_WALKING);
            this.snoring.pause();
        }
    }

    /**
     * Plays idle animation after short inactivity.
     */
    idleCharacter() {
        setInterval(() => {
            let timeSinceLastAction = new Date().getTime() - this.lastActionTime;
            if (timeSinceLastAction > 500 && !this.isThrowingBottle) {
                this.playAnimation(this.IMAGES_IDLE);
            }
        }, 400);
    }

    /**
     * Plays long idle animation and snoring sound after extended inactivity.
     */
    idleLongCharacter() {
        setInterval(() => {
            let timeSinceLastAction = new Date().getTime() - this.lastActionTime;
            if (timeSinceLastAction > 3000 && !this.isThrowingBottle) {
                this.playAnimation(this.IMAGES_LONG_IDLE);
                this.snoring.play();
            }
        }, 400);
    }

    /**
     * Handles game over logic when character dies.
     */
    pepeIsDead() {
        if (this.energy == 0) {
            this.deadAudio.play();
            setTimeout(() => {
                gameOver();
            }, 1000);
        }
    }

    /**
     * Handles jumping on enemy, kills enemy and plays sound.
     * @param {Object} enemy - Enemy object to jump on.
     */
    jumpOn(enemy) {
        if (enemy.isDead) return;
        this.speedY = 15;
        enemy.die();
        this.jumping.play();
    }

    /**
     * Increases coin count, capped at 100.
     */
    collectCoin() {
        this.amountCoins += 20;
        if (this.amountCoins > 100) {
            this.amountCoins = 100;
        }
    }

    /**
     * Increases bottle count, capped at 100.
     */
    collectBottle() {
        this.amountBottle += 1;
        if (this.amountBottle > 100) {
            this.amountBottle = 100;
        }
    }

    /**
     * Checks collision with the endboss and reacts accordingly.
     */
    checkEndbossCollision() {
        const boss = this.world.endboss;
        if (!boss || boss.isDead) return;
        if (this.isColliding(boss)) {
            this.handlePlayerHit(boss);
        }
    }

    /**
     * Handles the player being hit by the boss.
     * @param {Object} boss - Endboss object.
     */
    handlePlayerHit(boss) {
        if (!this.isHurt()) {
            this.hit(60);
            this.world.statusBar.setPercentage(this.energy);
            this.hurt_sound.play();
        }
        this.adjustPlayerPosition(boss);
    }

    /**
     * Adjusts player position to avoid overlapping with the boss.
     * @param {Object} boss - Endboss object.
     */
    adjustPlayerPosition(boss) {
        this.x = (this.x < boss.x) ? boss.x - this.width - 5 : boss.x + boss.width + 5;
    }

    /**
     * Checks collision with chickens and triggers jump attack.
     */
    checkChickenCollisions() {
        if (!this.world || !this.world.chickens) return;
        this.world.chickens.forEach((chicken) => {
            if (
                this.isColliding(chicken) &&
                this.speedY < 0 &&
                (this.y + this.height - this.offset.bottom) <= (chicken.y + 20) &&
                !chicken.isDead
            ) {
                this.jumpOn(chicken);
            }
        });
    }
}


