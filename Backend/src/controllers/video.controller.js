import { Room } from "../models/room.model.js";
import convertToHLS from "../utils/ffmpegHelper.js";
import fs from "fs";
import path from "path";

// Upload Video & Convert to HLS
export const uploadVideo = async (req, res) => {
  try {
    const { roomId } = req.params;
    const room = await Room.findOne({ roomId });
    console.log("rooms", room);
    if (!room) return res.status(404).json({ error: "Room not found" });

    const inputPath = req.file.path;
    const outputFolder = `public/${roomId}`;
    console.log(`inputPath: ${inputPath} \n outputfolder: ${outputFolder}`);
    const hlsPath = await convertToHLS(inputPath, outputFolder);
    room.videoUrl = hlsPath.replace("public/", "");
    await room.save();

    res.json({ videoUrl: room.videoUrl, message: "Video uploaded and processed!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getRoomDetails = async (req, res) => {
  try {
    const { roomId } = req.params;
    const room = await Room.findOne({ roomId });

    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    console.log(`Video URL: http://localhost:8000/public/${room.videoUrl}`);

    res.json({
      roomId: room.roomId,
      videoUrl: `http://localhost:8000/public/${room.videoUrl}`, // Direct video URL
      users: room.users,
      playbackTime: room.playbackTime,
      isPlaying: room.isPlaying,
      volume: room.volume,
      isFullscreen: room.isFullscreen
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
