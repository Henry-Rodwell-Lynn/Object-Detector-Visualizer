import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { useDropzone } from "react-dropzone";
import { initializeObjectDetector } from "./objectDetectorHelper";
import useAppStore from "../stores/useAppStore";
import CustomizationGUI from "./CustomizationGUI";
import ControlBar from "./ControlBar";
import InfoPanel from "./InfoPanel";

function ObjectDetector() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef<any>(null);
  const [videoFilePath, setVideoFilePath] = useState<string | null>(null);

  const { videoWidth, videoHeight, setVideoDimensions, videoReady, setVideoReady } = useAppStore();

  // Dropzone for video upload
  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const videoURL = URL.createObjectURL(file);
      setVideoFilePath(videoURL);
      setVideoReady(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "video/*": [] },
    onDrop,
  });

  // Load video metadata and set dimensions
  useEffect(() => {
    const videoElement = videoRef.current;

    if (videoFilePath && videoElement) {
      videoElement.src = videoFilePath;

      videoElement.onloadedmetadata = () => {
        const width = videoElement.videoWidth;
        const height = videoElement.videoHeight;

        setVideoDimensions(width, height);
        setVideoReady(true);
      };
    }
  }, [videoFilePath, setVideoDimensions, setVideoReady]);

  // Initialize object detector
  useEffect(() => {
    if (videoReady && videoRef.current && canvasRef.current) {
      initializeObjectDetector(videoRef, canvasRef, videoFilePath!);
    }
  }, [videoReady, videoFilePath]);

  // Apply d3 zoom to the container
  useEffect(() => {
    if (!containerRef.current) return;

    const container = d3.select(containerRef.current);

    const zoom = d3
      .zoom()
      .scaleExtent([0.1, 3]) // Allow zoom between 10% and 300%
      .on("zoom", (event) => {
        const transform = event.transform;
        container.style(
          "transform",
          `translate(${transform.x}px, ${transform.y}px) scale(${transform.k})`
        );
      });

    zoomRef.current = zoom;
    container.call(zoom);

    // Set initial zoom to fit video within the viewport
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const scale = Math.min(viewportWidth / videoWidth, viewportHeight / videoHeight);

    const centerX = (viewportWidth - videoWidth * scale) / 2;
    const centerY = (viewportHeight - videoHeight * scale) / 2;

    const initialTransform = d3.zoomIdentity.translate(centerX, centerY).scale(scale);

    container.call(zoom.transform, initialTransform);

    return () => {
      container.on(".zoom", null);
    };
  }, [videoFilePath, videoWidth, videoHeight]);

  return (
    <div className="w-[100vw] h-[100vh] flex flex-col items-center justify-center">
      {/* Info Panel */}
      <InfoPanel />

      {/* Dropzone */}
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
          {isDragActive ? <p>Drop the video here...</p> : <p>Drag & drop a video file here, or click to select a file</p>}
        </div>
      )}

      {/* Video and Canvas */}
      {videoFilePath && (
        <div
          ref={containerRef}
          className="absolute"
          style={{
            width: `${videoWidth}px`,
            height: `${videoHeight}px`,
          }}
        >
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            className="absolute"
            style={{
              width: `${videoWidth}px`,
              height: `${videoHeight}px`,
            }}
          />
          <canvas
            ref={canvasRef}
            width={videoWidth}
            height={videoHeight}
            className="absolute"
          />
        </div>
      )}

      {/* Customization GUI */}
      {videoFilePath && <CustomizationGUI />}

      {/* Control Bar */}
      {videoFilePath && <ControlBar />}
    </div>
  );
}

export default ObjectDetector;
