class StatusBar extends DrawableObject {

    /**
    * StatusBar class represents a generic status bar UI element.
    * It has position (x, y), size (width, height), and manages image display based on a percentage value.
    */
    x = 30;
    y = 0;
    width = 200;
    height = 50;

    /**
     * IMAGES - Array of image paths for different health bar states.
     */
    IMAGES = [
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png'
    ];

    /**
     * constructor - Loads images and initializes health bar at 100%.
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.setPercentage(100);
    }

    /**
     * setPercentage - Updates the displayed image based on the current percentage.
     * @param {number} percentage - Current health percentage.
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    /**
     * resolveImageIndex - Determines the correct image index based on percentage.
     * @returns {number} - Index of the image to display.
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