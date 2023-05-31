import { createFFmpeg,fetchFile } from "@ffmpeg/ffmpeg";
import { async } from "regenerator-runtime";
const startBtn = document.getElementById("startBtn");
const makeVideo = document.getElementById("make-video");
const previewVideo = document.getElementById("preview");
var stream;
var video;
var recorder;
var mp4Url;
var thumbnailImg;
const files ={
    input:"recording.webm",
    output:"output.mp4",
    thumbnail:"thumbnail.jpg",
}
const init = async() =>{
   try{
    stream = await navigator.mediaDevices.getUserMedia({
        audio:false,
        video:{
            width:1024,
            height:576,
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
    startBtn.innerText = "Making Recording...";
    startBtn.disabled = true;
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
            transformWebmToMp4AndMakeThumbnail();
        }
    // 카메라 사용 중단
    const tracks = stream.getTracks();
    tracks.forEach((track) => {
    track.stop();
    });
    stream = null;
}
const transformWebmToMp4AndMakeThumbnail = async() =>{
    const ffmpeg = createFFmpeg({log:true});
    // // user가 sw를 사용하기위해 사용 ( sw가 무거울 수 있어 await) 
    await ffmpeg.load();
    // // ffmpeg의 세계에서 파일을 다룸


    // // method,file name , file
    ffmpeg.FS("writeFile",files.input,await fetchFile(video));
    // // ffmpeg의 세계에 있는 파일을 input으로 받아 특정 파일로 변경 ( 60프레임으로 인코딩 )
    await ffmpeg.run("-i",files.input,"-r","60",files.output);
    // Uint8Array를 리턴하는데 이를 가지곤 사용불가 -> arrayBuffer(bytes의 배열)로 blob를 만들어야함
    const mp4Video = ffmpeg.FS("readFile",files.output);
    const mp4Blob = new Blob([mp4Video.buffer],{type:"video/mp4"});
    mp4Url = URL.createObjectURL(mp4Blob);


    // 이동한 시간의 스크릿샷을 찍음
    await ffmpeg.run("-i",files.input,"-ss","00:00:01","-frames:v","1",files.thumbnail);
    const thumbFile = ffmpeg.FS("readFile",'thumbnail.jpg');
    const thumbBlob = new Blob([thumbFile.buffer],{type:"image/jpg"});
    thumbnailImg = URL.createObjectURL(thumbBlob);
    
    // 변환 완료 후에 다운로드 가능하다고 변경
    if(mp4Url){
        startBtn.innerText = "Download Video";
    }
    // 썸네일 다운로드 버튼 생성
    if(thumbnailImg){
        const thumDownloadBtn = document.createElement("button");
        const thumDownloadA = document.createElement("a");
        thumDownloadBtn.appendChild(thumDownloadA);
        thumDownloadA.href =thumbnailImg;
        thumDownloadA.innerText="Download Thumbnail";
        thumDownloadA.download = "MyThumbnail.jpg";
        makeVideo.appendChild(thumDownloadBtn);
        startBtn.disabled = false;
    }


    // 메모리에서 삭제하기 - 속도향상을 위함
    ffmpeg.FS("unlink","output.mp4");
    ffmpeg.FS("unlink",files.thumbnail);
    ffmpeg.FS("unlink",files.input);

    URL.revokeObjectURL(mp4Blob);
    URL.revokeObjectURL(thumbBlob);

}
const handleDownloadRecord = async()=>{
    // 다시시작하느거 버튼만들기..
    startBtn.innerHTML="Record again";
    init();
    startBtn.removeEventListener("click",handleDownloadRecord);
    startBtn.addEventListener("click",handleStartRecord);
    const a = document.createElement("a");
    // a.href = video;
    a.href = mp4Url;
    // 링크이동이 아닌 다운을 위해 추가!
    // a.download = "MyRecording.webm";
    a.download = "MyRecording.mp4";
    document.body.appendChild(a);
    a.click();
}
init();

startBtn.addEventListener("click",handleStartRecord);