import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import roomRoutes from "./routes/room.route.js";
import videoRoutes from "./routes/video.route.js";
import setupSockets from "./utils/syncSocket.js";
import http from "http";
import cors from "cors";

dotenv.config();
connectDB();

const app = express();

app.use(
    cors({
      origin: ["http://localhost:3000", "http://localhost:5173"],
      credentials: true
    })
  )
  
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*") // watch it
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next()
  })
app.use(cors());
app.use(express.json());
app.use("/public", express.static("public", {
  setHeaders: (res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "application/vnd.apple.mpegurl");
  }
}));

app.use(express.urlencoded({extended:true}))




app.use("/api/rooms", roomRoutes);
app.use("/api/videos", videoRoutes);

const server = http.createServer(app);
setupSockets(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT , () => console.log(`🚀 Server running ${PORT}`));
