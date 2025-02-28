import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const Upload = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a video file!");

    const formData = new FormData();
    formData.append("video", file);

    setUploading(true);

    try {
      const { data } = await axios.post(
        `http://localhost:8000/api/videos/upload/${roomId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      alert("Upload Successful!");
      navigate(`/room/${roomId}`);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Upload Video for Room: {roomId}</h2>
      <form onSubmit={handleUpload}>
        <input type="file" accept="video/*" onChange={(e) => setFile(e.target.files[0])} />
        <button type="submit" disabled={uploading}>
          {uploading ? "Uploading..." : "Upload & Proceed"}
        </button>
      </form>
    </div>
  );
};

export default Upload;
