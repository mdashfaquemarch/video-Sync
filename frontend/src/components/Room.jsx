import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import VideoPlayer from "../components/VideoPlayer";
import axios from "axios";

const Room = () => {
  const { roomId } = useParams();
  const [videoUrl, setVideoUrl] = useState("");

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const { data } = await axios.get(`http://localhost:8000/api/videos/${roomId}`);
        
        setVideoUrl(data.videoUrl);
      } catch (error) {
        console.error("Error fetching room details:", error);
      }
    };

    fetchRoomDetails();
  }, [roomId]);

  return (
    <div>
      <h2>Room: {roomId}</h2>
      {videoUrl ? <VideoPlayer roomId={roomId} videoUrl={videoUrl} /> : <p>Loading video...</p>}
    </div>
  );
};

export default Room;
