const startTimeInput = document.getElementById('startTime');
const hourInput = document.getElementById('hourInput');
const minuteInput = document.getElementById('minuteInput');
const button = document.getElementById('startButton');
const startTimeDisplay = document.getElementById('startTimeDisplay');
const endTimeDisplay = document.getElementById('endTimeDisplay');
const remainingTimeDisplay = document.getElementById('remainingTimeDisplay');
const progressBar = document.getElementById('progressBar');

let startTime = null;
let intervalId = null;
let isRunning = false;
let targetSeconds = 0;

function updateTimer() {
  const now = new Date();
  const elapsed = (now - startTime) / 1000;
  const remaining = Math.max(targetSeconds - elapsed, 0);
  const percentage = Math.min((elapsed / targetSeconds) * 100, 100);

  progressBar.style.width = `${percentage}%`;

  const remainingMin = Math.floor(remaining / 60);
  const remainingSec = Math.floor(remaining % 60);
  remainingTimeDisplay.textContent = `残り時間: ${remainingMin}分 ${remainingSec}秒`;

  if (remaining <= 0) {
    clearInterval(intervalId);
    isRunning = false;
    button.textContent = 'スタート';
    localStorage.clear();
  }

  // 状態を保存
  localStorage.setItem('startTime', startTime.getTime());
  localStorage.setItem('targetSeconds', targetSeconds.toString());
  localStorage.setItem('isRunning', isRunning.toString());
}

button.addEventListener('click', () => {
  if (!isRunning) {
    const timeValue = startTimeInput.value;
    const hours = parseInt(hourInput.value, 10) || 0;
    const minutes = parseInt(minuteInput.value, 10) || 0;

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

// ページ読み込み時に保存された状態を復元
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

// ダークモード切り替え
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  themeToggle.textContent = document.body.classList.contains('dark')
    ? '☀️ ライトモード'
    : '🌙 ダークモード';
});
