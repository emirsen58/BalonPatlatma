const gun = document.getElementById("gun");
const gameArea = document.getElementById("game-area");
const scoreSpan = document.getElementById("score");
const timeSpan = document.getElementById("time");
const gameOverScreen = document.getElementById("game-over");
const finalScoreSpan = document.getElementById("final-score");
const bestScoreSpan = document.getElementById("best-score");
const restartBtn = document.getElementById("restart-btn");

let score = 0;
let timeLeft = 60;
let gameInterval;
let spawnInterval;

// 🔫 Silahı fareyle sağa sola hareket ettir
gameArea.addEventListener("mousemove", (e) => {
  const rect = gameArea.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  gun.style.left = `${mouseX}px`;
});

// 🎯 Lazer atışı (boşluk tuşu veya tıklama ile)
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") shootLaser();
});
gameArea.addEventListener("click", shootLaser);

function shootLaser() {
  const laser = document.createElement("div");
  laser.classList.add("laser");

  const gunRect = gun.getBoundingClientRect();
  const areaRect = gameArea.getBoundingClientRect();
  const left = gunRect.left - areaRect.left + gun.offsetWidth / 2 - 2;

  laser.style.left = `${left}px`;
  gameArea.appendChild(laser);

  const laserInterval = setInterval(() => {
    const laserTop = laser.offsetTop;

    // Çarpışma kontrolü
    const balloons = document.querySelectorAll(".balloon");
    balloons.forEach((balloon) => {
      if (isColliding(laser, balloon)) {
        const type = balloon.dataset.type;
        if (type === "red") score += 1;
        else if (type === "gold") score += 5;
        else if (type === "black") score -= 3;

        scoreSpan.textContent = score;
        balloon.remove();
        laser.remove();
      }
    });

    // Lazer ekranın dışına çıktıysa
    if (laserTop < -20) {
      laser.remove();
      clearInterval(laserInterval);
    }
  }, 10);
}

// 💥 Balon üretimi
function spawnBalloon() {
  const balloon = document.createElement("div");
  balloon.classList.add("balloon");

  const types = ["red", "gold", "black"];
  const type = types[Math.floor(Math.random() * types.length)];

  balloon.classList.add(type);
  balloon.dataset.type = type;

  const left = Math.random() * (gameArea.offsetWidth - 40);
  balloon.style.left = `${left}px`;

  gameArea.appendChild(balloon);

  setTimeout(() => {
    if (balloon.parentElement) balloon.remove();
  }, 6000);
}

// ⏱ Zamanı başlat
function startGame() {
  score = 0;
  timeLeft = 60;
  scoreSpan.textContent = score;
  timeSpan.textContent = timeLeft;
  gameOverScreen.style.display = "none";

  gameInterval = setInterval(() => {
    timeLeft--;
    timeSpan.textContent = timeLeft;
    if (timeLeft <= 0) endGame();
  }, 1000);

  spawnInterval = setInterval(spawnBalloon, 800);
}

// 🧠 Çarpışma algılama
function isColliding(a, b) {
  const aRect = a.getBoundingClientRect();
  const bRect = b.getBoundingClientRect();

  return !(
    aRect.top > bRect.bottom ||
    aRect.bottom < bRect.top ||
    aRect.right < bRect.left ||
    aRect.left > bRect.right
  );
}

// 🛑 Oyun bitti
function endGame() {
  clearInterval(gameInterval);
  clearInterval(spawnInterval);

  document.querySelectorAll(".laser").forEach((l) => l.remove());
  document.querySelectorAll(".balloon").forEach((b) => b.remove());

  gameOverScreen.style.display = "flex";
  finalScoreSpan.textContent = score;

  const best = localStorage.getItem("bestScore") || 0;
  if (score > best) {
    localStorage.setItem("bestScore", score);
  }

  bestScoreSpan.textContent = localStorage.getItem("bestScore");
}

// 🔁 Tekrar oyna
restartBtn.addEventListener("click", startGame);

// 🎮 Oyunu başlat
window.onload = startGame;
