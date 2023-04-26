let isRunning = false;
const totalTime = 1 * 60; // 10 minutes
let elapsed = 0;
let interval;

function toggleTimer() {
  if (isRunning) {
    pauseTimer();
  } else {
    startTimer();
  }
}

function startTimer() {
  if (isRunning) return;
  isRunning = true;

  interval = setInterval(() => {
    elapsed++;
    updateMask();
    if (elapsed >= totalTime) {
      clearInterval(interval);
      isRunning = false;
      elapsed = 0;
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(interval);
  isRunning = false;
}

const fanfareSound = new Howl({
  src: ['fanfare.aac']
});

const sadSound = new Howl({
  src: ['sad.aac']
});

function updateMask() {
  const mask = document.querySelector(".mask");
  const percentage = elapsed / totalTime;
  const angle = percentage * 360;
  mask.setAttribute("d", describePieSlice(500, 500, 450, -90, angle - 90));

  checkFanfareAndConfetti();

  if (elapsed >= totalTime) {
    clearInterval(interval);
    isRunning = false;
    elapsed = 0;
    checkEndConditions();
  }
}

function taskClickHandler(event) {
  const checkmark = event.currentTarget.querySelector(".checkmark");
  checkmark.style.opacity = checkmark.style.opacity === "1" ? "0" : "1";

  checkFanfareAndConfetti();
}

function checkFanfareAndConfetti() {
  const checkmarks = document.querySelectorAll(".checkmark");
  const allTasksComplete = Array.from(checkmarks).every(
    (checkmark) => checkmark.style.opacity === "1"
  );

  if (isRunning && allTasksComplete) {
    fanfareSound.play();
    confettiAnimation();
  }
}

function checkEndConditions() {
  const checkmarks = document.querySelectorAll(".checkmark");
  const allTasksComplete = Array.from(checkmarks).every((checkmark) => checkmark.style.opacity === "1");

  if (!allTasksComplete) {
    sadSound.play();
    showSadSmiley();
  }
}

function confettiAnimation() {
  const confettiSettings = { angle: 90, spread: 45, particleCount: 100, origin: { y: 0.9 } };
  canvasConfetti(confettiSettings);
}

function showSadSmiley() {
  const sadSmiley = document.createElement("div");
  sadSmiley.innerHTML = '<i class="far fa-frown" style="font-size: 8em; color: #ee4035; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);"></i>';
  document.body.appendChild(sadSmiley);
}

function describePieSlice(cx, cy, r, startAngle, endAngle) {
  const startX = cx + r * Math.cos((Math.PI * startAngle) / 180);
  const startY = cy + r * Math.sin((Math.PI * startAngle) / 180);
  const endX = cx + r * Math.cos((Math.PI * endAngle) / 180);
  const endY = cy + r * Math.sin((Math.PI * endAngle) / 180);

  const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;

  const pathData = [
    "M", cx, cy,
    "L", startX, startY,
    "A", r, r, 0, largeArcFlag, 1, endX, endY,
    "Z"
  ].join(" ");

  return pathData;
}

document.querySelectorAll(".task").forEach(task => {
  task.addEventListener("click", taskClickHandler);
});

