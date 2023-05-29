import { createFFmpeg,fetchFile } from "@ffmpeg/ffmpeg";
import { async } from "regenerator-runtime";
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
            video = URL.createObjectURL(e.data);
            // 미리보기 창에 있던 srcObject를 없애줌( scream )
            previewVideo.srcObject = null;
            previewVideo.src = video;
            previewVideo.play();
            
        }
    // 카메라 사용 중단
    const tracks = stream.getTracks();
    tracks.forEach((track) => {
    track.stop();
    });
    stream = null;
}
const handleDownloadRecord = async()=>{
    const ffmpeg = createFFmpeg({log:true});
    // // user가 sw를 사용하기위해 사용 ( sw가 무거울 수 있어 await) 
    await ffmpeg.load();
    // // ffmpeg의 세계에서 파일을 다룸
    // // method,file name , file
    ffmpeg.FS("writeFile","recording.webm",await fetchFile(video));
    // // ffmpeg의 세계에 있는 파일을 input으로 받아 특정 파일로 변경 ( 60프레임으로 인코딩 )
    await ffmpeg.run("-i","recording.webm","-r","60","output.mp4");

    startBtn.removeEventListener("click",handleDownloadRecord);
    startBtn.addEventListener("click",handleStartRecord);
    const a = document.createElement("a");
    a.href = video;
    // 링크이동이 아닌 다운을 위해 추가!
    a.download = "MyRecording.webm";
    document.body.appendChild(a);
    a.click();
}
init();

startBtn.addEventListener("click",handleStartRecord);