import express from "express";

// app 생성
const app = express();
const PORT = 4000;

// application 설정
const handlerHome =(req,res)=>{
    res.end();
}
app.get("/",handlerHome)

// app실행
const handleListening = () => console.log(`Sever listening on port http://localhost:${PORT}`);
app.listen(PORT,handleListening);


