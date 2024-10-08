import { FilesetResolver, ObjectDetector } from "@mediapipe/tasks-vision";

// Define your color palette
const colorPalette = {
  person: "#FF5733",        // Bright Orange-Red
  bicycle: "#33FF57",       // Bright Green
  car: "#5733FF",           // Bright Blue-Violet
  motorcycle: "#FF33F6",    // Hot Pink
  airplane: "#33FFF6",      // Neon Aqua
  bus: "#FFC133",           // Bright Yellow-Orange
  train: "#FF33A1",         // Magenta
  truck: "#33FFB5",         // Bright Mint
  boat: "#339BFF",          // Sky Blue
  traffic_light: "#FFD700", // Bright Gold
  fire_hydrant: "#FF3333",  // Bright Red
  stop_sign: "#FF33B8",     // Vibrant Magenta-Pink
  parking_meter: "#33D4FF", // Bright Cyan
  bench: "#FF33C9",         // Vibrant Pink
  bird: "#FF6F33",          // Bold Tangerine
  cat: "#FF33FF",           // Fluorescent Pink
  dog: "#33FF85",           // Neon Green
  horse: "#FF8A33",         // Bright Orange
  sheep: "#33FFEC",         // Bright Aqua
  cow: "#33D6FF",           // Bold Cyan
  elephant: "#33FFA1",      // Bright Mint Green
  bear: "#FF33D4",          // Vivid Pink
  zebra: "#FF33FF",         // Hot Pink
  giraffe: "#FF9933",       // Bold Orange
  backpack: "#33FF99",      // Neon Green
  umbrella: "#FF3333",      // Bright Red
  handbag: "#FF66FF",       // Fluorescent Pink
  tie: "#33FFC1",           // Bright Aqua-Mint
  suitcase: "#FF3380",      // Bold Hot Pink
  frisbee: "#33E8FF",       // Vivid Light Blue
  skis: "#33DFFF",          // Sky Blue
  snowboard: "#FF336F",     // Vibrant Pink-Red
  sports_ball: "#FFCC33",   // Bright Yellow
  kite: "#FF33FF",          // Bold Magenta
  baseball_bat: "#33FFFF",  // Neon Cyan
  baseball_glove: "#FF33E8",// Vibrant Pink
  skateboard: "#FF33B5",    // Neon Magenta
  surfboard: "#33FF8A",     // Bright Mint Green
  tennis_racket: "#FF3366", // Bold Pinkish-Red
  bottle: "#FF3333",        // Bright Red
  wine_glass: "#FF3385",    // Hot Pink
  cup: "#FF33FF",           // Fluorescent Pink
  fork: "#33FFF6",          // Bright Aqua
  knife: "#FF33D4",         // Vibrant Pink
  spoon: "#FF66FF",         // Bright Pink
  bowl: "#33FFDA",          // Neon Aqua
  banana: "#FFD700",        // Bright Gold
  apple: "#FF3333",         // Bright Red
  sandwich: "#FF9933",      // Bright Orange
  orange: "#FF5733",        // Bold Orange-Red
  broccoli: "#33FF66",      // Bright Green
  carrot: "#FF3333",        // Bright Red
  hot_dog: "#FF6633",       // Bold Orange
  pizza: "#FF9933",         // Bright Orange
  donut: "#FF33A1",         // Bold Pink
  cake: "#FF33FF",          // Fluorescent Pink
  chair: "#FF33B8",         // Bright Pink
  couch: "#FF3380",         // Vibrant Pink
  potted_plant: "#33FF99",  // Neon Green
  bed: "#FFB833",           // Bright Yellow
  dining_table: "#FF5733",  // Bright Orange-Red
  toilet: "#33B8FF",        // Bright Blue
  tv: "#33E8FF",            // Vivid Light Blue
  laptop: "#33FFB5",        // Neon Mint
  mouse: "#FF33E8",         // Hot Pink
  remote: "#FF3333",        // Bright Red
  keyboard: "#33FF66",      // Neon Green
  cell_phone: "#33DFFF",    // Bright Cyan
  microwave: "#FF33FF",     // Fluorescent Pink
  oven: "#FF9933",          // Bright Orange
  toaster: "#FF3385",       // Hot Pink
  sink: "#33FFF6",          // Neon Aqua
  refrigerator: "#FF33FF",  // Fluorescent Pink
  book: "#33FF66",          // Bright Green
  clock: "#FFD700",         // Bright Gold
  vase: "#FF33D4",          // Vibrant Pink
  scissors: "#33FFF6",      // Neon Aqua
  teddy_bear: "#FF6633",    // Bold Orange
  hair_drier: "#FF33FF",    // Fluorescent Pink
  toothbrush: "#FF3385",    // Hot Pink
};


