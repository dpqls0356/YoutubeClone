import { async } from "regenerator-runtime";

const videoContainer = document.getElementById("videoContainer");
const CommentForm = document.getElementById("commentForm");
let commentDeleteBtn = document.querySelectorAll('.commentDeleteBtn');

const addCommentToComments = (comment,newCommentId) =>{
    const videoComments = document.querySelector("#video_comments ul");
    const newComment = document.createElement('li');
    const newCommentBox = document.createElement("div");
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("commentDeleteBtn");
    deleteBtn.addEventListener("click",handleCommemtDelete);
    const commentText = document.createElement("div");
    commentText.innerHTML = comment;
    deleteBtn.innerHTML="X";
    newComment.dataset.commentid = newCommentId;
    newCommentBox.appendChild(commentText);
    newCommentBox.appendChild(deleteBtn);
    newComment.appendChild(newCommentBox);
    videoComments.insertBefore(newComment,videoComments.firstChild);
}
const handleCommentSave = async(event)=>{
    // 기본 동작을 못하게한다.
    event.preventDefault();
    const comment =  CommentForm.querySelector("input:first-child").value;
    const videoId = videoContainer.dataset.videoid;
    if(comment===""){
        return;
    }
    // 댓글의 주인을 프론트에서 알아오기에는 보안상에 좋지않아 session을 통해 알아올 것
    // 백엔드로 요청하기
    const response = await fetch(`/api/videos/${videoId}/comment`,{
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
    if(response.status === 201){
        const {newCommentId} = await response.json();
        addCommentToComments(comment,newCommentId);
        comment.value="";
    }
    else{

    }
}
const handleCommemtDelete = async(e) =>{
    const commentBox =  e.target.parentElement;
    const commentID = e.target.parentElement.dataset.commentid;
    await fetch(`/api/videos/${commentID}/delete`,{
        method:"DELETE",
    })
    commentBox.remove();
}
if(CommentForm)
    CommentForm.addEventListener("submit",handleCommentSave);
if(commentDeleteBtn)
    commentDeleteBtn.forEach((target) => target.addEventListener("click", handleCommemtDelete));



