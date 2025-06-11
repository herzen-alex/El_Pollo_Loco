class Level {

    /**
     * Game world elements and properties.
     * - enemies: array of enemy objects.
     * - clouds: array of cloud objects.
     * - backgroundObjects: array of background elements.
     * - coins: array of collectible coin objects.
     * - bottles: array of throwable bottle objects.
     * - level_end_x: number representing the x-coordinate where the level ends.
     */
    enemies;
    clouds;
    backgroundObjects;
    coins;
    bottles;
    level_end_x = 2950;

    /**
     * Initializes the game world with given elements.
     * @param {Array} enemies - List of enemy objects.
     * @param {Array} clouds - List of cloud objects.
     * @param {Array} backgroundObjects - List of background elements.
     * @param {Array} coins - List of coin objects.
     * @param {Array} bottles - List of bottle objects.
     */
    constructor(enemies, clouds, backgroundObjects, coins, bottles) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.coins = coins;
        this.bottles = bottles;
    }
}