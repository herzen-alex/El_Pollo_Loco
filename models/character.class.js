class Character extends MovableObject {
    y = 150;
    height = 280;
    width = 180;
    speed = 7;
    isJumping = false;
    world;
    amountCoins = 0;
    amountBottle = 0;
    isThrowingBottle = false;


    snoring = new Audio('audio/snoring.mp3');
    deadAudio = new Audio('audio/dead_audio.mp3');
    walking = new Audio('audio/running.mp3');
    jumping = new Audio('audio/jump.mp3');
    hurt_sound = new Audio('audio/hurt.mp3');

    offset = {
        top: 80,
        left: 20,
        right: 20,
        bottom: 10
    };

    lastActionTime = new Date().getTime();

    IMAGES_WALKING = [
        'img/2_character_pepe/2_walk/W-21.png',
        'img/2_character_pepe/2_walk/W-22.png',
        'img/2_character_pepe/2_walk/W-23.png',
        'img/2_character_pepe/2_walk/W-24.png',
        'img/2_character_pepe/2_walk/W-25.png',
        'img/2_character_pepe/2_walk/W-26.png'
    ];

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

    IMAGES_DEAD = [
        'img/2_character_pepe/5_dead/D-51.png',
        'img/2_character_pepe/5_dead/D-52.png',
        'img/2_character_pepe/5_dead/D-53.png',
        'img/2_character_pepe/5_dead/D-54.png',
        'img/2_character_pepe/5_dead/D-55.png',
        'img/2_character_pepe/5_dead/D-56.png',
        'img/2_character_pepe/5_dead/D-57.png'
    ];

    IMAGES_HURT = [
        'img/2_character_pepe/4_hurt/H-41.png',
        'img/2_character_pepe/4_hurt/H-42.png',
        'img/2_character_pepe/4_hurt/H-43.png'
    ];

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

    animate() {

        setInterval(() => {
            this.moveCharacter();
        }, 1000 / 60);

        setInterval(() => {
            this.playCharacter();
        }, 50);
    }

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
        this.world.camera_x = -this.x + 100;
    }

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

    jump() {
        this.speedY = 30;
        this.isJumping = true;
        this.currentImageIndex = 0;
    }

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


    playCharacter() {
        this.handleDeadAnimation();
        this.handleHurtAnimation();
        this.handleJumpingAnimation();
        this.handleWalkingAnimation();
    }

    handleDeadAnimation() {
        if (this.isDead()) {
            this.playAnimation(this.IMAGES_DEAD);
            this.snoring.pause();
            this.pepeIsDead();
        }
    }

    handleHurtAnimation() {
        if (this.isHurt() && !this.isDead()) {
            this.playAnimation(this.IMAGES_HURT);
            this.snoring.pause();
        }
    }

    handleJumpingAnimation() {
        if (this.isAboveGround() && !this.isDead() && !this.isHurt()) {
            this.playAnimationOnce(this.IMAGES_JUMPING);
            this.snoring.pause();
        }
    }

    handleWalkingAnimation() {
        if (!this.isAboveGround() &&
            !this.isDead() &&
            !this.isHurt() &&
            (this.world.keyboard.RIGHT || this.world.keyboard.LEFT)) {
            this.playAnimation(this.IMAGES_WALKING);
            this.snoring.pause();
        }
    }

    idleCharacter() {
        setInterval(() => {
            let timeSinceLastAction = new Date().getTime() - this.lastActionTime;
            if (timeSinceLastAction > 500 && !this.isThrowingBottle) {
                this.playAnimation(this.IMAGES_IDLE);
            }
        }, 400);
    }

    idleLongCharacter() {
        setInterval(() => {
            let timeSinceLastAction = new Date().getTime() - this.lastActionTime;
            if (timeSinceLastAction > 3000 && !this.isThrowingBottle) {
                this.playAnimation(this.IMAGES_LONG_IDLE);
                this.snoring.play();
            }
        }, 400);
    }

    pepeIsDead() {
        if (this.energy == 0) {
            this.deadAudio.play();
            setTimeout(() => {
                gameOver();
            }, 1000);
        }
    }

    jumpOn(enemy) {
        if (enemy.isDead) return;
        this.speedY = 15;
        enemy.die();
        this.jumping.play();
    }

    collectCoin() {
        this.amountCoins += 20;
        if (this.amountCoins > 100) {
            this.amountCoins = 100;
        }
    }

    collectBottle() {
        this.amountBottle += 1;
        if (this.amountBottle > 100) {
            this.amountBottle = 100;
        }
    }

    checkEndbossCollision() {
        const boss = this.world.endboss;
        if (!boss || boss.isDead) return;
        if (this.isColliding(boss)) {
            if (!this.isHurt()) {
                this.hit(60);
                this.world.statusBar.setPercentage(this.energy);
                this.hurt_sound.play();
            }
            if (this.x < boss.x) {
                this.x = boss.x - this.width - 5;
            } else {
                this.x = boss.x + boss.width + 5;
            }
        }
    }
}


