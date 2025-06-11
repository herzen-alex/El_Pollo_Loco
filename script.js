
/**
 * Background music audio instance.
 */
let bg_music = new Audio('audio/bg_music.mp3');

/**
 * Sound mute state loaded from localStorage.
 */
soundMuted = JSON.parse(localStorage.getItem("soundMuted")) || false;

/**
 * Override Audio.play to respect soundMuted flag.
 * Plays audio only if sound is not muted; otherwise resolves immediately.
 */
const originalPlay = Audio.prototype.play;
Audio.prototype.play = function () {
    if (!soundMuted) {
        return originalPlay.call(this);
    } else {
        return Promise.resolve();
    }
};

/**
 * Shows or hides an element by ID based on `show` flag.
 * @param {string} elementId - The ID of the element.
 * @param {boolean} show - True to show, false to hide.
 */
function toggleDisplay(elementId, show) {
    const displayStyle = show ? "flex" : "none";
    const el = document.getElementById(elementId);
    if (el) el.style.display = displayStyle;
}

/**
 * Handles game over state: exits fullscreen, hides canvas, shows game over screen, stops intervals and music.
 */
function gameOver() {
    if (document.fullscreenElement) {
        document.exitFullscreen();
    }
    toggleDisplay("canvas", false);
    toggleDisplay("game_over", true);
    clearAllIntervals();
    if (bg_music) bg_music.pause();
    Mobile();
}

/**
 * Displays the win screen, stops music and intervals, exits fullscreen.
 */
function showWinScreen() {
    clearAllIntervals();
    toggleDisplay("canvas", false);
    toggleDisplay("game_win", true);
    toggleDisplay("main", false);
    if (bg_music) bg_music.pause();
    if (document.fullscreenElement) {
        document.exitFullscreen();
    }
    Mobile();
}

/**
 * Starts the game, entering fullscreen on small screens before initializing.
 */
function startGame() {
    if (window.innerWidth <= 1023) {
        enterFullscreenMode();
        setTimeout(() => startGameCore(), 100);
    } else {
        startGameCore();
    }
}

/**
 * Core game start logic: initializes level and UI, starts music if not muted.
 */
function startGameCore() {
    initLevel();
    init();
    toggleDisplay("main", false);
    toggleDisplay("canvas", true);
    if (!soundMuted) {
        playBackgroundMusic();
    }
    Mobile();
}

/**
 * Plays background music with looping and volume control if not muted.
 */
function playBackgroundMusic() {
    if (bg_music && !soundMuted) {
        bg_music.loop = true;
        bg_music.volume = 0.1;
        bg_music.currentTime = 0;
        bg_music.play().catch(e => console.warn("Background music not allowed yet:", e));
    }
}

/**
 * Restarts the game: hides win/over screens, shows canvas, ends current game state.
 */
function restartGame() {
    toggleDisplay("game_win", false);
    toggleDisplay("game_over", false);
    toggleDisplay("canvas", true);
    endGame();
}

/**
 * Returns UI to start screen, hiding game elements and calling mobile setup.
 */
function backToStart() {
    toggleDisplay("game_over", false);
    toggleDisplay("main", true);
    toggleDisplay("canvas", false);
    toggleDisplay("game_win", false);
    Mobile();
}

/**
 * Requests fullscreen mode on the 'fullscreen' element and resizes the canvas.
 */
function enterFullscreenMode() {
    const fullscreenElement = document.getElementById('fullscreen');
    const canvas = document.getElementById('canvas');
    canvas.style.setProperty("width", "100vw", "important");
    canvas.style.setProperty("height", "100dvh", "important");
    if (fullscreenElement.requestFullscreen) {
        fullscreenElement.requestFullscreen();
    } else if (fullscreenElement.msRequestFullscreen) {
        fullscreenElement.msRequestFullscreen();
    } else if (fullscreenElement.webkitRequestFullscreen) {
        fullscreenElement.webkitRequestFullscreen();
    }
}

/**
 * Clears all active intervals (up to 9999).
 */
function clearAllIntervals() {
    for (let i = 1; i < 9999; i++) {
        clearInterval(i);
    }
}