export const initializeObjectDetector = async (
  videoRef,
  canvasRef,
  videoFilePath
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
    scoreThreshold: 0.4,
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

const renderLoop = async (objectDetector, videoRef, canvasRef) => {
  const video = videoRef.current;
  const canvasCtx = canvasRef.current.getContext("2d");

  const render = async () => {
    if (!video || video.paused || video.ended || !canvasCtx) return;

    if (video.currentTime !== lastVideoTime) {
      lastVideoTime = video.currentTime;

      // Run object detection for each video frame
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

    // Keep rendering the video and object detection
    requestAnimationFrame(render);
  };

  render(); // Start the render loop
};

const maxFrames = 2; // Number of frames to keep in the trail
let frameHistory = []; // Array to store the center points for the last frames
let frameCount = 0; // Global variable to track the frame count

const processResults = (
  results,
  canvasCtx,
  originalVideoWidth,
  originalVideoHeight,
  displayVideoWidth,
  displayVideoHeight
) => {
  if (!canvasCtx) return;

  const scaleX = displayVideoWidth / originalVideoWidth;
  const scaleY = displayVideoHeight / originalVideoHeight;

  frameCount++;

  // Clear the canvas before drawing new objects
  canvasCtx.clearRect(0, 0, canvasCtx.canvas.width, canvasCtx.canvas.height);

  // Array to store the center points of detected objects in the current frame
  const currentFrameCenters = [];

  results.detections.forEach((detection) => {
    const bbox = detection.boundingBox;

    if (bbox) {
      const label = detection.categories[0]?.categoryName.replace(" ", "_") || "Unknown"; // Replace space with underscore
      const score = (detection.categories[0]?.score * 100).toFixed(2); // Confidence score
      const x = bbox.originX * scaleX;
      const y = bbox.originY * scaleY;
      const width = bbox.width * scaleX;
      const height = bbox.height * scaleY;
      
      const color = colorPalette[label.toLowerCase()] || "#000000"; // Default to black if no color found

      // Set color for bounding box and text
      canvasCtx.strokeStyle = color;
      canvasCtx.lineWidth = 4; // Adjust line width for the box
      canvasCtx.strokeRect(x, y, width, height);

      // Draw the label background (black) before the text
      const textWidth = canvasCtx.measureText(`${label} (${score}%)`).width;
      const textHeight = 14; // Approximate height of the text

      canvasCtx.fillStyle = "black"; // Background color for the label
      canvasCtx.fillRect(x, y - textHeight - 4, textWidth + 6, textHeight + 4); // Background box behind text

      // Draw the label above the bounding box
      canvasCtx.fillStyle = "white"; // Text color (white)
      canvasCtx.font = "14px Arial"; // Set font for the label
      canvasCtx.fillText(`${label} (${score}%)`, x + 3, y - 5); // Display label and score with some padding

      // Calculate the center of the bounding box for trails
      const centerX = (bbox.originX + bbox.width / 2) * scaleX;
      const centerY = (bbox.originY + bbox.height / 2) * scaleY;

      // Add the current frame's center to the list
      currentFrameCenters.push({ x: centerX, y: centerY });
    }
  });
};
