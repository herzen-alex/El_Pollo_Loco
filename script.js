
let bg_music = new Audio('audio/bg_music.mp3');
let soundMuted = false;
const originalPlay = Audio.prototype.play;

Audio.prototype.play = function () {
  if (!soundMuted) {
    return originalPlay.call(this);
  }
};


function toggleDisplay(elementId, show) {
    const displayStyle = show ? "block" : "none";
    const el = document.getElementById(elementId);
    if (el) el.style.display = displayStyle;
}

function gameOver() {
    if (document.fullscreenElement) {
        document.exitFullscreen();
    }
    toggleDisplay("canvas", false);
    toggleDisplay("game_over", true);
    clearAllIntervals();
    if (bg_music) bg_music.pause();
}

function showWinScreen() {
    clearAllIntervals();
    toggleDisplay("canvas", false);
    toggleDisplay("game_win", true);
    toggleDisplay("main", false);
    if (bg_music) bg_music.pause();
    if (document.fullscreenElement) {
        document.exitFullscreen();
    }
}

function startGame() {
    if (window.innerWidth <= 1023) {
        enterFullscreenMode();
        setTimeout(() => startGameCore(), 100);
    } else {
        startGameCore();
    }
}

function startGameCore() {
    initLevel();
    init();
    toggleDisplay("main", false);
    toggleDisplay("canvas", true);
    playBackgroundMusic();
}

function playBackgroundMusic() {
    if (bg_music && !soundMuted) {
        bg_music.loop = true;
        bg_music.volume = 0.1;
        bg_music.currentTime = 0;
        bg_music.play().catch(e => console.warn("Background music not allowed yet:", e));
    }
}

function restartGame() {
    toggleDisplay("game_win", false);
    toggleDisplay("game_over", false);
    toggleDisplay("canvas", true);
    endGame();
}

function backToStart() {
    toggleDisplay("game_over", false);
    toggleDisplay("main", true);
    toggleDisplay("canvas", false);
    toggleDisplay("game_win", false);
}


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

function clearAllIntervals() {
    for (let i = 1; i < 9999; i++) {
        clearInterval(i);
    }
}

function checkOrientation() {
    const warning = document.getElementById('orientationWarning');
    if (!warning) return;
    if (window.matchMedia("(orientation: portrait)").matches) {
        warning.style.display = "flex";
    } else {
        warning.style.display = "none";
    }
}

function endGame() {
  world.gameOver = true;
  bg_music.pause();
  clearAllIntervals();
  startGame();
}

function initBody() {
  soundMuted = JSON.parse(localStorage.getItem("soundMuted")) || false;
  const soundIcon = document.getElementById("volume");
  if (soundMuted) {
    soundIcon.src = "assets/back_img/volumeoff.png";
    bg_music.pause();
  } else {
    soundIcon.src = "assets/back_img/volumeon.png";
  }
}

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

window.addEventListener("resize", checkRotateDevice);
window.addEventListener("orientationchange", checkRotateDevice);
window.onload = checkRotateDevice;




