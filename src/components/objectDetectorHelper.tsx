/* eslint-disable @typescript-eslint/no-explicit-any */
import { FilesetResolver, ObjectDetector } from "@mediapipe/tasks-vision";
import useAppStore from "../stores/useAppStore";

// ✅ Define types for function parameters
export const initializeObjectDetector = async (
  videoRef: React.RefObject<HTMLVideoElement>,
  canvasRef: React.RefObject<HTMLCanvasElement>,
  videoFilePath: string
) => {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
  );

  const objectDetector = await ObjectDetector.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: `https://storage.googleapis.com/mediapipe-models/object_detector/efficientdet_lite2/float32/1/efficientdet_lite2.tflite`,
      delegate: "GPU",
    },
    runningMode: "VIDEO",
    scoreThreshold: useAppStore.getState().threshold,
  });

  const video = videoRef.current;
  const canvas = canvasRef.current;

  if (video && canvas) {
    video.src = videoFilePath;
    video.onloadeddata = () => {
      video.play();
      renderLoop(objectDetector, videoRef, canvasRef);
    };
  }
};

let lastVideoTime = -1;

// ✅ Explicitly define function types
const renderLoop = async (
  objectDetector: ObjectDetector,
  videoRef: React.RefObject<HTMLVideoElement>,
  canvasRef: React.RefObject<HTMLCanvasElement>
) => {
  const video = videoRef.current;
  const canvasCtx = canvasRef.current?.getContext("2d");

  const render = async () => {
    if (!video || video.paused || video.ended || !canvasCtx) return;

    if (video.currentTime !== lastVideoTime) {
      lastVideoTime = video.currentTime;

      const results = await objectDetector.detectForVideo(video, performance.now());
      processResults(
        results,
        canvasCtx,
        video.videoWidth,
        video.videoHeight,
        video.clientWidth,
        video.clientHeight
      );
    }

    requestAnimationFrame(render);
  };

  render();
};

// ✅ Define types for function parameters
const processResults = (
  results: any,
  canvasCtx: CanvasRenderingContext2D,
  originalVideoWidth: number,
  originalVideoHeight: number,
  displayVideoWidth: number,
  displayVideoHeight: number
) => {
  const {
    textColor,
    textSize,
    borderColor,
    boxLineWidth,
    labelVisible,
    percentageVisible,
    fill,
    fillColor,
    border,
    nearestNodes,
    threeNearestNodes,
    nodeColor,
    nodeWidth,
    maskObjects,
    maskColor,
  } = useAppStore.getState();

  const scaleX = displayVideoWidth / originalVideoWidth;
  const scaleY = displayVideoHeight / originalVideoHeight;

  canvasCtx.clearRect(0, 0, canvasCtx.canvas.width, canvasCtx.canvas.height);

  // 🟢 DRAW MASK FIRST
  if (maskObjects) {
    canvasCtx.fillStyle = maskColor;
    canvasCtx.fillRect(0, 0, displayVideoWidth, displayVideoHeight);
    canvasCtx.globalCompositeOperation = "destination-out"; // Cut out bounding boxes
  }

  const boundingBoxCenters: { centerX: number; centerY: number }[] = []; // ✅ Explicitly define array type

  results.detections.forEach((detection: any) => {
    const bbox = detection.boundingBox;

    if (bbox) {
      const x = bbox.originX * scaleX;
      const y = bbox.originY * scaleY;
      const width = bbox.width * scaleX;
      const height = bbox.height * scaleY;

      const centerX = x + width / 2;
      const centerY = y + height / 2;
      boundingBoxCenters.push({ centerX, centerY });

      // 🔲 Draw bounding box fill
      if (fill) {
        canvasCtx.fillStyle = fillColor;
        canvasCtx.fillRect(x, y, width, height);
      }

      // 🔲 Draw bounding box border
      if (border) {
        canvasCtx.strokeStyle = borderColor;
        canvasCtx.lineWidth = boxLineWidth;
        canvasCtx.strokeRect(x, y, width, height);
      }

      // 🔤 Draw text labels
      if (labelVisible) {
        const category = detection.categories[0]?.categoryName || "Unknown";
        const score = percentageVisible
          ? `(${(detection.categories[0]?.score * 100).toFixed(1)}%)`
          : "";

        canvasCtx.fillStyle = textColor;
        canvasCtx.font = `${textSize}px Arial`;
        canvasCtx.fillText(`${category} ${score}`, x, y - 5);
      }
    }
  });

  // ✅ Reset composite operation to normal before drawing nodes
  if (maskObjects) {
    canvasCtx.globalCompositeOperation = "source-over";
  }

  // 🔗 **DRAW NODE CONNECTIONS** (Nearest Nodes or Three Nearest Nodes)
  if (nearestNodes || threeNearestNodes) {
    canvasCtx.strokeStyle = nodeColor;
    canvasCtx.lineWidth = nodeWidth;

    boundingBoxCenters.forEach((boxA, index) => {
      const distances: { index: number; distance: number }[] = []; // ✅ Explicitly define array type

      boundingBoxCenters.forEach((boxB, otherIndex) => {
        if (index !== otherIndex) {
          const distance = Math.sqrt(
            Math.pow(boxA.centerX - boxB.centerX, 2) +
              Math.pow(boxA.centerY - boxB.centerY, 2)
          );
          distances.push({ index: otherIndex, distance });
        }
      });

      // Sort by nearest distance
      distances.sort((a, b) => a.distance - b.distance);

      // Determine how many connections to draw
      const numConnections = threeNearestNodes ? 3 : 1;

      for (let i = 0; i < numConnections; i++) {
        if (distances[i]) { // ✅ Fix possible undefined index issue
          const nearestBox = boundingBoxCenters[distances[i].index];
          if (nearestBox) {
            canvasCtx.beginPath();
            canvasCtx.moveTo(boxA.centerX, boxA.centerY);
            canvasCtx.lineTo(nearestBox.centerX, nearestBox.centerY);
            canvasCtx.stroke();
          }
        }
      }
    });
  }
};
