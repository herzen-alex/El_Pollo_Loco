class World {

    /**
     * Holds the game world state, including level, rendering context, camera position, and input handling.
     */
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;

    /**
     * Game world objects representing the main character and different status bars (health, coin, bottle, endboss).
     */
    character = new Character();
    statusBar = new StatusBar();
    statusBarCoin = new StatusBarCoin();
    statusBarBottle = new StatusBarBottle();
    statusBarEndboss = new StatusBarEndboss();

    /**
     * Array holding all active throwable objects in the game world.
     */
    throwableObjects = [];

    /**
     * Audio elements for various sound effects in the game.
     */
    coins_audio = new Audio('audio/coins.mp3');
    bottle_audio = new Audio('audio/bottle-clink.mp3');
    hurt_sound = new Audio('audio/hurt.mp3');
    win_sound = new Audio('audio/win.mp3');

    /**
     * Initializes the world with canvas, keyboard, and game loop.
     */
    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
        this.run();
        this.lastThrowTime = 0;
    }

    /**
     * Links the character and endboss to the world.
     */
    setWorld() {
        this.character.world = this;
        this.endboss = this.level.enemies.find(e => e instanceof Endboss);
    }

    /**
     * Returns an array of all chicken-type enemies.
     * @returns {Array}
     */
    get chickens() {
        return this.level.enemies.filter(e => e instanceof Chicken || e instanceof Small_Chicken);
    }

    /**
     * Starts the game loop, checking collisions, coins, bottles, and boss energy.
     */
    run() {
        setInterval(() => {
            this.checkCollisions();
            this.checkEndbossCollision();
            this.checkThrowObjects();
            this.collectOfCoins();
            this.collectOfBottles();
            this.checkEndbossEnergie();
        }, 200);
    }

    /**
     * Checks if the player can throw a bottle and initiates the throw if allowed.
     */
    checkThrowObjects() {
        const now = Date.now();
        const throwCooldown = 1500;
        if (this.canThrowBottle(now, throwCooldown)) {
            this.throwBottle();
            this.lastThrowTime = now;
        }
    }

    /**
     * Determines if the player is allowed to throw a bottle.
     * @param {number} now - Current time in milliseconds.
     * @param {number} cooldown - Time delay between throws.
     * @returns {boolean}
     */
    canThrowBottle(now, cooldown) {
        return (
            this.keyboard.D &&
            this.keyboard.canThrow &&
            this.character.amountBottle > 0 &&
            now - this.lastThrowTime > cooldown
        );
    }

    /**
     * Creates and throws a new bottle object in the game.
     */
    throwBottle() {
        const direction = this.character.otherDirection ? 'left' : 'right';
        const offsetX = direction === 'left' ? -20 : 100;
        const bottle = new ThrowableObject(
            this.character.x + offsetX,
            this.character.y + 100,
            this.character,
            direction
        );
        this.throwableObjects.push(bottle);
        this.character.amountBottle--;
        this.statusBarBottle.setPercentage(this.character.amountBottle * 20);
        this.keyboard.canThrow = false;
    }

    /**
     * Checks collisions between the player and enemies.
     */
    checkCollidions() {
        this.level.enemies.forEach((enemy) => {
            if (this.character.isColliding(enemy)) {
                this.character.hit();
                this.statusBar.setPercentage(this.character.energy)
            }
        });
    }

    /**
     * Main render loop: clears canvas, draws all game layers, and schedules next frame.
     */
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.camera_x, 0);
        this.drawBackgroundAndCharacter();
        this.ctx.translate(-this.camera_x, 0);
        this.drawStatusBars();
        this.ctx.translate(this.camera_x, 0);
        this.drawForegroundObjects();
        this.ctx.translate(-this.camera_x, 0);
        requestAnimationFrame(() => this.draw());
    }

    /**
     * Draws background elements, character, and clouds with camera offset.
     */
    drawBackgroundAndCharacter() {
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.clouds);
    }

    /**
     * Draws status bars including endboss bar if alive.
     */
    drawStatusBars() {
        const endboss = this.level.enemies.find(e => e instanceof Endboss);
        if (endboss && !endboss.isDead) {
            this.addToMap(this.statusBarEndboss);
        }
        this.addToMap(this.statusBarBottle);
        this.addToMap(this.statusBarCoin);
        this.addToMap(this.statusBar);
    }

    /**
     * Draws enemies, throwable objects, coins, and bottles with camera offset.
     */
    drawForegroundObjects() {
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.bottles);
    }

    /**
     * Adds multiple objects to the map.
     * @param {Array} objects - Array of drawable objects.
     */
    addObjectsToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o);
        });
    }

    /**
     * Adds a single object to the map, handling flipping if needed.
     * @param {Object} mo - Movable object.
     */
    addToMap(mo) {
        if (mo.otherDirection) {
            this.flipImage(mo);
        }
        mo.draw(this.ctx);
        mo.drawFrame(this.ctx);
        if (mo.otherDirection) {
            this.flipImageBack(mo);
        }
    }

    /**
     * Flips the image horizontally for objects facing the other direction.
     * @param {Object} mo - Movable object.
     */
    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0)
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    /**
     * Restores image flip after drawing.
     * @param {Object} mo - Movable object.
     */
    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }

    /**
     * Collects coins if the character collides with them and updates the status bar.
     */
    collectOfCoins() {
        this.level.coins.forEach((coin, i) => {
            if (this.character.isColliding(coin)) {
                this.character.collectCoin();
                let coinSound = new Audio('audio/coins.mp3');
                coinSound.play();
                this.level.coins.splice(i, 1);
                this.statusBarCoin.setPercentage(this.character.amountCoins);
            }
        });
    }

    /**
     * Collects bottles if the character collides with them and updates the status bar.
     */
    collectOfBottles() {
        this.level.bottles.forEach((bottle, i) => {
            if (this.character.amountBottle < 5 && this.character.isColliding(bottle)) {
                this.character.amountBottle++;
                let bottleSound = new Audio('audio/bottle-clink.mp3');
                bottleSound.play();
                this.level.bottles.splice(i, 1);
                let percentage = this.character.amountBottle * 20;
                this.statusBarBottle.setPercentage(percentage);
            }
        });
    }

    /**
     * Checks collisions between character, enemies, and bottles.
     */
    checkCollisions() {
        this.checkCharacterEnemyCollisions();
        this.checkBottleEnemyCollisions();
    }

    /**
     * Checks collisions between character and enemies, handles jump kills and damage.
     */
    checkCharacterEnemyCollisions() {
        this.level.enemies.forEach((enemy) => {
            if (this.characterJumpToKill(enemy)) {
                if (enemy instanceof Chicken || enemy instanceof Small_Chicken) {
                    this.character.jumpOn(enemy);
                }
            } else if (this.character.isColliding(enemy) && !enemy.isDead) {
                this.characterGetsHurt(enemy);
            }
        });
        this.level.enemies = this.level.enemies.filter(enemy => !enemy.isSplicable);
    }

    /**
     * Checks if character is falling and landing on top half of an enemy.
     * @param {Object} enemy - Enemy object to check collision with.
     * @returns {boolean} True if character is jumping on the enemy.
     */
    isCharacterJumpingOn(enemy) {
        const isFalling = this.character.speedY > 0;
        const characterBottom = this.character.y + this.character.height;
        const enemyTop = enemy.y;
        return (
            this.character.isColliding(enemy) &&
            isFalling &&
            characterBottom <= enemyTop + enemy.height / 2
        );
    }

    /**
     * Checks if character is colliding and moving upwards to kill an enemy.
     * @param {Object} enemy - Enemy object to check collision with.
     * @returns {boolean} True if character is jumping to kill enemy.
     */
    characterJumpToKill(enemy) {
        return this.character.isColliding(enemy) &&
            this.character.isAboveGround() &&
            this.character.speedY < 0;
    }

    /**
     * Handles damage to character when colliding with an enemy.
     * @param {Object} enemy - Enemy causing damage.
     */
    characterGetsHurt(enemy) {
        let damage = 5;
        if (enemy instanceof Endboss) {
            damage = 90;
        }
        this.character.hit(damage);
        this.hurt_sound.play();
        this.statusBar.setPercentage(this.character.energy);
    }

    /**
     * Checks collisions between throwable bottles and enemies, removes splashed bottles.
     */
    checkBottleEnemyCollisions() {
        for (let i = this.throwableObjects.length - 1; i >= 0; i--) {
            const bottle = this.throwableObjects[i];
            this.checkCollisionWithEnemies(bottle);
            if (bottle.isSplicable) {
                this.throwableObjects.splice(i, 1);
            }
        }
    }

    /**
     * Checks collision of a bottle with enemies and triggers splash and damage.
     * @param {Object} bottle - Throwable bottle object.
     */
    checkCollisionWithEnemies(bottle) {
        this.level.enemies.forEach((enemy) => {
            if (bottle.isColliding(enemy) && !bottle.collidedWith[enemy.id]) {
                bottle.collidedWith[enemy.id] = true;
                bottle.splash(enemy);
                this.handleEnemyDamage(enemy);
            }
        });
    }

    /**
     * Applies damage to enemy and updates endboss health bar if needed.
     * @param {Object} enemy - Enemy receiving damage.
     */
    handleEnemyDamage(enemy) {
        if (enemy instanceof Endboss) {
            enemy.takeDamage(12.5);
            this.statusBarEndboss.setPercentage(enemy.energy);
        } else {
            enemy.takeDamage(90);
        }
    }

    /**
     * Checks if character is colliding with any enemy.
     * @returns {boolean} True if collision detected.
     */
    characterIsCollidingWithAnyEnemy() {
        return this.level.enemies.some(enemy => this.character.isColliding(enemy));
    }

    /**
     * Updates endboss energy status bar.
     */
    checkEndbossEnergie() {
        const endboss = this.level.enemies.find(enemy => enemy instanceof Endboss);
        if (endboss) {
            if (endboss.energy > 0) {
                this.statusBarEndboss.setPercentage(endboss.energy);
            } else {
                this.statusBarEndboss.setPercentage(0);
            }
        }
    }

    /**
     * Checks collision between character and endboss and applies damage if needed.
     */
    checkEndbossCollision() {
        if (this.endboss && this.character.isColliding(this.endboss)) {
            if (!this.character.isHurt()) {
                this.characterGetsHurt(this.endboss);
            }
        }
    }
}