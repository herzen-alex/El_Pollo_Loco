
class Chicken extends MovableObject {

    /**
     * Basic properties for the game chicken or object, including position, state, and health.
     */
    height = 100;
    y = 325;
    isDead = false;
    energy = 10;
    isSplicable = false;
    world;

    /**
     * Offset values for collision detection or positioning.
     * @type {{top: number, left: number, right: number, bottom: number}}
     */
    offset = {
        top: 0,
        bottom: 0,
        left: 40,
        right: 40,
    };

    /**
    * Audio for chicken sound effects.
    * @type {HTMLAudioElement}
    */
    chicken_sound = new Audio('audio/chicken.mp3');

    /**
     * Array of image paths for walking animation.
     * @type {string[]}
     */
    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ];

    /**
     * Array of image paths for dead animation.
     * @type {string[]}
     */
    IMAGES_DEAD = [
        'img/3_enemies_chicken/chicken_normal/2_dead/dead.png'
    ];

    /**
     * Initializes the chicken object with images, position, speed, movement, and animation.
     */
    constructor() {
        super().loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.x = 600 + Math.random() * 1500;
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        this.speed = 0.15 + Math.random() * 0.5;
        this.moveChicken();
        this.animate();
    }

    /**
     * Animates walking or dead images in a loop based on chicken's state.
     */
    animate() {
        setInterval(() => {
            if (!this.isDead) {
                this.playAnimation(this.IMAGES_WALKING);
            } else {
                this.playAnimation(this.IMAGES_DEAD);
            }
        }, 200);
    }

    /**
     * Applies damage to the chicken and triggers death if energy reaches zero.
     * @param {number} amount - Damage amount to apply.
     */
    takeDamage(amount) {
        this.energy = Math.max(0, this.energy - amount);
        if (this.energy === 0 && !this.isDead) {
            this.die();
        }
    }

    /**
     * Handles chicken death: stops movement, plays sound and death animation, sets splice flag.
     */
    die() {
        this.isDead = true;
        this.speed = 0;
        this.chicken_sound.play();
        setTimeout(() => {
            this.chicken_sound.pause();
            this.chicken_sound.currentTime = 0;
        }, 1000);
        this.playOnce(this.IMAGES_DEAD, 500);
        setTimeout(() => {
            this.isSplicable = true;
        }, 500);
    }
}