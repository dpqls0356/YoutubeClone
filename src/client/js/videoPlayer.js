const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute"); 
const currenTime = document.getElementById("currenTime");
const totalTime = document.getElementById("totalTime");
const volume = document.getElementById("volume");
const timeline = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreen");
const videoContainer = document.getElementById("videoContainer");
const videoController = document.querySelector(".videoController");
var controlMouseInOutId=null;
var controlMouseMoveId =null;
const handlePlayClick = (e) =>{
    if(video.paused){
        // playBtn.innerHTML="Pause"
        video.play();
        playIcon();
    }
    else{
        // playBtn.innerHTML="Play"
        video.pause();
        playIcon();
    }
    // playBtn.innerText=video.paused?"Play":"Pause";
}
const playIcon = () =>{
    if(video.paused){
        document.querySelector(".play-i").classList.add("fa-play");
        document.querySelector(".play-i").classList.remove("fa-stop");
    }
    else{
        document.querySelector(".play-i").classList.add("fa-stop");
        document.querySelector(".play-i").classList.remove("fa-play");
    }
}
const muteIcon = () => {
    if(video.muted){
        document.querySelector(".mute-i").classList.remove("fa-volume-high");
        document.querySelector(".mute-i").classList.add("fa-volume-xmark");
    }
    else{
        document.querySelector(".mute-i").classList.remove("fa-volume-xmark");
        document.querySelector(".mute-i").classList.add("fa-volume-high");
    }
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
    muteIcon();
}
const handelVolumeChange = (event) =>{
    videoVolume = event.target.value;
    video.volume = videoVolume;
// 뮤트에서 드래그했을때 변경
    if(video.muted){
        video.muted =false;
    }
    if(videoVolume === "0"){
        video.muted=true;
    }
    muteIcon();
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
        playIcon();
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
const handleFullScreen= ()=>{
    // true에서 버튼을 눌렀다는 것은 나가고싶다는 것 + 나갈 것이니 Full로 변경
    if(document.fullscreenElement){
        document.exitFullscreen();
        document.querySelector(".full-i").classList.add("fa-expand");
        document.querySelector(".full-i").classList.remove("fa-compress");
    }
    else{
        videoContainer.requestFullscreen(); 
        video.style.height="100%";
        video.style.width="100%";
        videoController.style.bottom="10%";
        document.querySelector(".full-i").classList.add("fa-compress");
        document.querySelector(".full-i").classList.remove("fa-expand");
    }

}
// 마우스가 움직였을 때 inout id가 있으면 비디오에서 나왔다 다시 들어온 거니까
// id와 타임아웃 걸린 걸 없애줌

// 마우스가 움직였을 때 move id가 있다는 건 그 전에 3초 멈춰있었다가 다시 움직였다는 것이니
// 타임 아웃을 지우고 id도 지워줌
const handleMouseMove = () =>{
    if(controlMouseInOutId){
        clearTimeout(controlMouseInOutId);
        controlMouseInOutId=null;
    }
    if(controlMouseMoveId){
        clearTimeout(controlMouseMoveId);
        controlMouseMoveId=null
    }
    videoController.classList.remove("hidden");
    controlMouseMoveId = setTimeout(hideControl,3000);
}
const handleMouseLeave = () =>{
    controlMouseInOutId = setTimeout(hideControl,3000);
}
const hideControl = ()=>{
    videoController.classList.add("hiddenAnimation");
    setTimeout(()=>{
        videoController.classList.add("hidden");
        videoController.classList.remove("hiddenAnimation");
    },500);
}
const videoControllerH = videoController.clientHeight*1.1;
// 반드시 단위가 필요하다.... 없으면 작동 안함....
document.querySelector(".videoController").style.bottom = `${videoControllerH}px`;

const handleEnded = () =>{
    // dataset이름 지정시 대문자 안됨
    // const {videoid }= videoContainer.dataset;
    const videoid = videoContainer.dataset.videoid;
    console.log(videoid);
    fetch(`/api/videos/${videoid}/views`,{
        method:"POST",
    })
}

playBtn.addEventListener("click",handlePlayClick);
muteBtn.addEventListener("click",handleMute);
// video.addEventListener("pause",handlePause);
// video.addEventListener("play",handlePlay);
volume.addEventListener("input",handelVolumeChange);
// input - 실시간 값 변화 캐치 가능 change - 최종적인 값만 캐치 가능
video.addEventListener("loadedmetadata",handleLoadedMEtadata);
video.addEventListener("timeupdate",handleTimeUpdate);
video.addEventListener("mousemove",handleMouseMove);
video.addEventListener("mouseleave",handleMouseLeave);
video.addEventListener("ended",handleEnded);
timeline.addEventListener("input",handleChnageTimeLine);
fullScreenBtn.addEventListener("click",handleFullScreen);
