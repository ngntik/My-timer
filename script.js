// script.js
const hoursInput = document.getElementById('hours');
const minutesInput = document.getElementById('minutes');
const startTimeInput = document.getElementById('startTimeInput');
const button = document.getElementById('startStopButton');
const startTimeDisplay = document.getElementById('startTimeDisplay');
const endTimeDisplay = document.getElementById('endTimeDisplay');
const remainingTimeDisplay = document.getElementById('remainingTimeDisplay');
const progressBar = document.getElementById('progressBar');
const themeToggle = document.getElementById('themeToggle');

let startTime = null;
let targetSeconds = 0;
let intervalId = null;
let isRunning = false;

function updateTimer() {
  const now = new Date();
  const elapsed = (now - startTime) / 1000;
  const remaining = targetSeconds - elapsed;
  const percent = Math.min((elapsed / targetSeconds) * 100, 100);

  if (remaining <= 0) {
    clearInterval(intervalId);
    progressBar.style.width = '100%';
    remainingTimeDisplay.textContent = '時間終了！';
    isRunning = false;
    button.textContent = 'スタート';
    localStorage.clear();
    return;
  }

  progressBar.style.width = `${percent}%`;

  const min = Math.floor(remaining / 60);
  const sec = Math.floor(remaining % 60);
  remainingTimeDisplay.textContent = `残り時間: ${min}分${sec}秒`;

  // 保存
  localStorage.setItem('startTime', startTime.getTime());
  localStorage.setItem('targetSeconds', targetSeconds.toString());
  localStorage.setItem('isRunning', isRunning.toString());
}

button.addEventListener('click', () => {
  if (!isRunning) {
    let hours = parseInt(hoursInput.value) || 0;
    let minutes = parseInt(minutesInput.value) || 0;
    targetSeconds = hours * 3600 + minutes * 60;

    const inputTime = startTimeInput.value;
    if (inputTime) {
      const [h, m] = inputTime.split(":").map(Number);
      const now = new Date();
      now.setHours(h);
      now.setMinutes(m);
      now.setSeconds(0);
      startTime = now;
    } else {
      startTime = new Date();
      startTimeInput.value = startTime.toTimeString().slice(0, 5);
    }

    isRunning = true;
    button.textContent = 'ストップ';

    startTimeDisplay.textContent = `開始時刻: ${startTime.toTimeString().slice(0, 5)}`;

    const endTime = new Date(startTime.getTime() + targetSeconds * 1000);
    endTimeDisplay.textContent = `終了予定時刻: ${endTime.toTimeString().slice(0, 5)}`;

    updateTimer();
    intervalId = setInterval(updateTimer, 100);
  } else {
    clearInterval(intervalId);
    isRunning = false;
    button.textContent = 'スタート';
    localStorage.clear();
  }
});

// ダークモード切り替え
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const currentTheme = document.body.classList.contains('dark') ? 'dark' : 'light';
  localStorage.setItem('theme', currentTheme);
});

// 起動時の状態復元
window.addEventListener('load', () => {
  const savedStartTime = localStorage.getItem('startTime');
  const savedTargetSeconds = localStorage.getItem('targetSeconds');
  const savedIsRunning = localStorage.getItem('isRunning');
  const savedTheme = localStorage.getItem('theme');

  if (savedTheme === 'dark') {
    document.body.classList.add('dark');
  }

  if (savedStartTime && savedTargetSeconds && savedIsRunning === 'true') {
    startTime = new Date(parseInt(savedStartTime));
    targetSeconds = parseInt(savedTargetSeconds);
    isRunning = true;

    const endTime = new Date(startTime.getTime() + targetSeconds * 1000);
    endTimeDisplay.textContent = `終了予定時刻: ${endTime.toTimeString().slice(0, 5)}`;
    startTimeDisplay.textContent = `開始時刻: ${startTime.toTimeString().slice(0, 5)}`;
    startTimeInput.value = startTime.toTimeString().slice(0, 5);
    button.textContent = 'ストップ';

    intervalId = setInterval(updateTimer, 100);
  }
});
