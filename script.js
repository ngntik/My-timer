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
  const remaining = Math.max(targetSeconds - elapsed, 0);
  const percent = Math.min((elapsed / targetSeconds) * 100, 100);

  progressBar.style.width = `${percent}%`;

  const remainingMin = Math.floor(remaining / 60);
  const remainingSec = Math.floor(remaining % 60);
  remainingTimeDisplay.textContent = `残り時間: ${remainingMin}分 ${remainingSec}秒`;

  if (remaining <= 0) {
    clearInterval(intervalId);
    isRunning = false;
    button.textContent = 'スタート';
    localStorage.clear();
  }

  localStorage.setItem('startTime', startTime.getTime());
  localStorage.setItem('targetSeconds', targetSeconds.toString());
  localStorage.setItem('isRunning', isRunning.toString());
}

button.addEventListener('click', () => {
  if (!isRunning) {
    const timeValue = startTimeInput.value;
    const hours = parseInt(hoursInput.value, 10) || 0;
    const minutes = parseInt(minutesInput.value, 10) || 0;

    if (!timeValue || (hours === 0 && minutes === 0)) {
      alert('開始時刻と目標時間を指定してください');
      return;
    }

    const [startHour, startMinute] = timeValue.split(':').map(Number);
    startTime = new Date();
    startTime.setHours(startHour, startMinute, 0, 0);
    targetSeconds = hours * 3600 + minutes * 60;

    const endTime = new Date(startTime.getTime() + targetSeconds * 1000);
    endTimeDisplay.textContent = `終了予定時刻: ${endTime.toTimeString().slice(0, 5)}`;
    startTimeDisplay.textContent = `開始時刻: ${startTime.toTimeString().slice(0, 5)}`;

    isRunning = true;
    button.textContent = 'ストップ';
    intervalId = setInterval(updateTimer, 100);
  } else {
    clearInterval(intervalId);
    isRunning = false;
    button.textContent = 'スタート';
    localStorage.clear();
  }
});

window.addEventListener('load', () => {
  const savedStartTime = localStorage.getItem('startTime');
  const savedTargetSeconds = localStorage.getItem('targetSeconds');
  const savedIsRunning = localStorage.getItem('isRunning');

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

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  themeToggle.textContent = document.body.classList.contains('dark')
    ? '☀️ ライトモード'
    : '🌙 ダークモード';
});
