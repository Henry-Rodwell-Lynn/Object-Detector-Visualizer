import React, { useEffect, useRef, useState } from "react";
import { initializeObjectDetector } from "./objectDetectorHelper";
import { useDropzone } from "react-dropzone";

function ObjectDetector() {
  const vWidth = 1080;
  const vHeight = 1080;
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [videoFilePath, setVideoFilePath] = useState<string | null>(null); // Corrected state typing

  // Dropzone handler
  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const videoURL = URL.createObjectURL(file); // Create URL for the video file
      setVideoFilePath(videoURL); // Set the video file path to play
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "video/*": [] }, // Fixed MIME type
    onDrop,
  });

  useEffect(() => {
    const videoElement = videoRef.current;

    if (videoFilePath && videoElement) {
      initializeObjectDetector(videoRef, canvasRef, videoFilePath);
    }

    return () => {
      if (videoElement) {
        const stream = videoElement.srcObject as MediaStream;
        if (stream) {
          const tracks = stream.getTracks();
          tracks.forEach((track: MediaStreamTrack) => track.stop()); // Explicit typing
        }
        videoElement.srcObject = null;
        videoElement.src = "";
      }
    };
  }, [videoFilePath]);

  return (
    <div className="w-[100vw] h-[100vh] flex justify-center items-center">
      {!videoFilePath && (
        <div
          {...getRootProps()}
          className="dropzone"
          style={{
            border: "2px dashed #000",
            padding: "20px",
            textAlign: "center",
            width: "100vw",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#f9f9f9",
          }}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the video here...</p>
          ) : (
            <p>Drag & drop a 1080 x 1080 video file here, or click to select a file</p>
          )}
        </div>
      )}

      {videoFilePath && (
        <div className="relative" style={{ width: vWidth, height: vHeight }}>
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            className="absolute top-0 left-0 w-full h-full object-cover opacity-100"
          />
          <canvas
            ref={canvasRef}
            width={vWidth}
            height={vHeight}
            className="absolute top-0 left-0"
            style={{
              backgroundColor: "transparent",
            }}
          />
        </div>
      )}
    </div>
  );
}

export default ObjectDetector;
