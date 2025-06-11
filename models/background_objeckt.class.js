class BackgroundObject extends MovableObject {

    /**
     * Default width of the background object.
     * @type {number}
     */
    width = 720;
    height = 480;

    /**
     * Creates a background object at a specified x-position.
     * Loads the image and positions it at the bottom of the screen.
     * 
     * @param {string} imageRath - The path to the background image.
     * @param {number} x - The horizontal position of the background object.
     */
    constructor(imageRath, x) {
        super().loadImage(imageRath);
        this.x = x;
        this.y = 480 - this.height;
    }
}