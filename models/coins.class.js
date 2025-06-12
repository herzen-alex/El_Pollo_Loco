class Coin extends MovableObject {

    /**
     * Array of coin animation images.
     * @type {string[]}
     */
    IMAGES_WALKING = [
        'img/8_coin/coin_1.png',
        'img/8_coin/coin_2.png'
    ];

    /**
     * Offset values for collision detection or positioning.
     * @type {{top: number, left: number, right: number, bottom: number}}
     */
    offset = {
        top: 35,
        bottom: 50,
        left: 35,
        right: 35
    };

    /**
     * Initializes coin position, loads images, and starts animation.
     */
    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.x = 300 + Math.random() * 2000;
        this.y = 20 + Math.random() * 100;
        this.animate();
    }

    /**
     * Animates the coin by cycling through walking images.
     */
    animate() {
        setInterval(() => {
            this.playAnimation(this.IMAGES_WALKING);
        }, 400);
    }
}