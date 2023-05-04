import "dotenv/config"
import "./db.js";
import app from "./server.js";

const PORT = 8000;
const severListeningHandle = (req,res,next) =>{
    console.log(`Sever listening on port http://localhost:${PORT}`);
}
app.listen(PORT, severListeningHandle);