import {Room} from "../models/room.model.js";

// Create a new Room
export const createRoom = async (req, res) => {
    try {
        const { roomId } = req.body;
        console.log(roomId)
        let room = await Room.findOne({ roomId });

        if (!room) {
            room = new Room({ roomId});
            await room.save();
        }

        res.json({ roomId, message: "Room created successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
