import React, { useEffect, useRef } from "react";
import io from "socket.io-client";
import videojs from "video.js";
import "video.js/dist/video-js.css";

const socket = io("http://localhost:8000");

const VideoPlayer = ({ roomId, videoUrl }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    // Make sure video element is available
    if (!videoRef.current) return;

    // Make sure we have a video URL
    if (!videoUrl) {
      console.log("No video URL provided");
      return;
    }

    console.log("Attempting to play video:", videoUrl);

    // Initialize player only if it hasn't been initialized yet
    if (!playerRef.current) {
      const videoElement = videoRef.current;

      // Wait for the DOM to be ready
      const initializePlayer = () => {
        try {
          playerRef.current = videojs(videoElement, {
            controls: true,
            autoplay: false,
            fluid: true,
            sources: [{ src: videoUrl, type: "application/x-mpegURL" }],
          });

          playerRef.current.ready(() => {
            console.log("Video.js player is ready");
            socket.emit("join-room", roomId);
          });

          // Sync Playback from Backend
          const syncVideo = ({ time, state, volume, isFullscreen }) => {
            if (!playerRef.current) return;
            
            if (Math.abs(playerRef.current.currentTime() - time) > 1) {
              playerRef.current.currentTime(time);
            }

            if (state === "playing" && playerRef.current.paused()) {
              playerRef.current.play().catch(err => console.error("Play error:", err));
            } else if (state === "paused" && !playerRef.current.paused()) {
              playerRef.current.pause();
            }

            playerRef.current.volume(volume);

            if (isFullscreen && !playerRef.current.isFullscreen()) {
              playerRef.current.requestFullscreen();
            } else if (!isFullscreen && playerRef.current.isFullscreen()) {
              playerRef.current.exitFullscreen();
            }
          };

          socket.on("sync", syncVideo);

          // Emit Player State Changes (throttled to reduce network traffic)
          const throttle = (func, limit) => {
            let inThrottle;
            return function() {
              const args = arguments;
              const context = this;
              if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
              }
            };
          };

          const emitVideoState = throttle(() => {
            if (!playerRef.current) return;
            
            socket.emit("video-sync", {
              roomId,
              time: playerRef.current.currentTime(),
              state: playerRef.current.paused() ? "paused" : "playing",
              volume: playerRef.current.volume(),
              isFullscreen: playerRef.current.isFullscreen(),
            });
          }, 200); // Throttle to 5 updates per second max

          playerRef.current.on("play", emitVideoState);
          playerRef.current.on("pause", emitVideoState);
          playerRef.current.on("timeupdate", emitVideoState);
          playerRef.current.on("volumechange", emitVideoState);
          playerRef.current.on("fullscreenchange", emitVideoState);
        } catch (error) {
          console.error("Error initializing video player:", error);
        }
      };

      // Wait for a small delay to ensure DOM is ready
      setTimeout(initializePlayer, 0);
    } else {
      // Update source if player already exists
      try {
        playerRef.current.src([{ src: videoUrl, type: "application/x-mpegURL" }]);
      } catch (error) {
        console.error("Error updating video source:", error);
      }
    }

    // Cleanup function
    return () => {
      if (playerRef.current) {
        try {
          socket.off("sync");
          playerRef.current.dispose();
          playerRef.current = null;
        } catch (error) {
          console.error("Error disposing video player:", error);
        }
      }
    };
  }, [videoUrl, roomId]);

  return (
    <div data-vjs-player>
      <video 
        ref={videoRef} 
        className="video-js vjs-default-skin vjs-big-play-centered" 
      />
    </div>
  );
};

export default VideoPlayer;