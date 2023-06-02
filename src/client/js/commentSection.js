const videoContainer = document.getElementById("videoContainer");
const CommentForm = document.getElementById("commentForm");

const handleCommentSave = (event)=>{
    // 기본 동작을 못하게한다.
    event.preventDefault();
    const comment =  CommentForm.querySelector("input:first-child").value;
    const videoId = videoContainer.dataset.videoid;
    if(comment===""){
        return;
    }
    // 댓글의 주인을 프론트에서 알아오기에는 보안상에 좋지않아 session을 통해 알아올 것
    // 백엔드로 요청하기
    fetch(`/api/videos/${videoId}/comment`,{
        method:"POST",
        headers:{
            "Content-Type":"application/json",
        },
        // obj를 string으로 바꿔버리기에 comment만 보내기 또는 객체 자체를 JSON>stringify해야함
        body:JSON.stringify({
            comment : comment,
        }),
    });
    CommentForm.querySelector("input:first-child").value="";
}
if(CommentForm)
    CommentForm.addEventListener("submit",handleCommentSave);