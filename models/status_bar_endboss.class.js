class StatusBarEndboss extends DrawableObject {

    /**
     * StatusBarEndboss class
     * Represents the endboss health/status bar with fixed position and size.
     * Extends DrawableObject to handle image rendering.
     */
    x = 500;
    y = 10;
    width = 200;
    height = 50;

    /**  
     * IMAGES - Array of images for different health levels of the endboss status bar.
     */
    IMAGES = [
        'img/7_statusbars/2_statusbar_endboss/blue/blue0.png',
        'img/7_statusbars/2_statusbar_endboss/blue/blue20.png',
        'img/7_statusbars/2_statusbar_endboss/blue/blue40.png',
        'img/7_statusbars/2_statusbar_endboss/blue/blue60.png',
        'img/7_statusbars/2_statusbar_endboss/blue/blue80.png',
        'img/7_statusbars/2_statusbar_endboss/blue/blue100.png'
    ];

    /**  
     * constructor() - Loads images and sets initial status bar percentage to 100.
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.setPercentage(100);
    }

    /**  
     * setPercentage(percentage) - Updates the displayed image based on health percentage.
     * @param {number} percentage - Current health percentage.
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    /**  
     * resolveImageIndex() - Returns the index of the image matching the current percentage.
     * @returns {number} - Image index for current health percentage.
     */
    resolveImageIndex() {
        if (this.percentage == 100) {
            return 5;
        } else if (this.percentage > 80) {
            return 4;
        } else if (this.percentage > 60) {
            return 3;
        } else if (this.percentage > 40) {
            return 2;
        } else if (this.percentage > 20) {
            return 1;
        } else {
            return 0;
        }
    }
}