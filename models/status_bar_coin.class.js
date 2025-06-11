class StatusBarCoin extends DrawableObject {

    /**
     * StatusBarCoin class represents the coin status bar UI element.
     * It sets position and size for the status bar display.
     */
    x = 30;
    y = 40;
    width = 200;
    height = 50;

    /** 
     * IMAGES - Array of image paths representing coin bar states.
     */
    IMAGES = [
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png'
    ];

    /** 
     * constructor() - Loads images and initializes percentage to 0.
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.setPercentage(0);
    }

    /** 
     * setPercentage(percentage) - Sets current percentage and updates displayed image.
     * @param {number} percentage - Value between 0 and 100.
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    /** 
     * resolveImageIndex() - Determines image index based on current percentage.
     * @returns {number} Image index to display.
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