class World {

    character = new Character();
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    statusBar = new StatusBar();
    statusBarCoin = new StatusBarCoin();
    statusBarBottle = new StatusBarBottle();
    statusBarEndboss = new StatusBarEndboss();
    throwableObjects = [];

    coins_audio = new Audio('audio/coins.mp3');
    bottle_audio = new Audio('audio/bottle-clink.mp3');
    hurt_sound = new Audio('audio/hurt.mp3');
    win_sound = new Audio('audio/win.mp3');

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
        this.run();
    }

    setWorld() {
        this.character.world = this;
    }

    run() {
        setInterval(() => {
            this.checkCollisions();
            this.checkThrowObjects();
            this.collectOfCoins();
            this.collectOfBottles();
            this.checkEndbossEnergie();
            this.winScreen();
        }, 200);
    }

    checkThrowObjects() {
        if (this.keyboard.D && this.character.amountBottle > 0) {
            let direction = this.character.otherDirection ? 'left' : 'right';
            let offsetX = direction === 'left' ? -20 : 100;
            let bottle = new ThrowableObject(this.character.x + offsetX, this.character.y + 100, this.character, direction);
            this.throwableObjects.push(bottle);
            this.character.amountBottle--;
            this.statusBarBottle.setPercentage(this.character.amountBottle * 20);
        }
    }

    checkCollidions() {
        this.level.enemies.forEach((enemy) => {
            if (this.character.isColliding(enemy)) {
                this.character.hit();
                this.statusBar.setPercentage(this.character.energy)
            }
        });
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.translate(this.camera_x, 0); // Forwards

        this.addObjectsToMap(this.level.backgroundObjects);
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.clouds);
        this.ctx.translate(-this.camera_x, 0); // Back
        const endboss = this.level.enemies.find(e => e instanceof Endboss);
        if (endboss && !endboss.isDead) {
            this.addToMap(this.statusBarEndboss);
        }

        this.addToMap(this.statusBarBottle);
        this.addToMap(this.statusBarCoin);
        this.addToMap(this.statusBar);
        this.ctx.translate(this.camera_x, 0); // Forwards

        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.bottles);
        this.ctx.translate(-this.camera_x, 0); // Back

        // draw(); wird immer aufgerufen
        let self = this;
        requestAnimationFrame(function () {
            self.draw();
        });
    }

    addObjectsToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o);
        });
    }

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

    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0)
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }

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

    checkCollisions() {
        this.checkCharacterEnemyCollisions();
        this.checkBottleEnemyCollisions();
    }


    checkCharacterEnemyCollisions() {
        this.level.enemies.forEach((enemy) => {
            if (this.characterJumpToKill(enemy)) {
                if (enemy instanceof Chicken || enemy instanceof Small_Chicken) {
                    this.character.jumpOn(enemy);
                }
            } else if (this.character.isColliding(enemy) && !enemy.isDead) {
                this.characterGetsHurt();
            }
        });
        this.level.enemies = this.level.enemies.filter(enemy => !enemy.isSplicable);
    }

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

    characterJumpToKill(enemy) {
        return this.character.isColliding(enemy) &&
            this.character.isAboveGround() &&
            this.character.speedY < 0;
    }

    characterGetsHurt() {
        this.character.hit();
        this.hurt_sound.play();
        this.statusBar.setPercentage(this.character.energy);
    }


    checkBottleEnemyCollisions() {
    for (let i = this.throwableObjects.length - 1; i >= 0; i--) {
        const bottle = this.throwableObjects[i];
        this.checkCollisionWithEnemies(bottle);
        if (bottle.isSplicable) {
            this.throwableObjects.splice(i, 1);
        }
    }
}

checkCollisionWithEnemies(bottle) {
    this.level.enemies.forEach((enemy) => {
        if (bottle.isColliding(enemy) && !bottle.collidedWith[enemy.id]) {
            bottle.collidedWith[enemy.id] = true;
            bottle.splash(enemy);
            this.handleEnemyDamage(enemy);
        }
    });
}

handleEnemyDamage(enemy) {
    if (enemy instanceof Endboss) {
        enemy.takeDamage(12.5);
        this.statusBarEndboss.setPercentage(enemy.energy);
    } else {
        enemy.takeDamage(20);
    }
}

    /**
     * Checks if character is colliding with any enemy.
     */
    characterIsCollidingWithAnyEnemy() {
        return this.level.enemies.some(enemy => this.character.isColliding(enemy));
    }

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

    winScreen() {
        const endboss = this.level.enemies.find(e => e instanceof Endboss);
        if (endboss && endboss.isDead) {
            this.win_sound.play();
            setTimeout(() => showWinScreen(), 2000);
        }
    }




}