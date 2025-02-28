import { Server } from "socket.io";
import {Room} from "../models/room.model.js";

const setupSockets = (server) => {
  const io = new Server(server, { cors: { origin: "*" } });

  io.on("connection", (socket) => {
    console.log("User Connected:", socket.id);

    socket.on("join-room", async (roomId) => {
      socket.join(roomId);
      const room = await Room.findOne({ roomId });

      if (room) {
        io.to(roomId).emit("sync", {
          time: room.playbackTime,
          state: room.isPlaying ? "playing" : "paused",
          volume: room.volume,
          isFullscreen: room.isFullscreen
        });
      }
    });

    socket.on("video-sync", async ({ roomId, time, state, volume }) => {
      await Room.updateOne({ roomId }, { playbackTime: time, isPlaying: state === "playing", volume });
      io.to(roomId).emit("sync", { time, state, volume });
    });

    socket.on("disconnect", () => console.log("User Disconnected:", socket.id));
  });
};

export default setupSockets;
