class Coin extends MovableObject {

    IMAGES_WALKING = [
        'img/8_coin/coin_1.png',
        'img/8_coin/coin_2.png'
    ];

    offset = {
        top: 40,
        bottom: 40,
        left: 40,
        right: 40
    };

    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.x = 300 + Math.random() * 2000;
        this.y = 20 + Math.random() * 100;
        this.animate();
    }

    
    animate() {
        setInterval( () => {
            this.playAnimation(this.IMAGES_WALKING); 
        }, 400);
    }





}