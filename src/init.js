import "regenerator-runtime";
import "dotenv/config"
import "./db.js";
import app from "./server.js";

const PORT =process.env.PORT || 3000;
const severListeningHandle = (req,res,next) =>{
    console.log(`Sever listening on port http://localhost:${PORT}`);
}
app.listen(PORT, severListeningHandle);