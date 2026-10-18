globalThis.tempoReview = {
  lookup(value, anchors, source, target) {
    if (!Number.isFinite(value) || value < anchors[0][source] || value > anchors.at(-1)[source]) return null;
    let low=0, high=anchors.length-1;
    while(high-low>1){const mid=(low+high)>>1;if(anchors[mid][source]<=value)low=mid;else high=mid;}
    const a=anchors[low], b=anchors[high];
    return a[target]+(value-a[source])/(b[source]-a[source])*(b[target]-a[target]);
  },
  windowBpm(beat, width, anchors) {
    const lookup=globalThis.tempoReview.lookup;
    const left=lookup(beat-width/2,anchors,'source_beat','original_audio_seconds');
    const right=lookup(beat+width/2,anchors,'source_beat','original_audio_seconds');
    return left===null||right===null?null:60*width/(right-left);
  },
  bind(document) {
    const data=JSON.parse(document.getElementById('data').textContent), anchors=data.alignment.anchors;
    const audio=document.getElementById('audio'), windowSelect=document.getElementById('window');
    const slider=document.getElementById('beat'), readout=document.getElementById('readout');
    const cursor=document.getElementById('cursor'), raw=document.getElementById('raw');
    const lookup=globalThis.tempoReview.lookup;
    const draw=()=>{
      const beat=lookup(audio.currentTime,anchors,'crop_audio_seconds','source_beat');
      document.querySelectorAll('[data-window]').forEach(path=>{path.style.display=path.dataset.window===windowSelect.value?'':'none';});
      document.getElementById('rawCurve').style.display=raw.checked?'':'none';
      cursor.style.display=beat===null?'none':'';
      if(beat===null){readout.textContent=`원음 ${audio.currentTime.toFixed(3)}초 · 대응 범위 밖`;return;}
      slider.value=String(beat);
      const width=Number(windowSelect.value), bpm=globalThis.tempoReview.windowBpm(beat,width,anchors);
      readout.textContent=`source beat ${beat.toFixed(3)} · ${width}박 평균 ${bpm===null?'창 범위 밖':bpm.toFixed(1)+' quarter BPM'}`;
      const x=70+(beat-anchors[0].source_beat)/(anchors.at(-1).source_beat-anchors[0].source_beat)*960;
      cursor.setAttribute('x1',String(x));cursor.setAttribute('x2',String(x));
    };
    const seek=beat=>{const t=lookup(beat,anchors,'source_beat','crop_audio_seconds');if(t!==null){audio.currentTime=t;draw();}};
    slider.addEventListener('input',()=>seek(Number(slider.value)));
    document.querySelectorAll('[data-beat]').forEach(button=>button.addEventListener('click',()=>seek(Number(button.dataset.beat))));
    windowSelect.addEventListener('change',draw);raw.addEventListener('change',draw);
    document.getElementById('rate').addEventListener('change',event=>{audio.playbackRate=Number(event.target.value);});
    ['timeupdate','seeked','loadedmetadata'].forEach(event=>audio.addEventListener(event,draw));
    audio.addEventListener('error',()=>{readout.textContent='음원을 불러오지 못했습니다.';});
    draw();
  }
};
if(typeof document!=='undefined')globalThis.tempoReview.bind(document);
