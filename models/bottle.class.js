class Bottle extends MovableObject {

    height = 70;
    y = 355;

    IMAGES_WALKING = [
        'img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
        'img/6_salsa_bottle/2_salsa_bottle_on_ground.png'
    ];


    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.x = 400 + Math.random() * 3000;
        this.animate();
    }

    
    animate() {
        setInterval( () => {
            this.playAnimation(this.IMAGES_WALKING); 
        }, 400);
    }





}