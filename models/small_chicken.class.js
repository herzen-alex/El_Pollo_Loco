class Small_Chicken extends MovableObject {

    height = 50;
    width = 50;
    y = 370;

    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
    ];

    constructor() {
        super().loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.x = 500 + Math.random() * 1500; // Zahl zwischen 200 und 700
        this.loadImages(this.IMAGES_WALKING);
        this.speed = 0.15 + Math.random() * 0.5;
        this.animate();
    }

    animate() {
        setInterval( () => {
            this.moveLeft();
        }, 1000 / 60);
        
        setInterval( () => {
            this.playAnimation(this.IMAGES_WALKING); 
        }, 200);
    }


}