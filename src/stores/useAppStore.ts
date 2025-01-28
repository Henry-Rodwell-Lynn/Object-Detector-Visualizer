import { create } from "zustand";

interface AppState {
  // Video state
  videoWidth: number;
  videoHeight: number;
  videoReady: boolean;
  setVideoDimensions: (width: number, height: number) => void;
  setVideoReady: (ready: boolean) => void;

  // Object Detector controls
  threshold: number;
  setThreshold: (value: number) => void;

  // Bounding Box controls
  fill: boolean;
  fillColor: string;
  border: boolean;
  borderColor: string; // New border color state
  boxLineWidth: number;
  setFill: (value: boolean) => void;
  setFillColor: (color: string) => void;
  setBorder: (value: boolean) => void;
  setBorderColor: (color: string) => void; // New setter for border color
  setBoxLineWidth: (width: number) => void;

  // Text controls
  labelVisible: boolean;
  percentageVisible: boolean;
  textSize: number;
  textColor: string;
  setLabelVisible: (visible: boolean) => void;
  setPercentageVisible: (visible: boolean) => void;
  setTextSize: (size: number) => void;
  setTextColor: (color: string) => void;
}

const useAppStore = create<AppState>((set) => ({
  // Video state
  videoWidth: 1080,
  videoHeight: 1080,
  videoReady: false,
  setVideoDimensions: (width, height) =>
    set({
      videoWidth: width,
      videoHeight: height,
    }),
  setVideoReady: (ready) => set({ videoReady: ready }),

  // Object Detector controls
  threshold: 0.4,
  setThreshold: (value) => set({ threshold: value }),

  // Bounding Box controls
  fill: false,
  fillColor: "#000000",
  border: true,
  borderColor: "#FFFFFF", // Default white for the border
  boxLineWidth: 4,
  setFill: (value) => set({ fill: value }),
  setFillColor: (color) => set({ fillColor: color }),
  setBorder: (value) => set({ border: value }),
  setBorderColor: (color) => set({ borderColor: color }), // New setter
  setBoxLineWidth: (width) => set({ boxLineWidth: width }),

  // Text controls
  labelVisible: true,
  percentageVisible: true,
  textSize: 14,
  textColor: "#FF0000",
  setLabelVisible: (visible) => set({ labelVisible: visible }),
  setPercentageVisible: (visible) => set({ percentageVisible: visible }),
  setTextSize: (size) => set({ textSize: size }),
  setTextColor: (color) => set({ textColor: color }),
}));

export default useAppStore;
