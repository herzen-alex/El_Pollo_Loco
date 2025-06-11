class Keyboard extends MovableObject {

    /**
     * Control and action state flags.
     * Indicate whether specific keys are currently pressed or actions are available.
     * - LEFT, RIGHT, UP, DOWN, SPACE, D: boolean flags for key presses.
     * - canThrow: boolean flag indicating if throwing action is allowed.
     */
    LEFT = false;
    RIGHT = false;
    UP = false;
    DOWN = false;
    SPACE = false;
    D = false;
    canThrow = true;
}