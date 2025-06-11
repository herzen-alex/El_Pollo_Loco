class DrawableObject {

/**
 * Basic properties for position, size, image handling, and status percentages.
 */
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

/**
 * Loads an image from the specified path.
 * @param {string} path - Image file path.
 */
  loadImage(path) {
    this.img = new Image(); // this.img = document.getElementById('image') <img id="image" src>
    this.img.src = path;
  }

/**
 * Draws the current image on the given canvas context.
 * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
 */
  draw(ctx) {
    try {
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    } catch (e) {
      console.warn('Error loading image', e);
      console.log('Could not load image,', this.img.src);
    }
  }

/**
 * (Empty) Intended to draw a frame around the image (not implemented).
 * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
 */
  drawFrame(ctx) {

  }

  /**
  * 
  * @param {Array} arr - [img/image1.png, img/image2.png, ....]
  */
  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }
}