/**
 * Shows or hides orientation warning based on device orientation.
 */
function checkOrientation() {
    const warning = document.getElementById('orientationWarning');
    if (!warning) return;
    if (window.matchMedia("(orientation: portrait)").matches) {
        warning.style.display = "flex";
    } else {
        warning.style.display = "none";
    }
}

/**
 * Ends the game: sets gameOver flag, pauses music, clears intervals, restarts game.
 */
function endGame() {
    world.gameOver = true;
    bg_music.pause();
    clearAllIntervals();
    startGame();
}

/**
 * Initializes sound icon and background music based on mute state.
 */
function initBody() {
    const soundIcon = document.getElementById("volume");
    if (soundMuted) {
        soundIcon.src = "assets/back_img/volumeoff.png";
        bg_music.pause();
    } else {
        soundIcon.src = "assets/back_img/volumeon.png";
    }
}

/**
 * Toggles sound mute state, updates localStorage, icon, and plays/pauses music accordingly.
 */
function toggleVolume() {
    const soundIcon = document.getElementById("volume");
    soundMuted = !soundMuted;
    localStorage.setItem("soundMuted", JSON.stringify(soundMuted));
    if (soundMuted) {
        bg_music.pause();
        soundIcon.src = "assets/back_img/volumeoff.png";
    } else {
        if (document.getElementById("canvas").style.display === "block" ||
            document.getElementById("canvas").style.display === "flex") {
            bg_music.play();
        }
        soundIcon.src = "assets/back_img/volumeon.png";
    }
}

/**
 * Shows a rotate device warning if screen is small and in portrait mode.
 */
function checkRotateDevice() {
    const warning = document.getElementById('rotate_device');
    const isPortrait = window.matchMedia("(orientation: portrait)").matches;
    const isSmallScreen = window.innerWidth <= 800;
    if (isPortrait && isSmallScreen) {
        warning.style.display = "flex";
    } else {
        warning.style.display = "none";
    }
}

/**
 * Displays mobile controls if on a touch device and canvas is visible.
 */
function Mobile() {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const mobileBtns = document.getElementById('mobile_btn');
    const canvas = document.getElementById('canvas');
    if (isTouchDevice && canvas.style.display !== 'none') {
        mobileBtns.style.display = 'flex';
    } else {
        mobileBtns.style.display = 'none';
    }
}

/**
 * Toggles visibility of the impressum overlay and updates its content.
 */
function toggleImpressum() {
    let overlayRef = document.getElementById('impressum');
    overlayRef.classList.toggle('imp_none');
    overlayRef.innerHTML = getOverlayHtml();
}

/**
 * Returns HTML content for the impressum overlay.
 */
function getOverlayHtml() {
    return `
            <div onclick="overlayProtection (event)" class="inner_content">
                <div class="impressum_main">
                    <h2>Impressum</h2>
                    <div class="close_btn" onclick="toggleImpressum()">X</div>
                </div>
                <div>
                    <p>Alex Herzen</p>
                    <p>Mühlstraße 8</p>
                    <p>90547 Stein</p>
                </div>
                <h2>Kontakt</h2>
                <div class="daten">
                    <p>E-Mail-Adresse: herzen.alex1@web.de</p>
                    <span class="">
                    <a href="https://datenschutz-generator.de/" 
                       title="Rechtstext von Dr. Schwenke - für weitere Informationen bitte anklicken." 
                       target="_blank" 
                       rel="noopener noreferrer nofollow">
                        Erstellt mit kostenlosem Datenschutz-Generator.de von Dr. Thomas Schwenke
                    </a>
                </span>
                </div>     
            </div>
    `;
}

/**
 * Stops event propagation to prevent overlay closing when clicking inside.
 */
function overlayProtection(event) {
    event.stopPropagation();
}

/**
 * On window resize, check device rotation and show warning if needed.
 */
window.addEventListener("resize", checkRotateDevice);

/**
 * On device orientation change, check rotation and show warning if needed.
 */
window.addEventListener("orientationchange", checkRotateDevice);

/**
 * On page load, check rotation and initialize page elements.
 */
window.addEventListener("load", () => {
    checkRotateDevice();
    initBody();
});






