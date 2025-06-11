class ThrowableObject extends MovableObject {

    /**
     * Audio objects for sound effects used in the game.
     * - throwAudio: sound played when throwing an object.
     * - bottleAudio: sound played on bottle splash or impact.
     */
    throwAudio = new Audio('audio/throwing.mp3');
    bottleAudio = new Audio('audio/bottle.mp3');

    /**
     * Common properties used in the game logic:
     * - collidedWith: tracks collision states with other objects.
     * - direction: current facing direction of the object.
     * - splashing: indicates if the object is currently splashing.
     */
    collidedWith = {};
    direction = 'right';
    splashing = false;

    /**
     * Offset values for collision detection or positioning.
     * @type {{top: number, left: number, right: number, bottom: number}}
     */
    offset = {
        top: 5,
        bottom: 5,
        left: 5,
        right: 5
    };

    /**
     * Array of rotation images for the salsa bottle animation.
     */
    IMAGES_ROTATION = [
        'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
    ];

    /**
     * Array of splash images for the salsa bottle animation.
     */
    IMAGES_SPLASH = [
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png'
    ];

    /**
     * Creates a new salsa bottle object, initializes its position, rotation, and starts throw and animation.
     * @param {number} x - The x-position of the bottle.
     * @param {number} y - The y-position of the bottle.
     * @param {Character} character - The character that threw the bottle.
     * @param {string} direction - The direction of the bottle throw ('left' or 'right').
     */
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

    /**
     * Plays throw sound, applies gravity, and initiates bottle throw animation and movement.
     */
    throw() {
        this.throwAudio.play();
        this.speedY = 30;
        this.applyGravity();
        this.startThrowAnimation();
        this.startMovingBottle();
    }

    /**
     * Updates character throw state with a short timeout.
     */
    startThrowAnimation() {
        if (this.character) {
            this.character.lastActionTime = new Date().getTime();
            this.character.isThrowingBottle = true;
            setTimeout(() => {
                this.character.isThrowingBottle = false;
            }, 500);
        }
    }

    /**
     * Starts the interval that moves the bottle horizontally.
     */
    startMovingBottle() {
        this.throwInterval = setInterval(() => {
            if (this.direction === 'right') {
                this.x += 10;
            } else {
                this.x -= 10;
            }
        }, 25);
    }

    /**
     * Starts the interval that animates the bottle rotation while in air.
     */
    animateRotation() {
        this.rotationInterval = setInterval(() => {
            if (!this.splashing) {
                this.playAnimation(this.IMAGES_ROTATION);
            }
        }, 100);
    }

    /**
     * Triggers splash animation and removes the bottle from the world after splash completes.
     */
    splash(enemy) {
        if (this.splashing) return;
        this.splashing = true;
        clearInterval(this.throwInterval);
        clearInterval(this.rotationInterval);
        this.playAnimation(this.IMAGES_SPLASH);
        this.bottleAudio.play();
        setTimeout(() => this.removeBottleFromWorld(), 600);
    }

    /**
     * Removes the bottle object from the world and resets character throw state.
     */
    removeBottleFromWorld() {
        const index = world.throwableObjects.indexOf(this);
        if (index !== -1) world.throwableObjects.splice(index, 1);
        if (this.character) {
            this.character.isThrowingBottle = false;
            this.character.lastActionTime = new Date().getTime();
        }
    }
}