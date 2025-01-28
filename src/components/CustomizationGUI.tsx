import { useControls, folder } from "leva";
import useAppStore from "../stores/useAppStore";

const CustomizationGUI = () => {
  // Access Zustand store actions
  const {
    threshold,
    setThreshold,
    fill,
    setFill,
    fillColor,
    setFillColor,
    border,
    setBorder,
    borderColor,
    setBorderColor,
    boxLineWidth,
    setBoxLineWidth,
    labelVisible,
    setLabelVisible,
    percentageVisible,
    setPercentageVisible,
    textSize,
    setTextSize,
    textColor,
    setTextColor,
  } = useAppStore();

  useControls({
    // Object Detector Controls
    "Object Detector Controls": folder({
      Threshold: {
        value: threshold,
        min: 0.1,
        max: 0.9,
        step: 0.1,
        onChange: (value) => setThreshold(value),
      },
    }),

    // Bounding Box Controls
    "Bounding Box Controls": folder({
      Fill: {
        value: fill,
        label: "Fill Box",
        onChange: (value) => setFill(value),
      },
      FillColor: {
        value: fillColor,
        label: "Fill Color",
        onChange: (color) => setFillColor(color),
      },
      Border: {
        value: border,
        label: "Show Border",
        onChange: (value) => setBorder(value),
      },
      BorderColor: {
        value: borderColor,
        label: "Border Color", // New input for border color
        onChange: (color) => setBorderColor(color),
      },
      BoxLineWidth: {
        value: boxLineWidth,
        min: 1,
        max: 20,
        step: 1,
        label: "Border Width",
        onChange: (width) => setBoxLineWidth(width),
      },
    }),

    // Text Controls
    "Text Controls": folder({
      Label: {
        value: labelVisible,
        label: "Show Label",
        onChange: (visible) => setLabelVisible(visible),
      },
      Percentage: {
        value: percentageVisible,
        label: "Show Percentage",
        onChange: (visible) => setPercentageVisible(visible),
      },
      TextSize: {
        value: textSize,
        min: 8,
        max: 30,
        step: 1,
        label: "Label Size",
        onChange: (size) => setTextSize(size),
      },
      TextColor: {
        value: textColor,
        label: "Label Color",
        onChange: (color) => setTextColor(color),
      },
    }),
  });

  return null; // Leva automatically renders the GUI
};

export default CustomizationGUI;
