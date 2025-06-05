class ThrowableObject extends MovableObject {

    throwAudio = new Audio('audio/throwing.mp3');
    bottleAudio = new Audio('audio/bottle.mp3');

    direction = 'right';
    splashing = false;

    offset = {
        top: 5,
        bottom: 5,
        left: 5,
        right: 5
    };

    collidedWith = {};

    IMAGES_ROTATION = [
        'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
    ];

    IMAGES_SPLASH = [
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png'
    ];

    constructor(x, y, character, direction) {
        super().loadImage('img/6_salsa_bottle/salsa_bottle.png');
        this.loadImages(this.IMAGES_ROTATION);
        this.loadImages(this.IMAGES_SPLASH);
        this.x = x;
        this.y = y;
        this.height = 70;
        this.character = character;
        this.direction = direction;
        this.throw();
        this.animateRotation();

    }

    throw() {
        this.throwAudio.play();
        this.speedY = 30;
        this.applyGravity();
        if (this.character) {
            this.character.lastActionTime = new Date().getTime();
            this.character.isThrowingBottle = true;
            setTimeout(() => {
                this.character.isThrowingBottle = false;
            }, 500);
        }
        this.throwInterval = setInterval(() => {
            if (this.direction === 'right') {
                this.x += 10;
            } else {
                this.x -= 10;
            }
        }, 25);
    }

    animateRotation() {
        this.rotationInterval = setInterval(() => {
            if (!this.splashing) {
                this.playAnimation(this.IMAGES_ROTATION);
            }
        }, 100);
    }

    splash(enemy) {
        if (this.splashing) return;
        this.splashing = true;
        clearInterval(this.throwInterval);
        clearInterval(this.rotationInterval);
        this.playAnimation(this.IMAGES_SPLASH);
        this.bottleAudio.play();
        setTimeout(() => {
            const index = world.throwableObjects.indexOf(this);
            if (index !== -1) {
                world.throwableObjects.splice(index, 1);
            }
            if (this.character) {
                this.character.isThrowingBottle = false;
                this.character.lastActionTime = new Date().getTime();
            }
        }, 600);
    }






}