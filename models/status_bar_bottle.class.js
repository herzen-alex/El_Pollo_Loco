class StatusBarBottle extends DrawableObject {

    /**
     * StatusBarBottle class properties:
     * x, y - position coordinates
     * width, height - size dimensions
     */
    x = 30;
    y = 80;
    width = 200;
    height = 50;

    /**  
     * IMAGES - Array of status bar images representing fill levels.  
     */
    IMAGES = [
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/0.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/20.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/80.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png'
    ];

    /**  
     * constructor() - Loads all status bar images and sets initial percentage to 0.  
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.setPercentage(0);
    }

    /**  
     * setPercentage(percentage) - Updates displayed image according to the given percentage.  
     * @param {number} percentage - Current fill percentage of the status bar.  
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    /**  
     * resolveImageIndex() - Returns the image index corresponding to the current percentage.  
     * @returns {number} Index of the image to display.  
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