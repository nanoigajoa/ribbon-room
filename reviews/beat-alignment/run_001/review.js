/** Shared numerical lookup; null means outside the reviewed domain. */
globalThis.beatAlignmentReview = {
  lookup(value, anchors, source, target) {
    if (!Number.isFinite(value) || value < anchors[0][source] || value > anchors.at(-1)[source]) return null;
    let low = 0, high = anchors.length - 1;
    while (high - low > 1) {
      const mid = (low + high) >> 1;
      if (anchors[mid][source] <= value) low = mid; else high = mid;
    }
    const a = anchors[low], b = anchors[high];
    return a[target] + (value - a[source]) / (b[source] - a[source]) * (b[target] - a[target]);
  },
  bind(document) {
    const data = JSON.parse(document.getElementById('mapping').textContent);
    const audio = document.getElementById('audio'), slider = document.getElementById('beat');
    const mode = document.getElementById('mode'), readout = document.getElementById('readout');
    const anchors = () => mode.value === 'linear' ? [data.anchors[0], data.anchors.at(-1)] : data.anchors;
    const lookup = globalThis.beatAlignmentReview.lookup;
    const draw = () => {
      const beat = lookup(audio.currentTime, anchors(), 'crop_audio_seconds', 'source_beat');
      readout.textContent = beat === null ? `원본 ${(audio.currentTime + data.audio_crop_start_seconds).toFixed(3)}초 · 대응 범위 밖` : `source beat ${beat.toFixed(3)} · 원본 ${(audio.currentTime + data.audio_crop_start_seconds).toFixed(3)}초`;
      if (beat !== null) slider.value = String(beat);
    };
    const seek = beat => {
      const seconds = lookup(beat, anchors(), 'source_beat', 'crop_audio_seconds');
      if (seconds !== null) { audio.currentTime = seconds; draw(); }
    };
    slider.addEventListener('input', () => seek(Number(slider.value)));
    document.querySelectorAll('[data-beat]').forEach(button => button.addEventListener('click', () => {
      seek(Number(button.dataset.beat));
    }));
    mode.addEventListener('change', draw);
    document.getElementById('rate').addEventListener('change', event => { audio.playbackRate = Number(event.target.value); });
    ['timeupdate', 'seeked', 'loadedmetadata'].forEach(event => audio.addEventListener(event, draw));
    audio.addEventListener('error', () => { readout.textContent = '음원을 불러오지 못했습니다.'; });
    draw();
  }
};
if (typeof document !== 'undefined') globalThis.beatAlignmentReview.bind(document);
