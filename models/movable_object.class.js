class MovableObject extends DrawableObject {
  speed = 0.15;
  otherDirection = false;
  speedY = 0;
  acceleration = 2.5;
  lastHit = 0;
  energy = 100;

  offset = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  };

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

  isAboveGround() {
    if (this instanceof ThrowableObject) { // TrowalbeObject should always fall
      return true;
    } else {
      return this.y < 145;
    }
  }

  // character.isColliding(chicken);
  isColliding(mo) {
    return (
      this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
      this.y + this.height - this.offset.bottom > mo.y + mo.offset.top &&
      this.x + this.offset.left < mo.x - mo.offset.right &&
      this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom
    );
  }

  hit() {
    this.energy -= 5;
    if (this.energy < 0) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit; // Difference in ms
    timepassed = timepassed / 1000; // Difference in s
    return timepassed < 0.5;
  }

  isDead() {
    return this.energy == 0;
  }

  moveRight() {
    this.x += this.speed;
  }

  moveLeft() {
    this.x -= this.speed;
  }

  jump() {
    this.speedY = 30;
  }

  jumpOn(enemy) {
    if (enemy && typeof enemy.die === 'function') {
      enemy.die();
      this.speedY = 15; // отскакиваем вверх после убийства
    }
  }


  playAnimation(images) {
    let i = this.currentImage % images.length; // let i = 0 (%- Rest) 6 .....=> let i = 0, 1, 2, 3, 4, 5, 0, 1, 2, 3, 4, 5........
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

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




}
