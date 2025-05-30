class DrawableObject {

    x = 120;
    y = 280;
    width = 100;
    height = 150;
    img;
    imageCache = {};
    currentImage = 0;
    percentage = 100;
    percentageCoin = 0;
    percentageBottle = 0;


    loadImage(path) {
        this.img = new Image(); // this.img = document.getElementById('image') <img id="image" src>
        this.img.src = path;
    }

    draw(ctx) {
      try{
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
      } catch(e) {
        console.warn('Error loading image', e);
        console.log('Could not load image,', this.img.src);
        
      }
    }

    drawFrame(ctx) {
        // if (
        //   this instanceof Character ||
        //   this instanceof Chicken ||
        //   this instanceof Small_Chicken
        // ) {
        //   ctx.beginPath();
        //   ctx.lineWidth = "5";
        //   ctx.strokeStyle = "blue";
        //   ctx.rect(this.x, this.y, this.width, this.height);
        //   ctx.stroke();
        // }
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

        playOnce(images, duration) {
          let i = 0;
          let interval = setInterval(() => {
            if (i >= images.length) {
              clearInterval(interval);
            } else {
              this.img = this.imageCache[images[i]];
              i++;
            }
          }, duration / images.length);
        }


        



}