class Bottle extends MovableObject {

    /**
     * Default height of the bottle.
     * @type {number}
     */
    height = 70;

    /**
     * Default vertical position of the bottle.
     * @type {number}
     */
    y = 355;

    /**
     * Array of image paths representing the walking animation of the bottle.
     * @type {string[]}
     */
    IMAGES_WALKING = [
        'img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
        'img/6_salsa_bottle/2_salsa_bottle_on_ground.png'
    ];

    /**
 * Offset values for collision detection or positioning.
 * @type {{top: number, left: number, right: number, bottom: number}}
 */
    offset = {
        top: 40,
        bottom: 60,
        left: 60,
        right: 40
    };

    /**
     * Creates a new bottle object with a random horizontal position.
     * Loads the images and starts the animation.
     */
    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.x = 400 + Math.random() * 3000;
        this.animate();
    }

    /**
     * Starts the animation loop that cycles through the walking images.
     */
    animate() {
        setInterval(() => {
            this.playAnimation(this.IMAGES_WALKING);
        }, 400);
    }
}