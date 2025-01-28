import { useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { initializeObjectDetector } from "./objectDetectorHelper";
import useAppStore from "../stores/useAppStore";
import CustomizationGUI from "./CustomizationGUI";

function ObjectDetector() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [videoFilePath, setVideoFilePath] = useState<string | null>(null);

  // Access Zustand store
  const { videoWidth, videoHeight, setVideoDimensions, videoReady, setVideoReady } =
    useAppStore();

  // Dropzone handler
  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const videoURL = URL.createObjectURL(file); // Generate blob URL for the video
      setVideoFilePath(videoURL); // Store file path locally
      setVideoReady(false); // Reset ready state for new video
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "video/*": [] }, // Accept video files only
    onDrop,
  });

  // Load video metadata and set dimensions
  useEffect(() => {
    const videoElement = videoRef.current;

    if (videoFilePath && videoElement) {
      console.log("Setting video source...");
      videoElement.src = videoFilePath;

      videoElement.onloadedmetadata = () => {
        console.log("Video metadata loaded:");
        const width = videoElement.videoWidth;
        const height = videoElement.videoHeight;

        console.log("Width:", width, "Height:", height);

        // Store video dimensions in Zustand (no re-render triggered)
        setVideoDimensions(width, height);

        // Mark video as ready
        setVideoReady(true);
      };
    }
  }, [videoFilePath, setVideoDimensions, setVideoReady]);

  // Initialize the object detector after video dimensions are set
  useEffect(() => {
    if (videoReady && videoRef.current && canvasRef.current) {
      console.log("Initializing Object Detector...");
      initializeObjectDetector(videoRef, canvasRef, videoFilePath!);
    }
  }, [videoReady, videoFilePath]);

  return (
    <div className="w-[100vw] h-[100vh] flex justify-center items-center">
      
      <CustomizationGUI />

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
            <p>Drag & drop a video file here, or click to select a file</p>
          )}
        </div>
      )}

      {/* Video and Canvas */}
      {videoFilePath && (
        <div
          className="absolute"
          style={{
            width: videoWidth,
            height: videoHeight,
          }}
        >
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            className="absolute top-0 left-0 w-full h-full"
          />
          <canvas
            ref={canvasRef}
            width={videoWidth}
            height={videoHeight}
            className="absolute top-0 left-0"
            style={{ backgroundColor: "transparent" }}
          />
        </div>
      )}
    </div>
  );
}

export default ObjectDetector;
