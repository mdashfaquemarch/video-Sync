import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();

  const createRoom = async () => {
    if (!roomId) return alert("Enter a Room ID!");
    
    try {
      await axios.post("http://localhost:8000/api/rooms/create", { roomId });
      navigate(`/upload/${roomId}`);
    } catch (error) {
      console.error("Error creating room:", error);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Create a Room</h2>
      <input
        type="text"
        placeholder="Enter Room ID"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      />
      <button onClick={createRoom}>Create & Go to Upload</button>
    </div>
  );
};

export default Home;
