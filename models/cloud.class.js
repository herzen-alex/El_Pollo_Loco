class Cloud extends MovableObject {

    /**
     * Position and size properties of the cloud.
     * @property {number} y - Vertical position.
     * @property {number} width - Width in pixels.
     * @property {number} height - Height in pixels.
     */
    y = 20;
    width = 500;
    height = 250;

    /**
     * Initializes the cloud with a random horizontal position and starts animation.
     */
    constructor() {
        super().loadImage('img/5_background/layers/4_clouds/1.png');
        this.x = Math.random() * 4000;
        this.animate();
    }

    /**
     * Moves the cloud to the left continuously.
     */
    animate() {
        this.moveLeft();
    }
}