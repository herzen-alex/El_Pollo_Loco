
let canvas;

let world;

let keyboard = new Keyboard();

/**
 * Initializes the canvas, creates the game world, and sets up mobile controls.
 */
function init() {
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);

    setupMobileControls();
}

/**
 * Listens for keydown events and updates the keyboard state accordingly.
 * @param {KeyboardEvent} e - The keyboard event object.
 */
window.addEventListener("keydown", (e) => {
    if (e.keyCode == 39) keyboard.RIGHT = true;
    if (e.keyCode == 37) keyboard.LEFT = true;
    if (e.keyCode == 38) keyboard.UP = true;
    if (e.keyCode == 40) keyboard.DOWN = true;
    if (e.keyCode == 32) keyboard.SPACE = true;
    if (e.keyCode == 68) keyboard.D = true;
});

/**
 * Listens for keyup events and updates the keyboard state.
 * Also allows throwing when the 'D' key is released.
 * @param {KeyboardEvent} e - The keyboard event object.
 */
window.addEventListener("keyup", (e) => {
    if (e.keyCode == 39) { keyboard.RIGHT = false; }
    if (e.keyCode == 37) { keyboard.LEFT = false; }
    if (e.keyCode == 38) { keyboard.UP = false; }
    if (e.keyCode == 40) { keyboard.DOWN = false; }
    if (e.keyCode == 32) { keyboard.SPACE = false; }
    if (e.keyCode == 68) {
        keyboard.D = false;
        keyboard.canThrow = true;
    }
});


/**
 * Initializes mobile controls by defining button mappings 
 * between on-screen buttons and keyboard keys.
 */
function setupMobileControls() {
    const buttonMappings = [
        { id: 'btn_left', key: 'LEFT' },
        { id: 'btn_right', key: 'RIGHT' },
        { id: 'btn_jump', key: 'SPACE' },
        { id: 'btn_throw', key: 'D' }
    ];

    /**
 * Attaches touch event listeners (touchstart and touchend) 
 * to each mobile button to update keyboard state accordingly.
 */
    buttonMappings.forEach(mapping => {
        const button = document.getElementById(mapping.id);
        if (button) {
            button.addEventListener('touchstart', (e) => {
                e.preventDefault();
                keyboard[mapping.key] = true;
            });
            button.addEventListener('touchend', (e) => {
                e.preventDefault();
                keyboard[mapping.key] = false;
                keyboard.canThrow = true;
            });
        }
    });

    /**
 * Listens for the Escape key press to exit fullscreen mode.
 */
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            exitFullscreenMode();
        }
    });
}
