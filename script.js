const button = document.getElementById('startStopBtn');
const progressBar = document.getElementById('progressBar');
const timeDisplay = document.getElementById('timeDisplay');
const remainingTimeDisplay = document.getElementById('remainingTimeDisplay');
const endTimeDisplay = document.getElementById('endTimeDisplay');
const targetHoursInput = document.getElementById('targetHours');
const targetMinutesInput = document.getElementById('targetMinutes');
const startTimeInput = document.getElementById('startTimeInput');
const themeToggle = document.getElementById('themeToggle');

let startTime = null;
let intervalId = null;
let isRunning = false;
let targetSeconds = 0;

// 時分秒に変換する関数
function formatRemaining(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}分${s}秒`;
}

button.addEventListener('click', () => {
  if (!isRunning) {
    // 初回スタート
    const h = parseInt(targetHoursInput.value) || 0;
    const m = parseInt(targetMinutesInput.value) || 0;
    targetSeconds = h * 3600 + m * 60;

    if (targetSeconds <= 0) {
      alert("目標時間を指定してください");
      return;
    }

    const now = new Date();
    if (!startTimeInput.value) {
      // startTimeInputが空なら現在時刻を自動設定
      startTimeInput.value = now.toTimeString().slice(0, 5);
    }

    // 入力された開始時刻を基準にする
    const [sh, sm] = startTimeInput.value.split(':').map(Number);
    startTime = new Date();
    startTime.setHours(sh, sm, 0, 0);

    const endTime = new Date(startTime.getTime() + targetSeconds * 1000);
    endTimeDisplay.textContent = `終了予定時刻: ${endTime.toTimeString().slice(0, 5)}`;

    intervalId = setInterval(() => {
      const now = new Date();
      const elapsed = Math.floor((now - startTime.getTime()) / 1000);
      const remaining = Math.max(targetSeconds - elapsed, 0);
      const progress = Math.min((elapsed / targetSeconds) * 100, 100);

      progressBar.style.width = `${progress}%`;
      timeDisplay.textContent = `経過時間: ${elapsed} 秒`;
      remainingTimeDisplay.textContent = `残り時間: ${formatRemaining(remaining)}`;

      if (elapsed >= targetSeconds) {
        clearInterval(intervalId);
        isRunning = false;
        button.textContent = 'スタート';
      }
    }, 100);

    isRunning = true;
    button.textContent = 'ストップ';

  } else {
    clearInterval(intervalId);
    isRunning = false;
    button.textContent = 'スタート';
  }
});

// テーマ切り替え
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  themeToggle.textContent = document.body.classList.contains('dark')
    ? '☀️ ライトモード'
    : '🌙 ダークモード';
});
