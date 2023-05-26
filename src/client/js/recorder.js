const startBtn = document.getElementById("startBtn");
const previewVideo = document.getElementById("preview");
var stream;
var video;
var recorder;
const init = async() =>{
   try{
    stream = await navigator.mediaDevices.getUserMedia({
        audio:false,
        video:{
            width:300,
            height:300,
        },

    });
    previewVideo.srcObject = stream;
    previewVideo.play();
   }
   catch(err){

   }
}
const handleStartRecord = () => {
    startBtn.innerHTML= "Stop Recording";
    startBtn.removeEventListener("click",handleStartRecord);
    startBtn.addEventListener("click",handleStopRecord);
    recorder = new  MediaRecorder(stream);
    recorder.start();
}
const handleStopRecord = ()=>{
    startBtn.innerText = "Download Recording";
    startBtn.removeEventListener("click",handleStopRecord);
    startBtn.addEventListener("click",handleDownloadRecord);
    recorder.stop();
        // stop시 datavailable event 가 발생된다 이를 잡기위해서는 ondataavailable이 필요
        recorder.ondataavailable = (e) =>{
            console.log(e.data);
            video = URL.createObjectURL(e.data);
            // 미리보기 창에 있던 srcObject를 없애줌( scream )
            previewVideo.srcObject = null;
            previewVideo.src = video;
            previewVideo.play();
            
        }
    
    const tracks = stream.getTracks();
    tracks.forEach((track) => {
    track.stop();
    });
    stream = null;
}
const handleDownloadRecord = ()=>{
    startBtn.removeEventListener("click",handleDownloadRecord);
    startBtn.addEventListener("click",handleStartRecord);
    const a = document.createElement("a");
    a.href = video;
    // 링크이동이 아닌 다운을 위해 추가!
    a.download = "MyRecording.mp4";
    document.body.appendChild(a);
    a.click();
}
init();

startBtn.addEventListener("click",handleStartRecord);