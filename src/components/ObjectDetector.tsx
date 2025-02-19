import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { useDropzone } from "react-dropzone";
import { initializeObjectDetector } from "./objectDetectorHelper";
import useAppStore from "../stores/useAppStore";
import ControlBar from "./ControlBar";
import InfoPanel from "./InfoPanel";

function ObjectDetector() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef<d3.ZoomBehavior<HTMLDivElement, unknown> | null>(null);
  const [videoFilePath, setVideoFilePath] = useState<string | null>(null);

  const {
    videoWidth,
    videoHeight,
    setVideoDimensions,
    videoReady,
    setVideoReady,
  } = useAppStore();

  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [recording, setRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);

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

  useEffect(() => {
    if (videoRef.current && canvasRef.current) {
      const videoStream = videoRef.current.captureStream();
      const canvasStream = canvasRef.current.captureStream();

      // Merge both video and canvas into a single stream
      const combinedStream = new MediaStream([
        ...videoStream.getTracks(),
        ...canvasStream.getTracks(),
      ]);

      const recorder = new MediaRecorder(combinedStream, {
        mimeType: "video/webm",
      });

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setRecordedChunks((prev) => [...prev, event.data]);
        }
      };

      recorder.onstop = () => {
        // Download the recording when stopped
        if (recordedChunks.length > 0) {
          const blob = new Blob(recordedChunks, { type: "video/webm" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "recorded-session.webm";
          document.body.appendChild(a);
          a.click();
          URL.revokeObjectURL(url);
        }
      };

      setMediaRecorder(recorder);
    }
  }, [videoFilePath]);

  const handleStartRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "inactive") {
      setRecordedChunks([]); // Clear previous recordings
      mediaRecorder.start();
      setRecording(true);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
      setRecording(false);
    }
  };

  // Apply d3 zoom to the container
  useEffect(() => {
    if (!containerRef.current) return;

    const container = d3.select<HTMLDivElement, unknown>(containerRef.current);

    const zoom = d3
      .zoom<HTMLDivElement, unknown>()
      .scaleExtent([0.1, 1.1])
      .on("zoom", (event: d3.D3ZoomEvent<HTMLDivElement, unknown>) => {
        const transform = event.transform;
        requestAnimationFrame(() => {
          container.style(
            "transform",
            `translate(${transform.x}px, ${transform.y}px) scale(${transform.k})`
          );
        });
      });

    zoomRef.current = zoom;
    container.call(zoom);

    // Get viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Compute scale to fit but keep slightly smaller
    const scale = Math.min(
      (viewportWidth * 0.9) / videoWidth, // 90% of viewport width
      (viewportHeight * 0.9) / videoHeight // 90% of viewport height
    );

    // Calculate proper center (Fix: removed invalid percentage syntax)
    const centerX = (0.25 % -(viewportWidth - videoWidth * scale)) / 2;
    const centerY = (0.25 % -(viewportHeight - videoHeight * scale)) / 2;

    // Set initial transform
    const initialTransform = d3.zoomIdentity
      .translate(centerX, centerY)
      .scale(scale);
    container.call(zoom.transform, initialTransform);

    return () => {
      container.on(".zoom", null);
    };
  }, [videoFilePath, videoWidth, videoHeight]);

  return (
    <div className="w-[calc(100vw-360px)] h-full flex flex-col items-center justify-center bg-gray-100 relative overflow-hidden">
      {/* Dotted Grid Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(0,0,0,0.15)_2px,_transparent_2px)] bg-[length:18px_18px] pointer-events-none"></div>

      {/* Info Panel (only before video is uploaded) */}
      {!videoFilePath && <InfoPanel />}

      {/* Dropzone */}
      {!videoFilePath && (
        <div
          {...getRootProps()}
          className="dropzone"
          style={{
            border: "2px dashed #000",
            padding: "20px",
            textAlign: "center",
            width: "100%",
            height: "100%",
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

      {videoFilePath && (
        <ControlBar
          onStartRecording={handleStartRecording}
          onStopRecording={handleStopRecording}
          recording={recording}
        />
      )}
    </div>
  );
}

export default ObjectDetector;
