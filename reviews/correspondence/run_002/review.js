/** The original recording clock is retained, including leading silence. */
const audio = document.getElementById('audio');
const status = document.getElementById('status');
document.querySelectorAll('[data-seek]').forEach(button => {
  button.addEventListener('click', () => {
    audio.currentTime = Number(button.dataset.seek);
    audio.play().catch(error => { status.textContent = '재생 버튼을 눌러 시작하세요: ' + error.message; });
  });
});
document.getElementById('rate').addEventListener('change', event => {
  audio.playbackRate = Number(event.target.value);
});
audio.addEventListener('timeupdate', () => { status.textContent = `원본 녹음 ${audio.currentTime.toFixed(3)}초`; });
audio.addEventListener('error', () => { status.textContent = '원음을 불러오지 못했습니다. 서버 연결을 확인하세요.'; });
