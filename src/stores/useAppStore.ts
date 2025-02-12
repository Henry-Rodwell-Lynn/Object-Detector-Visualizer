import { create } from "zustand";

interface AppState {
  threshold: number;
  setThreshold: (value: number) => void;
  fill: boolean;
  setFill: (value: boolean) => void;
  fillColor: string;
  setFillColor: (value: string) => void;
  border: boolean;
  setBorder: (value: boolean) => void;
  borderColor: string;
  setBorderColor: (value: string) => void;
  boxLineWidth: number;
  setBoxLineWidth: (value: number) => void;
  labelVisible: boolean;
  setLabelVisible: (value: boolean) => void;
  percentageVisible: boolean;
  setPercentageVisible: (value: boolean) => void;
  textSize: number;
  setTextSize: (value: number) => void;
  textColor: string;
  setTextColor: (value: string) => void;

  // 🔴 Node Visualization
  nearestNodes: boolean;
  setNearestNodes: (value: boolean) => void;
  threeNearestNodes: boolean;
  setThreeNearestNodes: (value: boolean) => void;
  nodeColor: string;
  setNodeColor: (value: string) => void;
  nodeWidth: number;
  setNodeWidth: (value: number) => void;

  // 🎥 Video State
  videoWidth: number;
  videoHeight: number;
  videoReady: boolean;
  setVideoDimensions: (width: number, height: number) => void;
  setVideoReady: (ready: boolean) => void;
  
  maskObjects: boolean;
  setMaskObjects: (value: boolean) => void;
  maskColor: string;
  setMaskColor: (value: string) => void;

  // 🟢 Object Categories Toggles
  objectToggles: Record<string, boolean>;
  toggleObject: (key: string, value: boolean) => void;
}

const objectCategories = [
  "person", "bicycle", "car", "motorcycle", "airplane", "bus", "train", "truck",
  "boat", "traffic light", "fire hydrant", "stop sign", "parking meter", "bench",
  "bird", "cat", "dog", "horse", "sheep", "cow", "elephant", "bear", "zebra",
  "giraffe", "backpack", "umbrella", "handbag", "tie", "suitcase", "frisbee",
  "skis", "snowboard", "sports ball", "kite", "baseball bat", "baseball glove",
  "skateboard", "surfboard", "tennis racket", "bottle", "wine glass", "cup", 
  "fork", "knife", "spoon", "bowl", "banana", "apple", "sandwich", "orange", 
  "broccoli", "carrot", "hot dog", "pizza", "donut", "cake", "chair", "couch", 
  "potted plant", "bed", "dining table", "toilet", "tv", "laptop", "mouse", 
  "remote", "keyboard", "cell phone", "microwave", "oven", "toaster", "sink", 
  "refrigerator", "book", "clock", "vase", "scissors", "teddy bear", "hair drier", "toothbrush"
];

const initialObjectToggles = Object.fromEntries(objectCategories.map((obj) => [obj, true]));

const useAppStore = create<AppState>((set) => ({
  // 🟢 Object Detector Controls
  threshold: 0.4,
  setThreshold: (value) => set({ threshold: value }),

  // 🟡 Bounding Box Settings
  fill: false,
  setFill: (value) => set({ fill: value }),
  fillColor: "#FF0000",
  setFillColor: (value) => set({ fillColor: value }),
  border: true,
  setBorder: (value) => set({ border: value }),
  borderColor: "#FFFFFF",
  setBorderColor: (value) => set({ borderColor: value }),
  boxLineWidth: 2,
  setBoxLineWidth: (value) => set({ boxLineWidth: value }),

  // 🔵 Text Controls
  labelVisible: true,
  setLabelVisible: (value) => set({ labelVisible: value }),
  percentageVisible: false,
  setPercentageVisible: (value) => set({ percentageVisible: value }),
  textSize: 14,
  setTextSize: (value) => set({ textSize: value }),
  textColor: "#FFFFFF",
  setTextColor: (value) => set({ textColor: value }),

  // 🔴 Node Visualization
  nearestNodes: false,
  setNearestNodes: (value) => set({ nearestNodes: value }),
  threeNearestNodes: false,
  setThreeNearestNodes: (value) => set({ threeNearestNodes: value }),
  nodeColor: "#00FF00",
  setNodeColor: (value) => set({ nodeColor: value }),
  nodeWidth: 2,
  setNodeWidth: (value) => set({ nodeWidth: value }),

  // 🎥 Video State
  videoWidth: 1080,
  videoHeight: 1080,
  videoReady: false,
  setVideoDimensions: (width, height) =>
    set({ videoWidth: width, videoHeight: height }),
  setVideoReady: (ready) => set({ videoReady: ready }),
  maskObjects: false,
  setMaskObjects: (value) => set({ maskObjects: value }),
  maskColor: "#000000",
  setMaskColor: (value) => set({ maskColor: value }),

  // 🟢 Object Categories Toggles
  objectToggles: initialObjectToggles,
  toggleObject: (key, value) => set((state) => ({
    objectToggles: { ...state.objectToggles, [key]: value },
  })),
}));

export default useAppStore;
