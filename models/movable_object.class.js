class MovableObject extends DrawableObject {

  /**
   * Base class for movable objects with properties for movement, direction, physics, and health.
   * @property {number} speed - Horizontal movement speed.
   * @property {boolean} otherDirection - Indicates if object is facing opposite direction.
   * @property {number} speedY - Vertical speed (for jumping/falling).
   * @property {number} acceleration - Gravity or acceleration applied vertically.
   * @property {number} lastHit - Timestamp of last damage taken.
   * @property {number} energy - Health or energy level.
   */
  speed = 0.15;
  otherDirection = false;
  speedY = 0;
  acceleration = 2.5;
  lastHit = 0;
  energy = 100;

  /**
   * Offset values for collision detection or positioning.
   * @type {{top: number, left: number, right: number, bottom: number}}
   */
  offset = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  };

  /**
   * Applies gravity effect, moving the object down if above ground or falling.
   */
  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      } else if (this instanceof Character) {
        this.y = 150;
      }
    }, 1000 / 25);
  }

  /**
   * Checks if object is above the ground level.
   * @returns {boolean}
   */
  isAboveGround() {
    if (this instanceof ThrowableObject) { // TrowalbeObject should always fall
      return true;
    } else {
      return this.y < 145;
    }
  }

  /**
   * Checks collision with another movable object considering offsets.
   * @param {MovableObject} mo
   * @returns {boolean}
   */
  isColliding(mo) {
    if (!mo) return false;
    return (
      this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
      this.x + this.offset.left < mo.x + mo.width - mo.offset.right &&
      this.y + this.height - this.offset.bottom > mo.y + mo.offset.top &&
      this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom
    );
  }

  /**
   * Reduces energy by damage amount and updates last hit time.
   * @param {number} damage - Damage to apply (default 5)
   */
  hit(damage = 5) {
    this.energy -= damage;
    if (this.energy < 0) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  /**
   * Checks if object was hurt recently (within 0.5 seconds).
   * @returns {boolean}
   */
  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit; // Difference in ms
    timepassed = timepassed / 1000; // Difference in s
    return timepassed < 0.5;
  }

  /**
   * Checks if object's energy is zero (dead).
   * @returns {boolean}
   */
  isDead() {
    return this.energy == 0;
  }

  /**
   * Moves object to the right by speed.
   */
  moveRight() {
    this.x += this.speed;
  }

  /**
   * Moves object to the left by speed.
   */
  moveLeft() {
    this.x -= this.speed;
  }

  /**
   * Initiates a jump by setting vertical speed.
   */
  jump() {
    this.speedY = 30;
  }

  /**
   * Jumps on an enemy, kills it, and bounces up.
   * @param {MovableObject} enemy
   */
  jumpOn(enemy) {
    if (enemy && typeof enemy.die === 'function') {
      enemy.die();
      this.speedY = 15;
    }
  }

  /**
   * Plays animation cycling through an array of image paths.
   * @param {string[]} images
   */
  playAnimation(images) {
    let i = this.currentImage % images.length; // let i = 0 (%- Rest) 6 .....=> let i = 0, 1, 2, 3, 4, 5, 0, 1, 2, 3, 4, 5........
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  /**
   * Moves a chicken object back and forth between two x-coordinates.
   */
  moveChicken() {
    setInterval(() => {
      if (this.x <= 350) {
        this.otherDirection = true;
      }
      if (this.x >= 1400) {
        this.otherDirection = false;
      }
      if (this.otherDirection) {
        this.moveRight();
      } else {
        this.moveLeft();
      }
    }, 1000 / 60);
  }

  /**
   * Plays an animation sequence once over given duration.
   * @param {string[]} images
   * @param {number} duration - Total duration in ms
   */
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
