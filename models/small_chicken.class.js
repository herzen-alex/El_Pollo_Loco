class Small_Chicken extends MovableObject {

    height = 50;
    width = 50;
    y = 370;
    isDead = false;
    energy = 10;
    isSplicable = false;

    offset = {
        top: 0,
        bottom: 0,
        left: 5,
        right: 5,
    };

    small_sound = new Audio('audio/small.mp3');

    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
    ];

    IMAGES_DEAD = [
        'img/3_enemies_chicken/chicken_small/2_dead/dead.png'
    ];

    constructor() {
        super().loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.x = 500 + Math.random() * 1500; // Zahl zwischen 200 und 700
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        this.speed = 0.15 + Math.random() * 0.5;
        this.moveChicken();
        this.animate();
        this.isDead = false;
    }

    animate() {
        setInterval(() => {
            if (!this.isDead) {
                this.playAnimation(this.IMAGES_WALKING);
            } else {
                this.playAnimation(this.IMAGES_DEAD);
            }
        }, 200);
    }

    takeDamage(amount) {
        this.energy = Math.max(0, this.energy - amount);
        if (this.energy === 0 && !this.isDead) {
            this.die();
        }
    }

    die() {
        this.isDead = true;
        this.speed = 0;
        this.small_sound.play();
        setTimeout(() => {
            this.small_sound.pause();
            this.small_sound.currentTime = 0;
        }, 1000);
        this.playOnce(this.IMAGES_DEAD, 500);
        setTimeout(() => {
            this.isSplicable = true; 
        }, 500);
    }

}