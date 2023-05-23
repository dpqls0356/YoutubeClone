const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute"); 
const currenTime = document.getElementById("currenTime");
const totalTime = document.getElementById("totalTime");
const volume = document.getElementById("volume");
const timeline = document.getElementById("timeline");

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

const formatTime = (seconds) =>{
    // const hour = String(parseInt(seconds/3600)).padStart(2, "0");
    // const min = String(parseInt((seconds - hour*3600)/60)).padStart(2, "0");
    // const sec = String(parseInt(seconds - hour*3600-min*60)).padStart(2, "0");
    // return hour+" : "+min+" : "+sec;
    return new Date(seconds * 1000).toISOString().substring(11, 19)
}
const handleLoadedMEtadata = (e)=>{
    totalTime.innerText = formatTime(video.duration);
    timeline.max = Math.floor(video.duration);
}
const handleTimeUpdate= (e) =>{
    currenTime.innerText = formatTime(video.currentTime);
    timeline.value = Math.floor(video.currentTime);
    if(timeline.value === timeline.max){
        playBtn.innerText=video.paused?"Play":"Pause";
    }
}
const handleChnageTimeLine = (e) =>{
    const changeTimeline = e.target.value;
    video.currentTime = changeTimeline;
}
window.addEventListener("keydown", function (event) {
    if (event.code == "Enter") {
        handlePlayClick();
    }
});

playBtn.addEventListener("click",handlePlayClick);
muteBtn.addEventListener("click",handleMute);
// video.addEventListener("pause",handlePause);
// video.addEventListener("play",handlePlay);
volume.addEventListener("input",handelVolumeChange);
// input - 실시간 값 변화 캐치 가능 change - 최종적인 값만 캐치 가능
video.addEventListener("loadedmetadata",handleLoadedMEtadata);
video.addEventListener("timeupdate",handleTimeUpdate);
timeline.addEventListener("input",handleChnageTimeLine);