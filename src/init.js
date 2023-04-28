import "./db.js";
import Video from "./models/video.js";
import User from "./models/User.js";
import app from "./server.js";

const PORT = 8000;
const severListeningHandle = (req,res,next) =>{
    console.log(`Sever listening on port http://localhost:${PORT}`);
}
app.listen(PORT, severListeningHandle);