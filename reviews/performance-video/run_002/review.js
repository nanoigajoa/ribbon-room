/** MP4 contains its own real audio; controls never run a second sound source. */
const video=document.getElementById('video');
const status=document.getElementById('status');
const slider=document.getElementById('time');
const draw=()=>{slider.value=String(video.currentTime);document.getElementById('readout').textContent=`${video.currentTime.toFixed(3)} / 22.000초`;};
const seek=value=>{video.pause();video.currentTime=Math.max(0,Math.min(22,value));draw();};
document.querySelectorAll('[data-seek]').forEach(button=>button.addEventListener('click',()=>seek(Number(button.dataset.seek))));
slider.addEventListener('input',()=>seek(Number(slider.value)));
document.getElementById('back').addEventListener('click',()=>seek(video.currentTime-1/30));
document.getElementById('forward').addEventListener('click',()=>seek(video.currentTime+1/30));
document.getElementById('reset').addEventListener('click',()=>seek(0));
document.getElementById('rate').addEventListener('change',event=>{video.playbackRate=Number(event.target.value);});
video.addEventListener('timeupdate',draw);video.addEventListener('seeked',draw);
video.addEventListener('play',()=>{status.textContent='재생 중 · 실제 원음 포함 영상';});
video.addEventListener('pause',()=>{status.textContent='일시 정지';});
video.addEventListener('ended',()=>{status.textContent='구간 끝';});
video.addEventListener('error',()=>{status.textContent='영상을 불러오지 못했습니다.';});
draw();
