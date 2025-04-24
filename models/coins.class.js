class Coin extends MovableObject {

    IMAGES_WALKING = [
        'img/8_coin/coin_1.png',
        'img/8_coin/coin_2.png'
    ];


    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.x = 1000;
        this.animate();
    }

    
    animate() {
        setInterval( () => {
            this.playAnimation(this.IMAGES_WALKING); 
        }, 400);
    }





}