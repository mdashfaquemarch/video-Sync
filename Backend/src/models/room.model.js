import mongoose from 'mongoose';

const RoomSchema = new mongoose.Schema({
    roomId: { type: String, unique: true, required: true },
    videoUrl: { type: String, default: "" },
    users: { type: Number, default: 1 },
    playbackTime: { type: Number, default: 0 }, 
    isPlaying: { type: Boolean, default: false }, 
    volume: { type: Number, default: 1 }, 
    isFullscreen: { type: Boolean, default: false }
  });


export const Room = mongoose.model("Room", RoomSchema);