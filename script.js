// script.js - タイマーアプリのメイン処理

// ===== DOM要素の取得 =====
// 入力フィールド要素の取得
const hoursInput = document.getElementById('hours');           // 時間入力フィールド
const minutesInput = document.getElementById('minutes');       // 分入力フィールド
const startTimeInput = document.getElementById('startTimeInput'); // 開始時刻入力フィールド

// ボタン要素の取得
const button = document.getElementById('startStopButton');     // スタート/ストップボタン
const themeToggle = document.getElementById('themeToggle');    // テーマ切り替えボタン

// 表示用要素の取得
const startTimeDisplay = document.getElementById('startTimeDisplay');         // 開始時刻表示
const endTimeDisplay = document.getElementById('endTimeDisplay');             // 終了予定時刻表示
const remainingTimeDisplay = document.getElementById('remainingTimeDisplay'); // 残り時間表示
const progressBar = document.getElementById('progressBar');                   // プログレスバー

// ===== グローバル変数 =====
let startTime = null;      // タイマー開始時刻を格納
let targetSeconds = 0;     // 目標時間を秒数で格納
let intervalId = null;     // setIntervalのIDを格納（タイマー停止時に使用）
let isRunning = false;     // タイマーが動作中かどうかのフラグ

// ===== タイマー更新関数 =====
// 100msごとに呼び出される関数。残り時間とプログレスバーを更新
function updateTimer() {
  const now = new Date();                           // 現在時刻を取得
  const elapsed = (now - startTime) / 1000;         // 経過時間を秒で計算
  const remaining = targetSeconds - elapsed;        // 残り時間を計算
  const percent = Math.min((elapsed / targetSeconds) * 100, 100); // プログレス率を計算（最大100%）

  // 時間終了の処理
  if (remaining <= 0) {
    clearInterval(intervalId);                      // タイマーを停止
    progressBar.style.width = '100%';               // プログレスバーを100%に設定
    remainingTimeDisplay.textContent = '時間終了！'; // 終了メッセージを表示
    isRunning = false;                              // 動作フラグをfalseに
    button.textContent = 'スタート';                 // ボタンテキストを「スタート」に戻す
    localStorage.clear();                           // ローカルストレージをクリア
    return;
  }

  // プログレスバーの幅を更新
  progressBar.style.width = `${percent}%`;

  // 残り時間を分と秒に変換して表示
  const min = Math.floor(remaining / 60);           // 残り分数
  const sec = Math.floor(remaining % 60);           // 残り秒数
  remainingTimeDisplay.textContent = `残り時間: ${min}分${sec}秒`;

  // 状態をローカルストレージに保存（ブラウザ再読み込み時の復元用）
  localStorage.setItem('startTime', startTime.getTime());
  localStorage.setItem('targetSeconds', targetSeconds.toString());
  localStorage.setItem('isRunning', isRunning.toString());
}

// ===== スタート/ストップボタンのイベントリスナー =====
button.addEventListener('click', () => {
  if (!isRunning) {
    // ===== タイマー開始処理 =====
    
    // 入力値から目標時間を計算（時間と分を秒に変換）
    let hours = parseInt(hoursInput.value) || 0;      // 時間入力（空の場合は0）
    let minutes = parseInt(minutesInput.value) || 0;  // 分入力（空の場合は0）
    targetSeconds = hours * 3600 + minutes * 60;     // 総秒数に変換

    // 開始時刻の設定
    const inputTime = startTimeInput.value;
    if (inputTime) {
      // 時刻が入力されている場合：指定された時刻を開始時刻に設定
      const [h, m] = inputTime.split(":").map(Number);
      const now = new Date();
      now.setHours(h);       // 時を設定
      now.setMinutes(m);     // 分を設定
      now.setSeconds(0);     // 秒を0に設定
      startTime = now;
    } else {
      // 時刻が入力されていない場合：現在時刻を開始時刻に設定
      startTime = new Date();
      startTimeInput.value = startTime.toTimeString().slice(0, 5); // 入力フィールドに現在時刻を表示
    }

    // タイマー開始の状態更新
    isRunning = true;                              // 動作フラグをtrueに
    button.textContent = 'ストップ';                // ボタンテキストを「ストップ」に変更

    // 表示の更新
    startTimeDisplay.textContent = `開始時刻: ${startTime.toTimeString().slice(0, 5)}`;

    // 終了予定時刻を計算して表示
    const endTime = new Date(startTime.getTime() + targetSeconds * 1000);
    endTimeDisplay.textContent = `終了予定時刻: ${endTime.toTimeString().slice(0, 5)}`;

    // タイマーの開始（初回実行 + 100msごとの定期実行）
    updateTimer();                                 // 即座に一度実行
    intervalId = setInterval(updateTimer, 100);    // 100msごとに更新
  } else {
    // ===== タイマー停止処理 =====
    clearInterval(intervalId);                     // 定期実行を停止
    isRunning = false;                             // 動作フラグをfalseに
    button.textContent = 'スタート';                // ボタンテキストを「スタート」に戻す
    localStorage.clear();                          // ローカルストレージをクリア
  }
});

// ===== ダークモード切り替え機能 =====
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');           // 'dark'クラスの切り替え
  const currentTheme = document.body.classList.contains('dark-mode') ? 'dark-mode' : 'light-mode'; // 現在のテーマを判定
  localStorage.setItem('theme', currentTheme);      // テーマ設定をローカルストレージに保存
});

// ===== ページ読み込み時の状態復元 =====
// ブラウザ再読み込み時にタイマー状態とテーマ設定を復元
window.addEventListener('load', () => {
  // ローカルストレージから保存データを取得
  const savedStartTime = localStorage.getItem('startTime');         // 開始時刻
  const savedTargetSeconds = localStorage.getItem('targetSeconds'); // 目標時間
  const savedIsRunning = localStorage.getItem('isRunning');         // 動作状態
  const savedTheme = localStorage.getItem('theme');                 // テーマ設定

  // テーマ設定の復元
  if (savedTheme === 'dark') {
    document.body.classList.add('dark');            // ダークモードを適用
  }

  // タイマー状態の復元（全ての必要なデータが保存されている場合のみ）
  if (savedStartTime && savedTargetSeconds && savedIsRunning === 'true') {
    // 保存されたデータからタイマー状態を復元
    startTime = new Date(parseInt(savedStartTime)); // 開始時刻を復元
    targetSeconds = parseInt(savedTargetSeconds);   // 目標時間を復元
    isRunning = true;                               // 動作フラグを復元

    // 画面表示の復元
    const endTime = new Date(startTime.getTime() + targetSeconds * 1000);
    endTimeDisplay.textContent = `終了予定時刻: ${endTime.toTimeString().slice(0, 5)}`;
    startTimeDisplay.textContent = `開始時刻: ${startTime.toTimeString().slice(0, 5)}`;
    startTimeInput.value = startTime.toTimeString().slice(0, 5);
    button.textContent = 'ストップ';

    // タイマーの再開
    intervalId = setInterval(updateTimer, 100);     // 100msごとの更新を再開
  }
});
