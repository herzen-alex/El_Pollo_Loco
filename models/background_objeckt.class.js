class BackgroundObject extends MovableObject {

    width = 720;
    height = 480;

    constructor(imageRath, x) {
        super().loadImage(imageRath);
        this.x = x;
        this.y = 480 - this.height; // Gesamte Höhe 480px - Höhe vom Bild (400) = 80

    }
}