let isRunning = false;
let startTime;
let intervalId;
let targetSeconds = 60;

const progressBar = document.getElementById('progressBar');
const timeDisplay = document.getElementById('timeDisplay');
const button = document.getElementById('startStopButton');
const input = document.getElementById('targetTime');

button.addEventListener('click', () => {
  targetSeconds = parseInt(input.value, 10) || 60;

  if (isRunning) {
    clearInterval(intervalId);
    isRunning = false;
    button.textContent = 'スタート';
  } else {
    startTime = Date.now();
    isRunning = true;
    button.textContent = 'ストップ';

    intervalId = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const progress = Math.min((elapsed / targetSeconds) * 100, 100);
      progressBar.style.width = `${progress}%`;
      timeDisplay.textContent = `経過時間: ${elapsed} 秒`;

      if (elapsed >= targetSeconds) {
        clearInterval(intervalId);
        isRunning = false;
        button.textContent = 'スタート';
      }
    }, 100);
  }
});
