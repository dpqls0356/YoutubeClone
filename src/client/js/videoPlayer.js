const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute"); 
const time = document.getElementById("time");
const volume = document.getElementById("volume");

const handlePlayClick = (e) =>{
    if(video.paused){
        // playBtn.innerHTML="Pause"
        video.play();
    }
    else{
        // playBtn.innerHTML="Play"
        video.pause();
    }
    playBtn.innerText=video.paused?"Play":"Pause";
}
// const handlePause = ()=>{
//     playBtn.innerHTML="Play";
// }
// const handlePlay = ( )=>{
//     playBtn.innerHTML="Pause";
// }
var videoVolume = volume.value;
video.volume = videoVolume;
const handleMute = (e)=>{
    if(video.muted){
        // 비디오 muted를 false로 바꿔줌
        video.muted=false;
        // muteBtn.innerText="OnMute";
        video.volume = videoVolume;
        volume.value = videoVolume;
    }
    else{
        video.muted=true;
        // muteBtn.innerText="UnMute";
        volume.value=0;
    }
    muteBtn.innerText = video.muted?"Unmute":"Mute";
}
const handelVolumeChange = (event) =>{
    videoVolume = event.target.value;
    video.volume = videoVolume;
// 뮤트에서 드래그했을때 변경
    if(video.muted){
        video.muted =false;
    }
    muteBtn.innerText = video.muted?"Unmute":"Mute";
}
playBtn.addEventListener("click",handlePlayClick);
muteBtn.addEventListener("click",handleMute);
// video.addEventListener("pause",handlePause);
// video.addEventListener("play",handlePlay);
volume.addEventListener("input",handelVolumeChange);
// input - 실시간 값 변화 캐치 가능 change - 최종적인 값만 캐치 가능