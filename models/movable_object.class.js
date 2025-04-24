class MovableObject {
    x = 120;
    y = 280;
    width = 100;
    height = 150;
    img;
    imageCache = {};
    currentImage = 0;
    speed = 0.15;
    otherDirection = false;

    loadImage(path) {
        this.img = new Image(); // this.img = document.getElementById('image') <img id="image" src>
        this.img.src = path;
    }

    /**
     * 
     * @param {Array} arr - [img/image1.png, img/image2.png, ....]
     */
    loadImages(arr) {
        arr.forEach( (path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    moveRight() {
        console.log('Moving right'); 
    }

    moveLeft() {
        setInterval( () => {
            this.x -= this.speed;
        }, 1000 / 60);
    }
    
    playAnimation(images) {
        let i = this.currentImage % this.IMAGES_WALKING.length; // let i = 0 (%- Rest) 6 .....=> let i = 0, 1, 2, 3, 4, 5, 0, 1, 2, 3, 4, 5........
            let path = images[i];
            this.img = this.imageCache[path];
            this.currentImage ++;
    }
}