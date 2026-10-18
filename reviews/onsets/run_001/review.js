globalThis.onsetReview = {
  validate(entry, bounds) {
    if(!['pending','confirmed','uncertain','excluded'].includes(entry.status))throw new Error('검토 상태를 선택하세요.');
    if(['uncertain','excluded'].includes(entry.status)&&!entry.comment.trim())throw new Error('불확실·제외 이유를 기록하세요.');
    if(['confirmed','uncertain'].includes(entry.status)){
      const l=entry.lower_original_audio_seconds,u=entry.upper_original_audio_seconds;
      if(!Number.isFinite(l)||!Number.isFinite(u)||l<bounds[0]||u>bounds[1]||l>u)throw new Error('원음 범위 안의 시작 ≤ 끝 시간을 입력하세요.');
    }
    return entry;
  },
  error(point, entry) {
    if(!['confirmed','uncertain'].includes(entry.status))return null;
    const lo=(point.predicted_original_audio_seconds-entry.upper_original_audio_seconds)*1000;
    const hi=(point.predicted_original_audio_seconds-entry.lower_original_audio_seconds)*1000;
    const min=lo<=0&&hi>=0?0:Math.min(Math.abs(lo),Math.abs(hi));
    const max=Math.max(Math.abs(lo),Math.abs(hi)),tolerance=2000/30;
    return {lo,hi,result:max<=tolerance?'within':min>tolerance?'outside':'indeterminate'};
  },
  bind(document, storage) {
    const data=JSON.parse(document.getElementById('data').textContent), api=globalThis.onsetReview;
    const el=id=>document.getElementById(id), audio=el('audio'), select=el('point');
    const key='onset-review:'+data.dataset_id;
    let annotations=data.annotations.map(e=>({...e})),current=0,view=null;
    const feedback=text=>{el('message').textContent=text;};
    const point=()=>data.points[current];
    const entry=()=>annotations.find(e=>e.id===point().id);
    const validatePayload=payload=>{
      if(payload.schema_version!=='onset-annotations/0.1.0'||payload.dataset_id!==data.dataset_id||!Array.isArray(payload.annotations)||payload.annotations.length!==data.points.length)throw new Error('이 검토본의 주석 파일이 아닙니다.');
      const ids=new Set();
      for(const e of payload.annotations){
        if(!data.points.some(p=>p.id===e.id)||ids.has(e.id))throw new Error('지점 ID가 맞지 않습니다.');
        if(typeof e.comment!=='string')throw new Error('메모 형식이 맞지 않습니다.');
        ids.add(e.id);api.validate(e,data.audio_original_bounds);
      }
      return payload.annotations.map(e=>({...e}));
    };
    try{const saved=storage?.getItem(key);if(saved)annotations=validatePayload(JSON.parse(saved));}catch{feedback('저장한 기록을 읽지 못했습니다. 원본 검토 기록으로 시작합니다.');}
    const payload=()=>({schema_version:'onset-annotations/0.1.0',dataset_id:data.dataset_id,annotations});
    const summary=()=>{
      let confirmed=0;
      for(const p of data.points){
        const e=annotations.find(a=>a.id===p.id),error=api.error(p,e);
        if(p.role==='evaluation'&&e.status==='confirmed')confirmed++;
        el('status-'+p.id).textContent=({pending:'미검토',confirmed:'확인',uncertain:'불확실',excluded:'제외'})[e.status];
        el('error-'+p.id).textContent=!el('reveal').checked?'후보 숨김':error?`${error.lo.toFixed(1)}…${error.hi.toFixed(1)} ms (${error.result})`:'미측정';
      }
      el('summary').textContent=`평가용 확인 ${confirmed} / ${data.points.filter(p=>p.role==='evaluation').length} · 첫 보정 지점은 집계 제외`;
    };
    const draw=()=>{
      const p=point(),e=entry();
      view=el('wide').checked?data.audio_original_bounds:p.context_original_seconds;
      const left=Math.max(0,Math.floor((view[0]-data.audio_original_bounds[0])/data.waveform_step_seconds));
      const right=Math.min(data.waveform.length,Math.ceil((view[1]-data.audio_original_bounds[0])/data.waveform_step_seconds));
      const x=t=>60+(t-view[0])/(view[1]-view[0])*960;
      const poly=[];
      for(let i=left;i<right;i++){
        const t=data.audio_original_bounds[0]+(i+.5)*data.waveform_step_seconds;
        if(t<view[0]||t>view[1])continue;
        const [minimum,maximum]=data.waveform[i];
        poly.push(`M${x(t).toFixed(2)},${(140-maximum*110).toFixed(2)}V${(140-minimum*110).toFixed(2)}`);
      }
      el('wave').setAttribute('d',poly.join(' '));
      const predicted=x(p.predicted_original_audio_seconds);
      el('prediction').setAttribute('x1',String(predicted));el('prediction').setAttribute('x2',String(predicted));
      el('prediction').style.display=el('reveal').checked?'':'none';
      for(const [id,time] of [['markLower',e.lower_original_audio_seconds],['markUpper',e.upper_original_audio_seconds]]){
        const marker=el(id);marker.style.display=time===null||time<view[0]||time>view[1]?'none':'';
        if(time!==null){marker.setAttribute('x1',String(x(time)));marker.setAttribute('x2',String(x(time)));}
      }
      el('range').textContent=`표시 범위: 원본 ${view[0].toFixed(3)}–${view[1].toFixed(3)}초`;
      el('target').textContent=`${p.id} · source beat ${p.source_beat} · ${p.role==='calibration'?'보정용':'평가용'} · `+p.notes.map(n=>n.part_name+' '+n.pitch_name).join(' / ');
      el('candidate').textContent=el('reveal').checked?`DTW 후보: ${p.predicted_original_audio_seconds.toFixed(6)}초`:'DTW 후보 시각 숨김';
      summary();
    };
    const load=()=>{const e=entry();el('lower').value=e.lower_original_audio_seconds??'';el('upper').value=e.upper_original_audio_seconds??'';el('state').value=e.status;el('comment').value=e.comment;el('reveal').checked=false;draw();};
    const capture=()=>{
      const parse=id=>el(id).value.trim()===''?null:Number(el(id).value);
      return api.validate({id:point().id,status:el('state').value,lower_original_audio_seconds:parse('lower'),upper_original_audio_seconds:parse('upper'),comment:el('comment').value},data.audio_original_bounds);
    };
    select.addEventListener('change',()=>{current=Number(select.value);load();feedback('선택을 바꾸기 전에 기록 저장 버튼으로 입력을 보존하세요.');});
    el('save').addEventListener('click',()=>{try{
      const next=capture();annotations=annotations.map(e=>e.id===next.id?next:e);draw();
      try{storage?.setItem(key,JSON.stringify(payload()));feedback('현재 지점 기록을 저장했습니다. JSON 내보내기로 파일도 보존하세요.');}
      catch{feedback('브라우저 저장소를 사용할 수 없습니다. JSON 내보내기로 기록을 보존하세요.');}
    }catch(error){feedback(error.message);}});
    el('chart').addEventListener('click',event=>{
      const box=el('chart').getBoundingClientRect(),position=(event.clientX-box.left)/box.width*1100;
      if(position<60||position>1020)return;
      const time=view[0]+(position-60)/960*(view[1]-view[0]);
      el(el('which').value).value=time.toFixed(6);feedback('시간을 입력했습니다. 상태를 선택한 뒤 현재 지점 기록을 저장하세요.');
    });
    for(const id of ['lower','upper'])el('use-'+id).addEventListener('click',()=>{el(id).value=(audio.currentTime+data.audio_original_bounds[0]).toFixed(6);});
    el('listen').addEventListener('click',()=>{audio.currentTime=view[0]-data.audio_original_bounds[0];audio.play().catch(error=>feedback(error.message));});
    el('stop').addEventListener('click',()=>audio.pause());
    el('rate').addEventListener('change',()=>{audio.playbackRate=Number(el('rate').value);});
    el('wide').addEventListener('change',draw);el('reveal').addEventListener('change',draw);
    audio.addEventListener('timeupdate',()=>{el('clock').textContent=`원본 ${(audio.currentTime+data.audio_original_bounds[0]).toFixed(6)}초`;if(!el('wide').checked&&audio.currentTime+data.audio_original_bounds[0]>=view[1])audio.pause();});
    audio.addEventListener('error',()=>feedback('원음을 불러오지 못했습니다.'));
    el('export').addEventListener('click',()=>{
      const url=URL.createObjectURL(new Blob([JSON.stringify(payload(),null,2)+'\n'],{type:'application/json'}));
      const link=document.createElement('a');link.href=url;link.download='onset_annotations.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),0);
    });
    el('import').addEventListener('change',async event=>{try{
      const file=event.target.files?.[0];if(!file)return;
      annotations=validatePayload(JSON.parse(await file.text()));
      try{storage?.setItem(key,JSON.stringify(payload()));}catch{}
      load();feedback('검토 기록을 불러왔습니다.');
    }catch(error){feedback(error.message);}});
    load();return {payload,validatePayload};
  }
};
if(typeof document!=='undefined'){
  let storage=null;try{storage=globalThis.localStorage;}catch{}
  globalThis.onsetReview.bind(document,storage);
}
